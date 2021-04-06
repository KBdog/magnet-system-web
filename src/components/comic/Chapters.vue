<template>
    <div>
        <!--页面标题-->
        <div class="crumbs">
            <el-breadcrumb separator="/">
                <el-breadcrumb-item>
                    <i class="el-icon-lx-cascades"></i> 章节信息
                </el-breadcrumb-item>
            </el-breadcrumb>
        </div>
        <el-row :gutter="20">
            <!--封面和标题-->
            <el-col :span="23">
                <el-card shadow="hover" class="mgb20" style="height:350px;">
                    <div class="comic-title">
                        <!--封面-->
                        <div class="comic-cover" style="margin-right: 100px;display: inline-block;width: 230px" >
                            <el-image :src="comicCover" style="width: 230px;"></el-image>
                        </div>
                        <!--漫画名和别名-->
                        <div class="comic-message" style="display: inline-block;">
                            <div style="margin-bottom: 30px">
                                <h2>{{comicName}}</h2>
                            </div>
                            <div>
                                <p style="display: block;text-overflow: ellipsis;text-align: left;margin-bottom: 20px">作者:{{comicAuthor}}</p>
                                <p style="display: block;text-overflow: ellipsis;text-align: left;margin-right: 50px">漫画简介:{{comicDescription}}</p>
                            </div>
                        </div>
                    </div>
                </el-card>
            </el-col>
            <!--章节列表-->
            <el-col :span="23">
                <el-card shadow="hover">
                    <div class="chapterLabel" slot="header">全部章节</div>
                    <div style="margin-left: 20px;">
                        <!--拷贝漫画-->
                        <div class="chapterList" v-for="(chapter,index) in copyChaptersList">
                            <el-button style="margin-right: 20px;margin-bottom: 20px"
                                       @click="searchPictures(chapter.uuid,chapter.name)">
                                {{chapter.name}}
                            </el-button>
                        </div>
                        <!--动漫之家-->
                        <div class="chapterList" v-for="(chapter,index) in dmzjChaptersList" >
                            <el-button style="margin-right: 20px;margin-bottom: 20px"
                                       @click="searchPictures(chapter.chapter_id,chapter.chapter_title)">
                                {{chapter.chapter_title}}
                            </el-button>
                        </div>
                        <!--kbcomic-->
                        <div class="chapterList" v-for="(chapter,index) in kbcomicChaptersList" >
                            <el-button style="margin-right: 20px;margin-bottom: 20px"
                                       @click="searchPictures(chapter.chapterId,chapter.chapterName)">
                                {{chapter.chapterName}}
                            </el-button>
                        </div>
                    </div>
                </el-card>
            </el-col>
        </el-row>
    </div>
</template>

