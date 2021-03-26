import Vue from 'vue';
import App from './App.vue';
import router from './router';
import ElementUI from 'element-ui';
import VueI18n from 'vue-i18n';
import { messages } from './components/common/i18n';
import 'element-ui/lib/theme-chalk/index.css'; // 默认主题
// import './assets/css/theme-green/index.css'; // 浅绿色主题
import './assets/css/icon.css';
import './components/common/directives';
import 'babel-polyfill';
//添加axios
import axios from 'axios'
Vue.prototype.$axios=axios;
//添加vue-clipboard2
import VueClipboard from 'vue-clipboard2'
Vue.use(VueClipboard);

Vue.config.productionTip = false;
Vue.use(VueI18n);
Vue.use(ElementUI, {
    size: 'small'
});
const i18n = new VueI18n({
    locale: 'zh',
    messages
});

//使用钩子函数对路由进行权限跳转
router.beforeEach((to, from, next) => {
    //给网页添加标题
    document.title = `${to.meta.title} | kbdog磁力`;
    //获取localStorage中存放的cookie
    const role = localStorage.getItem('ms_username');
    const auth=localStorage.getItem('ms_authority');
    const _this=this;
    //如果进行了登出操作会从localStorage中删除ms_username,这里通过判断是否存在key值为ms_username的cookie判断是否跳转登录页面
    if (!role && to.path !== '/login') {
        next('/login');
    }
    //在已登录状态从地址栏直接访问login页面会直接登出
    else if(role&&to.path=='/login'){
        localStorage.removeItem('ms_username');
        localStorage.removeItem('ms_uid');
        localStorage.removeItem('ms_authority');
        alert("您已退出登录");
        next('/login');
    }
    //访问需要权限的页面时进行权限判断
    else if (to.meta.permission) {
        // 如果是高级用户权限则可进入，这里只是简单的模拟管理员权限而已
        // role === '1' ? next() : next('/403');
        // 管理员权限继续访问，其他权限跳转403界面
        if(auth==='2'){
            next();
        }else {
            next('/403');
        }
    }
    //其他情况
    else {
        // 简单的判断IE10及以下不进入富文本编辑器，该组件不兼容
        if (navigator.userAgent.indexOf('MSIE') > -1 && to.path === '/editor') {
            Vue.prototype.$alert('vue-quill-editor组件不兼容IE10及以下浏览器，请使用更高版本的浏览器查看', '浏览器不兼容通知', {
                confirmButtonText: '确定'
            });
        } else {
            next();
        }
    }
});

new Vue({
    router,
    i18n,
    render: h => h(App)
}).$mount('#app');
