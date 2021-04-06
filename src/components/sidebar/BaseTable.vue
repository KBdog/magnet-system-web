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
                <el-button type="primary" icon="el-icon-delete" class="handle-del mr10" @click="delAllSelection">
                    批量删除
                </el-button>
                <!--搜索框-->
                <el-input v-model="query_name" placeholder="资源名"
                          class="handle-input mr10" @keyup.enter.native="handleSearch(query_name)"></el-input>
                <!--搜索按钮-->
                <el-button type="primary" icon="el-icon-search" @click="handleSearch(query_name)">搜索</el-button>
                <!--添加磁力按钮-->
                <el-button type="primary" icon="el-icon-circle-plus-outline" @click="handleAddMagnet"
                           v-if="per==='2'||per==='1'">添加磁力</el-button>
                &nbsp;
                <!--日期选择器-->
                <el-date-picker
                        v-model="reportDate"
                        unlink-panels
                        type="daterange"
                        range-separator="至"
                        start-placeholder="开始日期"
                        end-placeholder="结束日期"
                        value-format="yyyy-MM-dd">
                </el-date-picker>
                &nbsp;
                <!--查询-->
                <el-button type="primary" icon="el-icon-search" @click="queryTimeReport">查询</el-button>
                <el-button type="primary" icon="el-icon-lx-down" :style="{display:downloadVisible}"
                           @click="downloadExcel">
                    下载表格
                </el-button>
            </div>
            <!--表格-->
            <el-table
                :data="tableData"
                border
                class="table"
                ref="multipleTable"
                header-cell-class-name="table-header"
                @selection-change="handleSelectionChange">

                <el-table-column type="selection" width="55px" align="center"></el-table-column>
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
                        <!--这两个按钮只有有高级权限的用户才能使用-->
                        <el-button type="text" icon="el-icon-edit"
                                   @click="handleEdit(scope.$index, scope.row)"
                                   v-if="per==='2'||per==='1'">
                            编辑
                        </el-button>
                        <el-button type="text" icon="el-icon-delete" class="red"
                                   @click="handleDelete(scope.$index, scope.row.name,scope.row.magnet)"
                                   v-if="per==='2'||per==='1'">
                            删除
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

        <!-- 编辑弹出框 -->
        <el-dialog title="编辑" :visible.sync="editVisible" width="30%">
            <el-form ref="form" :model="form" label-width="70px">
                <el-form-item label="资源名">
                    <!--第一个文本框-->
                    <el-input v-model="form.name"></el-input>
                </el-form-item>
                <el-form-item label="磁力链接">
                    <!--第二个文本框-->
                    <el-input v-model="form.magnet"></el-input>
                </el-form-item>
            </el-form>
            <span slot="footer" class="dialog-footer">
                <el-button @click="editVisible = false">取 消</el-button>
                <el-button type="primary" @click="saveEdit(form.name,form.magnet)">确 定</el-button>
            </span>
        </el-dialog>

        <!--添加磁力弹出框-->
        <el-dialog title="资源" :visible.sync="addMagnetVisible" width="30%">
            <el-form ref="form" :model="magnetForm" label-width="70px">
                <el-form-item label="资源名">
                    <!--第一个文本框-->
                    <el-input v-model="magnetForm.name"></el-input>
                </el-form-item>
                <el-form-item label="磁力链接">
                    <!--第二个文本框-->
                    <el-input v-model="magnetForm.magnet"></el-input>
                </el-form-item>
            </el-form>

            <span slot="footer" class="dialog-footer">
                <el-button @click="addMagnetVisible = false">
                    取 消
                </el-button>
                <el-button type="primary" @click="confirmAddMagnet(magnetForm.name,magnetForm.magnet)">
                    确 定
                </el-button>
            </span>

        </el-dialog>

    </div>
</template>

