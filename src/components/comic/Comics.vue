<template>
    <div>
        <!--页面标题-->
        <div class="crumbs">
            <el-breadcrumb separator="/">
                <el-breadcrumb-item>
                    <i class="el-icon-lx-cascades"></i> 漫画爬虫
                </el-breadcrumb-item>
            </el-breadcrumb>
        </div>
        <div class="container">
            <div class="handle-box">
                <el-select v-model="comicResources" placeholder="漫画源" class="handle-select mr10">
                    <el-option key="1" label="动漫之家" value="1"></el-option>
                    <el-option key="2" label="拷贝漫画" value="2"></el-option>
                    <el-option key="3" label="本地漫画" value="3"></el-option>
                </el-select>
                <!--搜索框-->
                <el-input v-model="comicName" placeholder="漫画名" class="handle-input mr10" @keyup.enter.native="searchComics"></el-input>
                <!--搜索按钮-->
                <el-button type="primary" icon="el-icon-search" @click="searchComics">搜索</el-button>
            </div>
        </div>
        <div class="container">
            <div style="margin-left: 1%" >
                <!--拷贝漫画-->
                <div class="comicList" v-for="(copy_comic,index) in copyMangaList">
                    <el-card>
                        <img v-lazy="copy_comic.cover" class="image" style="width: 200px" >
                        <div style="padding: 5px;width: 200px">
                            <p style="text-align: center;display: block;text-overflow: ellipsis">{{copy_comic.name}}</p>
                            <div class="bottom clearfix" style="margin-top: 10px">
                                <el-button class="button" style="width: 200px" @click="toChapters(copy_comic)">查看全部章节</el-button>
                            </div>
                        </div>
                    </el-card>
                </div>
                <!--dmzj-->
                <div class="comicList" v-for="(dmzj_comic,index) in dmzjList">
                    <el-card>
                        <img v-lazy='dmzj_comic.cover' class="image" style="width: 200px" referrerPolicy="no-referrer">
                        <div style="padding: 5px;width: 200px">
                            <p style="text-align: center;display: block;text-overflow: ellipsis">{{dmzj_comic.comic_name}}</p>
                            <div class="bottom clearfix" style="margin-top: 10px">
                                <el-button class="button" style="width: 200px" @click="toChapters(dmzj_comic)">查看全部章节</el-button>
                            </div>
                        </div>
                    </el-card>
                </div>
                <!--本机-->
                <div class="comicList" v-for="(kb_comic,index) in kbcomicList">
                    <el-card>
                        <img v-lazy='kb_comic.comicCover' class="image" style="width: 200px" referrerPolicy="no-referrer">
                        <div style="padding: 5px;width: 200px">
                            <p style="text-align: center;display: block;text-overflow: ellipsis">{{kb_comic.comicName}}</p>
                            <div class="bottom clearfix" style="margin-top: 10px">
                                <el-button class="button" style="width: 200px" @click="toChapters(kb_comic)">查看全部章节</el-button>
                            </div>
                        </div>
                    </el-card>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
    //引入lazyload
    import Vue from 'vue';
    import VueLazyload from 'vue-lazyload';
    Vue.use(VueLazyload,{
        preLoad: 1.3,
        error: require('../../assets/img/error.jpg'),
        loading: require('../../assets/img/loading.gif'),
        attempt: 3,
        lazyComponent:true
    });
    export default {
        name: "Comics",
        data(){
            return{
                //漫画名
                comicName:'',
                //漫画源
                comicResources:'',
                //漫画简介json数组
                //拷贝漫画
                copyMangaList:[],
                //动漫之家
                dmzjList:[],
                //本机
                kbcomicList:[]
            }
        },
        methods:{
            //跳转章节目录
            toChapters(comic){
                const _this=this;
                _this.$router.push({
                    name:'chapters',
                    params:{
                        resource: _this.comicResources,
                        comicMessage: comic
                    }
                })
            },
            //关键字查询漫画
            searchComics(){
                const _this=this;
                _this.copyMangaList=null;
                _this.dmzjList=null;
                _this.kbcomicList=null;
                if(_this.comicResources==''){
                    _this.$message.error("您未选择漫画源");
                }else if(_this.comicName==''){
                    _this.$message.error("您未输入关键字");
                } else if(_this.comicResources=='1'){
                    //漫画之家的源
                    _this.$axios({
                        method:'get',
                        url:"http://sacg.dmzj1.com/comicsum/search.php?s="+_this.comicName
                    }).then(function (res1) {
                        var string=res1.data;
                        var tmp=string.split("var g_search_data = ")[1];
                        var jsonString=tmp.substring(0,tmp.length-1);
                        var comicJson=JSON.parse(jsonString);
                        _this.dmzjList=comicJson;
                        _this.$message.success('查询结果:'+_this.dmzjList.length+'条');
                    }).catch(error=>{
                        _this.$message.error(error);
                    })
                }else if(_this.comicResources=='2'){
                    //拷贝漫画的源
                    _this.$axios({
                        method:'get',
                        url: 'https://api.copymanga.com/api/v3/search/comic?format=json&limit=500&offset=0&platform=3',
                        params:{
                            q: _this.comicName
                        }
                    }).then(function (response) {
                        var comicJson=JSON.parse(JSON.stringify(response.data.results.list));
                        _this.copyMangaList=comicJson;
                        _this.$message.success('查询结果:'+_this.copyMangaList.length+'条');
                    }).catch(error=>{
                        _this.$message.error(error);
                    })
                }else if(_this.comicResources=='3'){
                    //本机
                    _this.$axios({
                        method: 'get',
                        url: `http://localhost:8081/api/comic/keyword?keyword=${_this.comicName}`
                    }).then(function (response) {
                        var comicJson=JSON.parse(JSON.stringify(response.data.data));
                        _this.kbcomicList=comicJson;
                        _this.$message.success('查询结果:'+_this.kbcomicList.length+'条');
                    }).catch(error=>{
                        _this.$message.error("错误信息:"+error);
                    })
                }
            }

        },
        created() {

        }
    };
</script>

<style scoped>
    .comicList{
        display: inline-block;
        /*margin-left: 0.8%;*/
        margin-right: 1.4%;
    }
    .copycomicList{
        display: inline-block;
        margin-right: 20px;
        margin-bottom: 20px;
    }
    .dmzjcomicList{
        display: inline-block;
        margin-right: 20px;
        margin-bottom: 20px;
    }
    .kbcomicList{
        display: inline-block;
        margin-right: 20px;
        margin-bottom: 20px;
    }
    .handle-box {
        margin-bottom: 20px;
    }

    .handle-select {
        width: 120px;
    }

    .handle-input {
        width: 250px;
        display: inline-block;
    }
    .table {
        width: 100%;
        font-size: 14px;
    }
    .red {
        color: #ff0000;
    }
    .mr10 {
        margin-right: 10px;
    }
</style>
