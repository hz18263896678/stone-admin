import Vue from 'vue';
import axios from 'axios';
import VueAxios from 'vue-axios';
import qs from 'qs'
Vue.use(VueAxios, axios);

// 导入封装的回调函数
import {
	cbs,
	gbs
} from 'config/settings.js';

// 动态设置本地和线上接口域名
Vue.axios.defaults.baseURL = gbs.host;
Vue.axios.defaults.headers.post['Content-Type'] = 'application/x-www-form-urlencoded';
/**
 * 封装axios的通用请求
 * @param  {string}   type      get或post
 * @param  {string}   url       请求的接口URL
 * @param  {object}   data      传的参数，没有则传空对象
 * @param  {Function} fn        回调函数
 * @param  {boolean}   tokenFlag 是否需要携带token参数，为true，不需要；false，需要。一般除了登录，都需要
 */
module.exports = function(type, url, data, fn, tokenFlag, errFn) {

	// 分发显示加载样式任务
	this.$store.dispatch('show_loading');

	if (tokenFlag !== true) {
		data.token = this.$store.state.user.userinfo.token;
	}

	if (type === 'get') {
		var datas = {
			params: data
		};
	} else {
		var datas = qs.stringify(data);
	}

	Vue.axios[type](url, datas).then((res) => {
		if (res.status === 200) {
			fn(res.data);
		}else if(res.data.code==505){
        Vue.$router.push({path:'/login'})
    } else {
			// 调用全局配置错误回调
			cbs.statusError.call(this, res.data);

			if (tokenFlag === true) {
				errFn && errFn.call(this);
			}
		}
		this.$store.dispatch('hide_loading');
	}).catch((err) => {

		//调用全局配置错误回调
		// console.log(err);
    console.info(err)
		this.$store.dispatch('hide_loading');
		cbs.requestError.call(this, err);

		errFn && errFn.call(this);
	});

};