<script>
import { fetchData } from '../../api';
import host from '../../api/ApiAddress';
export default {
    name: 'basetable',
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
            //模糊查询关键字
            query_name:"",
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



            query: {
                address: '',
                name: '',
                pageIndex: 1,
                pageSize: 10
            },
            multipleSelection: [],
            delList: [],
            id: -1,
            //权限标志
            per: -1
        };
    },
    methods: {
        // 多选操作
        handleSelectionChange(val) {
            this.multipleSelection = val;
        },
        // 批量删除
        delAllSelection() {
            const _this=this;
            const length = _this.multipleSelection.length;
            let str = '';
            _this.delList = _this.delList.concat(this.multipleSelection);
            for (let i = 0; i < length; i++) {
                if(i==length-1){
                    str += _this.multipleSelection[i].name;
                }else {
                    str += _this.multipleSelection[i].name + ',';
                }
            }
            if(str==''){
                _this.$message.error("您没有选中内容")
            }else {
                //二次确认删除
                _this.$confirm('确定要删除吗？', '提示', {
                    type: 'warning'
                }).then(() => {
                    //要传给后端的json数组
                    var magnetList=new Array();
                    //单个json对象
                    var magnetName;
                    for(var i=0;i<_this.multipleSelection.length;i++){
                        magnetName=new Object();
                        magnetName.name=_this.multipleSelection[i].name;
                        //把json对象加入json数组
                        magnetList[i]=magnetName;
                    }
                    //后端批量删除接口
                    this.$axios({
                        method:'delete',
                        url:'http://'+host.host+':8082/queryMagnet/batch/delete',
                        data:magnetList
                    }).then(function (resp) {
                        if(resp.data.data.result==true){
                            _this.$message.success('删除了'+resp.data.data.total+
                                '条数据');
                        }else {
                            _this.$message.error('删除失败')
                        }
                    }).catch(error=>{
                        _this.$message.error('错误信息:'+error);
                    });
                    //执行删除之后
                    _this.$message.error(`删除了${str}`);
                    _this.multipleSelection = [];
                    str='';
                    //2s后刷新页面
                    setTimeout(function () {
                        window.location.reload();
                    },2000);
                })
            }
        },













        //下载表格
        downloadExcel(){
            const _this=this;
            //磁力对象数组
            var magnetArray=new Array();
            //单个磁力对象
            var tmp_magnet;
            for(var i=0;i<_this.tableData.length;i++){
                tmp_magnet=new Object();
                //给对象添加属性
                tmp_magnet.name=_this.tableData[i].name;
                tmp_magnet.magnet=_this.tableData[i].magnet;
                tmp_magnet.time=_this.tableData[i].time;
                //把对象加进数组
                magnetArray[i]=tmp_magnet;
            }
            //访问后端接口请求下载报表
            _this.$axios({
                method:'post',
                url:'http://'+host.host+':8082/queryMagnet/downloadExcel',
                //这里传递的已经是json数组
                data:magnetArray,
                responseType:'blob'
            }).then(function (resp) {
                console.log(resp);
                let url = window.URL.createObjectURL(resp.data);
                //创建一个超链接标签
                let link = document.createElement('a');
                //设置超链接和下载地址绑定，且限制该超链接的显示
                link.style.display = 'none';
                link.href = url;
                //此处的download是link标签的内容，固定写法，不是后台api接口
                link.setAttribute('download',
                    _this.startTime+"至" +_this.endTime+'所收录的磁力报表.xlsx');
                document.body.appendChild(link);
                //模拟点击下载
                link.click();
                // 下载完成移除元素
                document.body.removeChild(link);
                //释放掉blob对象
                window.URL.revokeObjectURL(url);
            })
        },

        //查询某个时间段收录的磁力链接
        queryTimeReport(){
            const _this=this;
            var start="";
            var end="";
            _this.downloadVisible="none";
            if(_this.reportDate==null){
                _this.$alert("起始日期和终止日期都不能为空","提示");
            }else {
                var tmp=_this.reportDate.toString();
                if(tmp==null||tmp.match(/^[ ]*$/)){
                    _this.$alert("起始日期和终止日期都不能为空","提示");
                }else {
                    start=tmp.split(",")[0];
                    end=tmp.split(",")[1];
                    //配置入下载时需要填入的时间信息
                    _this.startTime=tmp.split(",")[0];
                    _this.endTime=tmp.split(",")[1];
                    //访问后端接口
                    _this.$axios({
                        method:"post",
                        url:'http://'+host.host+':8082/queryMagnet/query_TimeReport',
                        data:{start,end}
                    }).then(function (resp) {
                        console.log(resp)
                        _this.tableData=resp.data.data;
                        _this.msgTotal=resp.data.data.length;
                        _this.defaultPageSize=resp.data.data.length;
                        if(resp.data.data.length!=0){
                            //成功查到信息后下载按钮显示出来
                            _this.downloadVisible="";
                        }
                        _this.$message.success("查询结果:"+_this.msgTotal+"条");
                    })
                }

            }

        },
        // 打开编辑框编辑操作
        handleEdit(index, row_msg) {
            this.idx = index;
            //当前表单
            this.form=row_msg;
            //更改前表单
            this.beforeUpdateForm.name=row_msg.name;
            this.beforeUpdateForm.magnet=row_msg.magnet;
            this.beforeUpdateForm.time=row_msg.time;
            //打开编辑框
            this.editVisible = true;
        },
        // 保存编辑
        saveEdit(name,magnet) {
            const _this=this;
            //给修改后的表单赋值
            _this.afterUpdateForm.name=name;
            _this.afterUpdateForm.magnet=magnet;
            _this.afterUpdateForm.time=this.form.time;
            //判断磁力链接格式是否正确
            if(magnet.indexOf(_this.magnet_prefix)==-1){
                _this.$alert("磁力链接必须包含magnet:?xt=urn:btih:","提示");
            }else{
                _this.$axios({
                    method:'put',
                    url:'http://'+host.host+':8082/queryMagnet/update_magnet',
                    data:[
                        {
                            name:_this.beforeUpdateForm.name,
                            magnet:_this.beforeUpdateForm.magnet
                        },
                        {
                            name:_this.afterUpdateForm.name,
                            magnet:_this.afterUpdateForm.magnet
                        }
                    ]
                }).then(function (resp) {
                    console.log(resp)
                    if(resp.data==true){
                        _this.editVisible = false;
                        _this.$message.success(`修改第 ${_this.idx + 1} 行成功`);
                        _this.$set(_this.tableData, _this.idx, _this.afterUpdateForm);
                        _this.$alert("修改成功",'提示');
                    }else{
                        _this.$message.error('修改失败！');
                        _this.$set(_this.tableData, _this.idx, _this.beforeUpdateForm);
                    }
                })
            }
        },
        // 搜索按钮
        handleSearch(keyword) {
            const _this=this;
            if(keyword==null||keyword.match(/^[ ]*$/)){
                _this.$alert('搜索关键字不能为空！','提示');
                //重新查一次
                _this.$axios.all([
                    _this.$axios.get('http://'+host.host+':8082/queryMagnet/all').then(function (resp) {
                        //获取所有数据
                        _this.msgTotal=resp.data.data.length;
                        _this.defaultPageSize=6
                    }),
                    _this.$axios.get('http://'+host.host+':8082/queryMagnet/all/1/6').then(function (resp) {
                        //获取第一页数据
                        _this.tableData=resp.data.data;
                    })
                ])

                this.current_page=1;
            }else {
                //从localStorage中获取token
                var token=localStorage.getItem('token');
                _this.$axios({
                    //只有post方法才能传参数
                    method:'post',
                    url:'http://'+host.host+':8082/queryMagnet/keyword',
                    data:{
                        keyword:keyword
                    },
                    //给请求头添加token
                    headers:{"Authorization":token}
                }).then(function (resp) {
                    if(resp.data.code=='200'){
                        _this.tableData=resp.data.data;
                        _this.msgTotal=resp.data.data.length;
                        //修改每页默认显示条数
                        _this.defaultPageSize=resp.data.data.length;
                        _this.$message.success("查询结果:"+_this.msgTotal+"条");
                    }else {
                        //token过期，移除用户信息
                        localStorage.removeItem('token');
                        localStorage.removeItem('ms_username');
                        localStorage.removeItem('ms_uid');
                        localStorage.removeItem('ms_authority');
                        _this.$message.error("您的token已过期，请重新登录！");
                        //延时三秒退出登录
                        setTimeout(function () {
                            //提示
                            _this.$message.success("您已退出登录");
                            //因为localStorage里已经没有ms_username，所以跳转登录页面
                            _this.$router.push('/');
                        },3000);
                    }
                }).catch(error=>{
                    _this.$message.error("错误信息:"+error);
                })
                _this.query_name=null;
            }
            _this.downloadVisible="none";
        },
        //打开添加磁力框
        handleAddMagnet(){
            const _this=this;
            this.addMagnetVisible=true;
            _this.magnetForm.magnet=_this.magnet_prefix;
        },
        //确认添加磁力
        confirmAddMagnet(name,magnet){
            const _this=this;
            //1、判断字符串是否为空或者是否为空格
            //2、判断磁力链接格式是否正确
            if(name==null||magnet==null||name.match(/^[ ]*$/)||magnet.match(/^[ ]*$/)){
                _this.$alert("资源名和磁力链接都不能为空!","提示");
            }
            // else if(magnet.indexOf(_this.magnet_prefix)==-1){
            //     _this.$alert("磁力链接必须包含magnet:?xt=urn:btih:","提示");
            // }
            //正则表达式判断字符串前缀是否包含magnet:?xt=urn:btih:
            else if(magnet.match(/^(magnet:\?xt=urn:btih:)/)){
                _this.$axios({
                    method: 'post',
                    url:'http://'+host.host+':8082/queryMagnet/add_magnet',
                    data:{name,magnet}
                }).then(function (resp) {
                    console.log(resp)
                    if(resp.data==true){
                        _this.$alert("添加磁力成功！")
                        _this.addMagnetVisible=false;
                        window.location.reload();
                    }else{
                        _this.$alert("添加磁力失败！");
                        _this.addMagnetVisible=false;
                    }
                }).catch(error=>{
                    _this.$message.error("网络连接失败");
                })
                //添加完磁力清空表单和关闭表单窗口
                _this.magnetForm.name=null;
                _this.magnetForm.magnet=null;
                _this.addMagnetVisible=false;
            }else{
                _this.$alert("磁力链接开头必须是magnet:?xt=urn:btih:","提示");
            }
        },

        // 删除操作
        handleDelete(index,name,magnet) {
            const _this=this;
            // 二次确认删除
            _this.$confirm('确定要删除吗？', '提示', {
                type: 'warning'
            }).then(() => {
                this.$axios({
                    method:'delete',
                    url:'http://'+host.host+':8082/queryMagnet/delete_magnet',
                    data:{name,magnet}
                    }).then(function (resp) {
                        console.log(resp);
                        if(resp.data==true){
                            // alert("删除磁力成功！");
                            _this.$message.success('删除成功');
                            _this.tableData.splice(index, 1);
                            _this.msgTotal-=1;
                        }else{
                            _this.$message.error("删除磁力失败！");
                        }
                    })
                })
        },

        // 分页导航
        handlePageChange(currentPage) {
            // this.$set(this.query, 'pageIndex', currentPage);
            // alert(currentPage);
            const _this=this;
            this.$axios.get('http://'+host.host+':8082/queryMagnet/all/'+currentPage+'/6').then(function (resp) {
                //获取当前页数据
                _this.tableData=resp.data.data;
            })
        },
        // 复制磁力成功
        copySuccess(){
            const _this=this;
            _this.$alert("复制成功");
        },
        // 复制磁力失败
        copyError(){
            const _this=this;
            _this.$alert("复制失败");
        },
    },

    //初始化
    created() {
        const _this=this;
        //获取所有数据
        this.$axios.get('http://'+host.host+':8082/queryMagnet/all').then(function (resp) {
            _this.msgTotal=resp.data.data.length;
        })
        //获取第一页数据
        this.$axios.get('http://'+host.host+':8082/queryMagnet/all/1/6').then(function (resp) {
            _this.tableData=resp.data.data;
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
