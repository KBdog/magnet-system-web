<template>
    <!--侧边导航栏-->
    <div class="sidebar">
        <el-menu
            class="sidebar-el-menu"
            :default-active="onRoutes"
            :collapse="collapse"
            background-color="#324157"
            text-color="#bfcbd9"
            active-text-color="#20a0ff"
            unique-opened
            router
        >
            <!--遍历导航栏items：遍历一级菜单-->
            <template v-for="item in items">
                <!--一级菜单判断是否有下拉列表：有-->
                <template v-if="item.subs">
                    <el-submenu :index="item.index" :key="item.index">
                        <template slot="title">
                            <i :class="item.icon"></i>
                            <span slot="title">{{ item.title }}</span>
                        </template>
                        <!--遍历二级菜单-->
                        <template v-for="subItem in item.subs">
                            <!--:index 用于路由跳转-->
                            <el-menu-item  :index="subItem.index" :key="subItem.index">
                                {{ subItem.title }}
                            </el-menu-item>
                        </template>
                    </el-submenu>
                </template>
                <!--一级菜单判断是否有下拉列表：无-->
                <template v-else>
                    <!--:index 用于路由跳转-->
                    <el-menu-item :index="item.index" :key="item.index" style="font-size: 15px">
                        <i :class="item.icon"></i>
                        <span slot="title">{{ item.title }}</span>
                    </el-menu-item>
                </template>

            </template>
        </el-menu>
    </div>
</template>

<script>
import bus from '../common/bus';
export default {
    data() {
        return {
            collapse: false,
            items: [
                {
                    icon: 'el-icon-lx-home',
                    index: 'dashboard',
                    title: '系统首页',
                },
                {
                    icon: 'el-icon-lx-cascades',
                    // icon: 'el-icon-lx-home',
                    index: 'table',
                    title: '磁力链接'
                },
                {
                    icon: 'el-icon-pie-chart',
                    index: 'charts',
                    title: '收录趋势'
                },
                // {
                //     icon:'el-icon-lx-forwardfill',
                //     index:'crawlerMagnet',
                //     title:'磁力爬虫'
                // },
                {
                    icon: 'el-icon-lx-profile',
                    index: 'users',
                    title: '用户管理'
                },
                {
                    icon: 'el-icon-lx-picfill'  ,
                    index: 'comics',
                    title: '漫画爬虫'
                },

                //暂时没用上的组件
                // {
                //     icon: 'el-icon-lx-copy',
                //     index: 'tabs',
                //     title: 'tab选项卡'
                // },
                // {
                //     icon: 'el-icon-lx-file',
                //     index: 'upload',
                //     title: '文件上传'
                // },
                // {
                //     icon: 'el-icon-lx-calendar',
                //     index: 'form',
                //     title: '基本表单'
                // },
                // {
                //     icon: 'el-icon-lx-emoji',
                //     index: 'icon',
                //     title: '自定义图标'
                // },
                // {
                //     icon: 'el-icon-rank',
                //     index: '6',
                //     title: '拖拽组件',
                //     subs: [
                //         {
                //             index: 'drag',
                //             title: '拖拽列表'
                //         },
                //         {
                //             index: 'dialog',
                //             title: '拖拽弹框'
                //         }
                //     ]
                // },
                // {
                //     icon: 'el-icon-lx-global',
                //     index: 'i18n',
                //     title: '国际化功能'
                // },
                // {
                //     icon: 'el-icon-lx-warn',
                //     index: '7',
                //     title: '错误处理',
                //     subs: [
                //         {
                //             index: 'permission',
                //             title: '权限测试'
                //         },
                //         {
                //             index: '404',
                //             title: '404页面'
                //         }
                //     ]
                // },
                // {
                //     icon: 'el-icon-lx-redpacket_fill',
                //     index: '/donate',
                //     title: '支持作者'
                // }
            ]
        };
    },
    //url上级目录全部替换为'/'
    computed: {
        onRoutes() {
            return this.$route.path.replace('/', '');
        }
    },
    created() {
        // 通过 Event Bus 进行组件间通信，来折叠侧边栏
        // 折叠侧边栏时只留图标，文字留白
        bus.$on('collapse', msg => {
            this.collapse = msg;
            bus.$emit('collapse-content', msg);
        });
    }
};
</script>

<style scoped>
.sidebar {
    display: block;
    position: absolute;
    left: 0;
    top: 70px;
    bottom: 0;
    overflow-y: scroll;
}
.sidebar::-webkit-scrollbar {
    width: 0;
}
.sidebar-el-menu:not(.el-menu--collapse) {
    width: 250px;
}
.sidebar > ul {
    height: 100%;
}
</style>