<script>
    import host from '../../api/ApiAddress'
    export default {
        name: "Chapters",
        data(){
            return{
                resource:'',
                comicCover:'https://mirror277.mangafunc.fun/comic/nizaonanlema/cover.jpg!kb_w_item_webp',
                comicName:'漫画名',
                comicAuthor: '',
                comicDescription: '',
                comicPathWord:'manhuaming',
                comicMessage: null,
                copyChaptersList:[],
                copyPicList:[],
                dmzjChaptersList:[],
                kbcomicChaptersList:[]
            }
        },
        methods:{
            searchPictures(chapterId,chapterName){
                const _this=this;
                //排序方法
                function compare(property){
                    return function(a,b){
                        var value1 = a[property];
                        var value2 = b[property];
                        return value1 - value2;
                    }
                }
                //漫画源:拷贝漫画
                if(_this.resource=='2'){
                    _this.$axios({
                        method:'get',
                        url:`https://api.copymanga.com/api/v3/comic/${_this.comicPathWord}/chapter2/${chapterId}?platform=3`
                    }).then(function (resp) {
                        //该话图片列表
                        var picList=resp.data.results.chapter.contents;
                        //乱序结果集
                        var picListIndex=resp.data.results.chapter.words;
                        //最终结果
                        var lastPicList=[];
                        //结果对象
                        var Pic=function (id,url) {
                            this.id=id;
                            this.url=url;
                        }
                        Pic.create=function (id,url) {
                            return new Pic(id,url);
                        }
                        //放入lastPicList
                        for(var i=0;i<picList.length;i++){
                            lastPicList.push(Pic.create(picListIndex[i],picList[i].url))
                        }
                        //根据id排序
                        var tmp=lastPicList.sort(compare('id'));
                        //给图片列表赋值
                        _this.copyPicList=tmp;
                        //跳转图片页
                        _this.$router.push({
                            name:'pictures',
                            params:{
                                resource: _this.resource,
                                chapterName: chapterName,
                                picList: tmp
                            }
                        })
                    }).catch(error=>{
                        _this.$message.error(error)
                    })
                }else if(_this.resource=='1'){
                    //dmzj源
                    _this.$axios({
                        method:'get',
                        url:`http://v3api.dmzj1.com/chapter/${_this.comicMessage.id}/${chapterId}.json`
                    }).then(function (resp) {
                        console.log("漫画id:"+_this.comicMessage.id+",章节id:"+chapterId);
                        //跳转图片页
                        _this.$router.push({
                            name:'pictures',
                            params:{
                                resource: _this.resource,
                                chapterName: resp.data.title,
                                picList: resp.data.page_url_hd
                            }
                        })
                    }).catch(error=>{
                        _this.$message.error(error)
                    })
                }else if(_this.resource=='3'){
                    //kbcomic
                    _this.$axios({
                        method:'get',
                        url:'http://'+host.host+':8081/api/pic/'+chapterId,
                    }).then(function (response) {
                        _this.$router.push({
                            name:'pictures',
                            params:{
                                resource:_this.resource,
                                chapterName: chapterName,
                                picList: response.data.data
                            }
                        })
                    })
                }
            }
        },
        created() {
            const _this=this;
            //获取传递过来的漫画json对象
            _this.comicMessage=_this.$route.params.comicMessage;
            //漫画源
            _this.resource=_this.$route.params.resource;
            //查询章节
            //拷贝漫画源
            if(_this.resource=='2'){
                _this.comicName=_this.comicMessage.name;
                _this.comicCover=_this.comicMessage.cover;
                _this.comicPathWord=_this.comicMessage.path_word;
                //漫画简介
                _this.$axios({
                    method:'get',
                    url: `https://api.copymanga.com/api/v3/comic2/${_this.comicPathWord}?platform=3`
                }).then(function (response) {
                    _this.comicDescription=response.data.results.comic.brief;
                })
                //漫画作者
                for(var i=0;i<_this.comicMessage.author.length;i++){
                    _this.comicAuthor+=_this.comicMessage.author[i].name+'，'
                }
                _this.comicAuthor=_this.comicAuthor.substring(0,_this.comicAuthor.length-1);
                _this.$axios({
                    method: 'get',
                    url: `https://api.copymanga.com/api/v3/comic/${_this.comicPathWord}/group/default/chapters?limit=500&offset=0&platform=3`
                }).then(function (resp) {
                    var json=JSON.parse(JSON.stringify(resp.data.results.list));
                    _this.copyChaptersList=json;
                }).catch(error=>{
                    _this.$message.error(error)
                })
            }else if(_this.resource=='1'){
                //dmzj源
                _this.comicName=_this.comicMessage.comic_name;
                _this.comicCover=_this.comicMessage.cover;
                _this.comicAuthor=_this.comicMessage.comic_author;
                //漫画具体章节和简介信息
                _this.$axios({
                    method:'get',
                    url: `http://v3api.dmzj1.com/comic/comic_${_this.comicMessage.id}.json`
                }).then(function (response) {
                    if(response.data=='漫画不存在!!!'){
                        _this.$message.error("漫画已被隐藏");
                    }else {
                        var json=JSON.parse(JSON.stringify(response.data.chapters[0].data));
                        _this.dmzjChaptersList=json;
                        //漫画简介
                        _this.comicDescription=response.data.description;
                    }
                }).catch(error=>{
                    _this.$message.error(error)
                })
            }else if(_this.resource=='3'){
                //本机kbcomic
                _this.comicName=_this.comicMessage.comicName;
                _this.comicCover=_this.comicMessage.comicCover;
                _this.comicDescription=_this.comicMessage.comicDescription;
                _this.$axios({
                    method:'get',
                    url:'http://'+host.host+':8081/api/chapter/'+_this.comicMessage.comicId,
                }).then(function (response) {
                    var json=JSON.parse(JSON.stringify(response.data.data));
                    _this.kbcomicChaptersList=json;
                })
            }
        },
        activated() {
            // const _this=this;
            // //获取传递过来的漫画json对象
            // _this.comicMessage=_this.$route.params.comicMessage;
            // //漫画源
            // _this.resource=_this.$route.params.resource;
            // _this.comicName=_this.comicMessage.name;
            // _this.comicCover=_this.comicMessage.cover;
            // _this.comicPathWord=_this.comicMessage.path_word;
            // _this.comicDescription=_this.comicMessage.alias;
            // //查询章节
            // //拷贝漫画源
            // if(_this.resource=='2'){
            //     _this.$axios({
            //         method: 'get',
            //         url: `https://api.copymanga.com/api/v3/comic/${_this.comicPathWord}/group/default/chapters?limit=500&offset=0&platform=3`
            //     }).then(function (resp) {
            //         var json=JSON.parse(JSON.stringify(resp.data.results.list));
            //         _this.copyChaptersList=json;
            //     }).catch(error=>{
            //         _this.$message.error(error)
            //     })
            // }
        }
    };
</script>

<style scoped>
    .mgb20 {
        margin-bottom: 20px;
    }
    .comic-title{
        display: flex;
        flex-direction: row;
        /*display: inline-block;*/
        /*flex-wrap: wrap;*/
        margin-right: -15px;
        margin-left: 20px;
    }
    .chapterLabel{
        font-size: 30px;
    }
    .chapterList{
        display: inline-block;
    }
</style>
