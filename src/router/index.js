import Vue from 'vue';
import Router from 'vue-router';

Vue.use(Router);

export default new Router({
    routes: [
        //直接访问地址栏默认跳转
        {
            path: '/',
            redirect: '/dashboard'
        },

        //加载整个页面框架Home.vue
        {
            path: '/',
            component: () => import(/* webpackChunkName: "home" */ '../components/common/Home.vue'),
            meta: { title: '自述文件' },
            children: [
                {
                    path: '/dashboard',
                    component: () => import(/* webpackChunkName: "dashboard" */ '../components/sidebar/Dashboard.vue'),
                    meta: { title: '系统首页' }
                },
                {
                    path: '/icon',
                    component: () => import(/* webpackChunkName: "icon" */ '../components/page/Icon.vue'),
                    meta: { title: '自定义图标' }
                },
                {
                    path: '/table',
                    component: () => import(/* webpackChunkName: "table" */ '../components/sidebar/BaseTable.vue'),
                    meta: {
                        title: '磁力链接'
                    }
                },
                {
                    path: '/users',
                    component: () => import('../components/sidebar/UserManage.vue'),
                    meta: {
                        title: '用户管理',
                        permission: true
                    }
                },
                {
                    path: '/comics',
                    component: ()=>import('../components/comic/Comics.vue'),
                    meta:{
                        title: '漫画爬虫'
                    }
                },
                {
                    path: '/chapters',
                    name: 'chapters',
                    component:()=>import('../components/comic/Chapters.vue'),
                    meta:{
                        title:'章节信息'
                    }
                },
                {
                    path:'/pictures',
                    name:'pictures',
                    component:()=>import('../components/comic/Pictures.vue'),
                    meta:{
                        title:'漫画信息'
                    }
                },
                {
                    path:'/crawlerMagnet',
                    component:()=>import('../components/page/CrawlerMagnet.vue'),
                    meta:{
                        title:'磁力爬虫'
                    }
                },
                {
                    path: '/tabs',
                    component: () => import(/* webpackChunkName: "tabs" */ '../components/page/Tabs.vue'),
                    meta: { title: 'tab选项卡' }
                },
                {
                    path: '/form',
                    component: () => import(/* webpackChunkName: "form" */ '../components/page/BaseForm.vue'),
                    meta: { title: '基本表单' }
                },
                {
                    // 富文本编辑器组件
                    path: '/editor',
                    component: () => import(/* webpackChunkName: "editor" */ '../components/page/VueEditor.vue'),
                    meta: { title: '富文本编辑器' }
                },
                {
                    // markdown组件
                    path: '/markdown',
                    component: () => import(/* webpackChunkName: "markdown" */ '../components/page/Markdown.vue'),
                    meta: { title: 'markdown编辑器' }
                },
                {
                    // 图片上传组件
                    path: '/upload',
                    component: () => import(/* webpackChunkName: "upload" */ '../components/page/Upload.vue'),
                    meta: { title: '文件上传' }
                },
                {
                    // vue-schart组件
                    path: '/charts',
                    component: () => import(/* webpackChunkName: "chart" */ '../components/sidebar/BaseCharts.vue'),
                    meta: { title: '收录趋势' }
                },
                {
                    // 拖拽列表组件
                    path: '/drag',
                    component: () => import(/* webpackChunkName: "drag" */ '../components/page/DragList.vue'),
                    meta: { title: '拖拽列表' }
                },
                {
                    // 拖拽Dialog组件
                    path: '/dialog',
                    component: () => import(/* webpackChunkName: "dragdialog" */ '../components/page/DragDialog.vue'),
                    meta: { title: '拖拽弹框' }
                },
                {
                    // 国际化组件
                    path: '/i18n',
                    component: () => import(/* webpackChunkName: "i18n" */ '../components/page/I18n.vue'),
                    meta: { title: '国际化' }
                },
                {
                    // 权限页面
                    path: '/permission',
                    component: () => import(/* webpackChunkName: "permission" */ '../components/page/Permission.vue'),
                    meta: {
                        title: '权限测试',
                        permission: true
                    }
                },
                {
                    path: '/404',
                    component: () => import(/* webpackChunkName: "404" */ '../components/sidebar/404.vue'),
                    meta: { title: '404' }
                },
                {
                    path: '/403',
                    component: () => import(/* webpackChunkName: "403" */ '../components/sidebar/403.vue'),
                    meta: {
                        title: '403',
                    }
                },
                {
                    path: '/donate',
                    component: () => import(/* webpackChunkName: "donate" */ '../components/page/Donate.vue'),
                    meta: {
                        title: '支持作者' ,
                        //要求权限检测
                        permission:true
                    }
                }
            ]
        },

        //登录页面
        {
            path: '/login',
            component: () => import(/* webpackChunkName: "login" */ '../components/sidebar/Login.vue'),
            meta: { title: '登录' }
        },

        //404错误页面
        {
            path: '*',
            redirect: '/404'
        }
    ]
});
