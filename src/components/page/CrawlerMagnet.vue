<template>
    <div>
        <!--页面标题-->
        <div class="crumbs">
            <el-breadcrumb separator="/">
                <el-breadcrumb-item>
                    <i class="el-icon-lx-cascades"></i> 磁力链接
                </el-breadcrumb-item>
            </el-breadcrumb>
        </div>
        <div class="container">
            <!--批量删除行-->
            <div class="handle-box">
                <!--磁力源-->
                <el-select v-model="magnetResources" placeholder="磁力源" class="handle-select mr10">
                    <el-option key="1" label="种子搜" value="1"></el-option>
                </el-select>
                <!--搜索框-->
                <el-input v-model="query_name" placeholder="资源名" class="handle-input mr10"></el-input>
                <!--搜索按钮-->
                <el-button type="primary" icon="el-icon-search" @click="handleSearch(query_name)">搜索</el-button>
            </div>
            <!--表格-->
            <el-table
                    :data="tableData"
                    border
                    class="table"
                    ref="multipleTable"
                    header-cell-class-name="table-header">
<!--                <el-table-column type="selection" width="55px" align="center"></el-table-column>-->
                <el-table-column prop="name" label="资源名" width="300px" align="center"></el-table-column>
                <el-table-column prop="magnet" label="磁力链接" width="450px" align="center"></el-table-column>
                <el-table-column prop="time" label="收录时间" align="center"></el-table-column>

                <el-table-column label="操作" width="250px" align="center">
                    <template slot-scope="scope">
                        <el-button type="text" icon="el-icon-info"
                                   v-clipboard:copy="scope.row.magnet"
                                   v-clipboard:success="copySuccess"
                                   v-clipboard:error="copyError">
                            复制磁力
                        </el-button>
                    </template>
                </el-table-column>

            </el-table>
            <!--分页-->
            <div class="pagination">
                <el-pagination
                        background
                        layout="total, prev, pager, next"
                        :page-size="defaultPageSize"
                        :total="msgTotal"
                        :current-page.sync="current_page"
                        @current-change="handlePageChange"
                ></el-pagination>
            </div>
        </div>
    </div>
</template>

<script>
    export default {
        name: 'crawlerMagnet',
        data() {
            return {
                //默认pagesize
                defaultPageSize:6,
                //表格信息
                tableData:null,
                //编辑框显示标记
                editVisible: false,
                //添加磁力框显示标记
                addMagnetVisible:false,
                //信息总数
                msgTotal: null,
                //编辑框显示内容
                form: {},
                //表格行序下标
                idx: -1,
                //添加磁力表单
                magnetForm:{
                    name:'',
                    magnet:''
                },
                //编辑前的表单
                beforeUpdateForm:{
                    name:"",
                    magnet:"",
                    time:""
                },
                //编辑后的表单
                afterUpdateForm:{
                    name:"",
                    magnet:"",
                    time:""
                },
                //当前页数
                current_page:1,
                //磁力前缀
                magnet_prefix:'magnet:?xt=urn:btih:',
                //日期选择器
                reportDate:"",
                //下载按钮默认不显示
                downloadVisible:"none",
                //日期选择器开始时间
                startTime:'',
                //日期选择器结束时间
                endTime:'',
                multipleSelection: [],
                delList: [],
                id: -1,
                //权限标志
                per: -1,


                //磁力源
                magnetResources:'',
                //模糊查询关键字
                query_name:"",
            };
        },
        methods: {
            handleSearch(keyword){
                this.$axios({
                    method:'get',
                    url:`https://www.zhongzilou.com/list/${keyword}/1`
                }).then(function (response) {
                    var results=response.data;
                })
            }
        },

        //初始化
        created() {
            const _this=this;
            //获取所有数据
            this.$axios.get('http://localhost:8082/queryMagnet/all').then(function (resp) {
                _this.msgTotal=resp.data.length;
            })
            //获取第一页数据
            this.$axios.get('http://localhost:8082/queryMagnet/all/1/6').then(function (resp) {
                _this.tableData=resp.data;
            })
            //获得权限标志并赋值
            _this.per=localStorage.getItem('ms_authority');
        }
    };
</script>

<style scoped>
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
    .table-td-thumb {
        display: block;
        margin: auto;
        width: 40px;
        height: 40px;
    }
</style>
