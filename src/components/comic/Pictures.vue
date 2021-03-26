<template>
    <div id="box">
    <!--页面标题-->
    <div class="crumbs">
        <el-breadcrumb separator="/">
            <el-breadcrumb-item>
                <i class="el-icon-lx-cascades"></i> {{chapterName}}
            </el-breadcrumb-item>
        </el-breadcrumb>
    </div>
        <div class="container">
                <!--图片列表预览-->
                <viewer :images="picList">
<!--                    <div style="margin-right: 10px; margin-left:10px; margin-bottom: 20px;display: inline-block" v-for="(pic,index) in picList">-->
                    <div style="margin-left: 0.9%;">
                        <div style="display: inline-block;text-align: center;width: 200px;margin-right: 1.8%;margin-bottom: 20px;
                            border: 1px solid lightpink" v-for="(pic,index) in picList">
                            <div class="imgClass" style="margin-bottom: 2px;width: 200px;border-bottom: 1px solid lightpink">
                                <!--拷贝漫画-->
                                <img :src="pic.url" width="200px" v-lazy="pic.url" v-if="resource=='2'">
                                <!--dmzj-->
                                <img :src="pic" width="200px" v-lazy="pic" v-if="resource=='1'">
                                <!--kbcomic-->
                                <img :src="pic.picUrl" width="200px" v-lazy="pic.picUrl" v-if="resource=='3'">
                            </div>
                            <div>
                                第{{index+1}}页
                            </div>
                        </div>
                    </div>
        <!--                    </div>-->


<!--                    <lazy-component v-for="(pic,index) in picList" :key="pic.url" style="margin-right: 50px;margin-bottom: 50px;display: inline-block;">-->
<!--                        <div style="display: inline-block;text-align: center;width: 200px;margin-right: 40px;margin-bottom: 40px">-->
<!--                            <div class="imgClass" style="margin-bottom: 20px;width: 200px;">-->
<!--                                &lt;!&ndash;拷贝漫画&ndash;&gt;-->
<!--                                <img :src="pic.url" width="200px" v-lazy="pic.url" v-if="resource=='2'">-->
<!--                                &lt;!&ndash;dmzj&ndash;&gt;-->
<!--                                <img :src="pic" width="200px" v-lazy="pic" v-if="resource=='1'">-->
<!--                            </div>-->
<!--                            <div>-->
<!--                                第{{index+1}}页-->
<!--                            </div>-->
<!--                        </div>-->
<!--                    </lazy-component>-->
                </viewer>
        </div>
    </div>
</template>

<script>
    //引入viewer
    import 'viewerjs/dist/viewer.css';
    import Viewer from 'v-viewer';
    import Vue from 'vue';
    Vue.use(Viewer);
    //引入lazyload
    import VueLazyload from 'vue-lazyload';
    Vue.use(VueLazyload,{
        preLoad: 1.3,
        error: require('../../assets/img/error.jpg'),
        loading: require('../../assets/img/loading.gif'),
        attempt: 3,
        lazyComponent:true
    });
    export default {
        name: "Pictures",
        data(){
            return {
                resource:'',
                chapterName:'',
                picList: []
            }
        },

        methods:{

        },

        mounted() {

        },
        destroyed() {

        },


        activated() {
            const _this=this;
            _this.chapterName=_this.$route.params.chapterName;
            _this.picList=_this.$route.params.picList;
            _this.resource=_this.$route.params.resource;
            console.log(_this.picList);
        },
        created() {
            // const _this=this;
            // _this.chapterName=_this.$route.params.chapterName;
            // _this.picList=_this.$route.params.picList;
        }
    }
</script>

<style scoped>
    .handle-box {
        margin-bottom: 20px;
    }
    .imgClass{
        margin-bottom: 20px;
        width: 200px;
    }
    .imgClass:hover{
        cursor: cell;
    }
</style>
