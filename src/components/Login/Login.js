import {
  user as UserApi,
  common as Common
} from '../../config/request.js';

module.exports = {
  name: 'login',
  data() {
    return {
      winSize: {
        width: '',
        height: ''
      },

      formOffset: {
        position: 'absolute',
        left: '',
        top: ''
      },

      remumber: this.$store.state.user.remumber,

      login_actions: {
        disabled: false
      },

      data: {
        username: '',
        password: '',
        captcha: '',
        // token: ''
      },
      captchaSrc: '/slsAdminApi/common/captcha.do',
      rule_data: {
        username: [{
          required: true,
          message: '用户名不能为空！',
          trigger: 'blur'
        }],
        password: [{
          required: true,
          message: '密码不能为空！',
          trigger: 'blur'
        }],
      }
    }
  },
  methods: {
    setSize() {
      this.winSize.width = $(window).width() + "px";
      this.winSize.height = $(window).height() + "px";

      this.formOffset.left = (parseInt(this.winSize.width) / 2 - 175) + 'px';
      this.formOffset.top = (parseInt(this.winSize.height) / 2 - 178) + 'px';
    },
    getcaptcha(){
      var random = Math.ceil(Math.random() * 10);
      this.captchaSrc="/slsAdminApi/common/captcha.do?r="+random;
    },
    login(ref) {
      this.$refs[ref].validate((valid) => {
        if (valid) {
          this.login_actions.disabled = true;
          //如果记住密码，提交的信息包括真实token，密码则是假的
          //服务端登录验证优先级：用户名必须，其次先取token，不存在时再取密码
          UserApi.login.call(this, this[ref], data => {
            if (!data.isSuccess) {
              this.$notify({
                title: '错误',
                message: data.message,
                type: 'error'
              });
              this.login_actions.disabled = false;
              this.getcaptcha();
            } else {
              //登录成功之后，验证是否记住密码，如果记住密码，本地保存记住信息
              //如果没有记住，就初始化本地记住信息
              if (this.remumber.remumber_flag === true) {
                this.$store.dispatch('update_remumber', {
                  remumber_flag: this.remumber.remumber_flag,
                  remumber_login_info: {
                    username: this[ref].username,
                    token: data.userinfo.token
                  }
                });
              } else {
                this.$store.dispatch('remove_remumber');
              }

              this.$store.dispatch('update_userinfo', {
                userinfo: data.obj
              }).then(() => {
                this.login_actions.disabled = false;
                this.$router.push({path: '/welcome'});
              });

            }
          }, () => {
            this.login_actions.disabled = false;
          }, () => {
            this.login_actions.disabled = false;
          });
        }
      });
    },

    resetForm(ref) {
      this.$refs[ref].resetFields();
    }
  },
  created() {
    this.setSize();
    $(window).resize(() => {
      this.setSize();
    });
  },
  mounted() {
    //如果上次登录选择的是记住密码并登录成功，则会保存状态，用户名以及token
    if (this.remumber.remumber_flag === true) {
      this.data.username = this.remumber.remumber_login_info.username;
      this.data.password = this.remumber.remumber_login_info.token.substring(0, 16);
      this.$set(this.data, 'token', this.remumber.remumber_login_info.token);
    }
  }
}
