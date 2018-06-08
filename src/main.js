import Vue from 'vue'
import App from './App'
import router from './router'
import Axios from 'axios'
import Qs from 'qs'

Vue.prototype.$axios = Axios;

Axios.defaults.baseURL = 'https://www.vue-js.com';
Axios.defaults.headers.post['Content-Type'] = 'application/x-www-form-urlencoded';

import '@/assets/js/config.js'

// Vue.config.productionTip = false

// 添加请求拦截器
Axios.interceptors.request.use(function (config) {
    // 在发送请求之前做些什么

    if(config.method == "post"){
        config.data = Qs.stringify(config.data)
    }
    return config;
}, function (error) {
    // 对请求错误做些什么
    return Promise.reject(error);
});

// 添加响应拦截器
Axios.interceptors.response.use(function (response) {
    // 对响应数据做点什么
    // console.log(response);
    return response;
}, function (error) {
    // 对响应错误做点什么
    return Promise.reject(error);
});

/* eslint-disable no-new */
new Vue({
  el: '#app',
  router,
  components: { App },
  template: '<App/>'
})
