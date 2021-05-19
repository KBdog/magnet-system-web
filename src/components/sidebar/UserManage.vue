<template>
    <div>
        <!--页面标题-->
        <div class="crumbs">
            <el-breadcrumb separator="/">
                <el-breadcrumb-item>
                    <i class="el-icon-lx-cascades"></i> 用户管理
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
                <el-input v-model="query_name" placeholder="用户名" class="handle-input mr10"
                          @keyup.enter.native="handleSearch(query_name)"></el-input>
                <!--搜索按钮-->
                <el-button type="primary" icon="el-icon-search" @click="handleSearch(query_name)">搜索</el-button>
                <!--添加用户按钮-->
                <el-button type="primary" icon="el-icon-circle-plus-outline" @click="handleAddUser">添加用户</el-button>
                &nbsp;
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
                <!--字段-->
                <el-table-column prop="uid" label="用户id" width="150px" align="center"></el-table-column>
                <el-table-column prop="account" label="用户名" width="250px" align="center"></el-table-column>
                <el-table-column prop="password" label="用户密码" width="250px" align="center"></el-table-column>
                <el-table-column prop="authority" label="身份" width="250px" align="center" :formatter="judgeProfile"></el-table-column>


                <el-table-column label="操作"  align="center">
                    <template slot-scope="scope">
                        <el-button type="text" icon="el-icon-edit"
                                   @click="handleEdit(scope.$index, scope.row)"
                                   >
                            编辑
                        </el-button>
                        <el-button type="text" icon="el-icon-delete" class="red"
                                   @click="handleDelete(scope.$index, scope.row.uid)"
                                   >
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
                <el-form-item label="用户UID">
                    <el-input v-model="form.uid" readonly="true"></el-input>
                </el-form-item>
                <el-form-item label="用户账号">
                    <el-input v-model="form.account"></el-input>
                </el-form-item>
                <el-form-item label="用户密码">
                    <el-input v-model="form.password"></el-input>
                </el-form-item>
                <el-form-item label="用户身份">
                    <!--下拉框-->
                    <el-select v-model="form.authority" placeholder="身份" class="handle-select mr10">
                        <el-option key="1" label="高级用户" value="1"></el-option>
                        <el-option key="0" label="普通用户" value="0"></el-option>
                    </el-select>
                </el-form-item>
            </el-form>
            <span slot="footer" class="dialog-footer">
                <el-button @click="editVisible = false">取 消</el-button>
                <el-button type="primary" @click="saveEdit(form.uid,form.account,form.password,form.authority)">确 定</el-button>
            </span>
        </el-dialog>

        <!--添加用户弹出框-->
        <el-dialog title="资源" :visible.sync="addUserVisible" width="30%">
            <el-form ref="form" :model="userForm" label-width="70px">
                <el-form-item label="用户账号">
                    <!--第一个文本框-->
                    <el-input v-model="userForm.username"></el-input>
                </el-form-item>
                <el-form-item label="用户密码">
                    <!--第二个文本框-->
                    <el-input v-model="userForm.password"></el-input>
                </el-form-item>
                <el-form-item label="用户身份">
                    <!--下拉框-->
                    <el-select v-model="userForm.profile" placeholder="身份" class="handle-select mr10">
                        <el-option key="1" label="高级用户" value="1"></el-option>
                        <el-option key="0" label="普通用户" value="0"></el-option>
                    </el-select>
                </el-form-item>
            </el-form>
            <!--按钮-->
            <span slot="footer" class="dialog-footer">
                <el-button @click="addUserVisible = false">
                    取 消
                </el-button>
                <el-button type="primary" @click="confirmAddUser(userForm.username,userForm.password,userForm.profile)">
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
            addUserVisible:false,
            //信息总数
            msgTotal: null,
            //编辑框显示内容
            form: {
                uid:'',
                account:'',
                password:'',
                authority:''
            },
            //表格行序下标
            idx: -1,
            //添加用户表单
            userForm:{
                username:'',
                password:'',
                profile:''
            },
            //模糊查询关键字
            query_name:"",
            //编辑前的表单
            beforeUpdateForm:{
                uid:"",
                account:"",
                password:"",
                authority:""
            },
            //编辑后的表单
            afterUpdateForm:{
                uid:"",
                account:"",
                password:"",
                authority:""
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
            id: -1
        };
    },
    methods: {
        //身份判断
        judgeProfile(row){
            if(row.authority=='1'){
                return '高级用户';
            }else {
                return '普通用户'
            }
        },
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
                str += _this.multipleSelection[i].account + '\xa0\xa0\xa0\xa0\xa0\xa0\xa0\xa0\xa0';
            }
            if(str==''){
                _this.$message.error("您没有选中内容")
            }else {
                //二次确认删除
                _this.$confirm('确定要删除吗？', '提示', {
                    type: 'warning'
                }).then(() => {
                    for (let i = 0; i < length; i++) {
                        let uid=_this.multipleSelection[i].uid;
                        //后端访问删除
                        this.$axios({
                            method:'get',
                            url:'http://'+host.host+':8082/manage/delete?uid='+uid
                        }).then(function (resp) {
                            console.log(resp);
                            if(resp.data==true){
                                // alert("删除磁力成功！");
                                _this.$message.success(`删除成功:${str}`);
                                _this.msgTotal-=1;
                                // _this.$message.error(`删除了${str}`);
                            }else{
                                _this.$message.error("删除用户失败！");
                            }
                        }).catch(error=>{
                            _this.$message.error('删除失败:'+uid+'\n'+"错误信息:"+error);
                        });
                    }
                    _this.multipleSelection = [];
                    str='';
                    //3s后刷新页面
                    setTimeout(function () {
                        window.location.reload();
                    },3000);
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
                url:'http://'+host.host+':8082/queryMagnet/downloadExcel/',
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
                        url:'http://'+host.host+':8082/queryMagnet/query_TimeReport/',
                        data:{start,end}
                    }).then(function (resp) {
                        console.log(resp)
                        _this.tableData=resp.data;
                        _this.msgTotal=resp.data.length;
                        _this.defaultPageSize=resp.data.length;
                        if(resp.data.length!=0){
                            //成功查到信息后下载按钮显示出来
                            _this.downloadVisible="";
                        }
                    })
                }

            }

        },
        // 打开编辑框编辑操作
        handleEdit(index, row_msg) {
            this.idx = index;
            //当前表单
            if(row_msg.authority=='1'){
                this.form.authority="高级用户";
            }else {
                this.form.authority="普通用户";
            }
            this.form.uid=row_msg.uid;
            this.form.account=row_msg.account;
            this.form.password=row_msg.password;
            //更改前表单
            this.beforeUpdateForm.uid=row_msg.uid;
            this.beforeUpdateForm.account=row_msg.account;
            this.beforeUpdateForm.password=row_msg.password;
            this.beforeUpdateForm.authority=row_msg.authority;
            //打开编辑框
            this.editVisible = true;
        },
        // 保存编辑
        saveEdit(uid,account,password,authority) {
            const _this=this;
            //给修改后的表单赋值
            _this.afterUpdateForm.uid=uid;
            _this.afterUpdateForm.account=account;
            _this.afterUpdateForm.password=password;
            if(authority=='高级用户'||authority=='1'){
                _this.afterUpdateForm.authority='1';
            }else if(authority=='普通用户'||authority=='0'){
                _this.afterUpdateForm.authority='0';
            }
            if(_this.beforeUpdateForm.uid==_this.afterUpdateForm.uid
            && _this.beforeUpdateForm.account==_this.afterUpdateForm.account
            && _this.beforeUpdateForm.password==_this.afterUpdateForm.password
            && _this.beforeUpdateForm.authority==_this.afterUpdateForm.authority){
                _this.$alert("您并未对该用户作任何修改!");
            }else {
                //update
                _this.$axios({
                    method: 'post',
                    url: 'http://'+host.host+':8082/manage/update',
                    data:{
                        uid:_this.afterUpdateForm.uid,
                        account:_this.afterUpdateForm.account,
                        password:_this.afterUpdateForm.password,
                        authority:_this.afterUpdateForm.authority
                    }
                }).then(function (resp) {
                    if(resp.data==true){
                        _this.editVisible = false;
                        _this.$message.success(`修改第 ${_this.idx + 1} 行成功`);
                        _this.$set(_this.tableData, _this.idx, _this.afterUpdateForm);
                        // _this.$alert("修改成功",'提示');
                    }else {
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
                    _this.$axios.get('http://'+host.host+':8082/manage/all').then(function (resp) {
                        //获取所有数据
                        _this.msgTotal=resp.data.data.length;
                        _this.defaultPageSize=6
                    }),
                    _this.$axios.get('http://'+host.host+':8082/manage/all/1/6').then(function (resp) {
                        //获取第一页数据
                        _this.tableData=resp.data.data;
                    })
                ])
                this.current_page=1;
            }else {
                _this.$axios({
                    method:'post',
                    url:'http://'+host.host+':8082/manage/keyword',
                    data:{keyword}
                }).then(function (resp) {
                    _this.tableData=resp.data.data;
                    _this.msgTotal=resp.data.data.length;
                    //修改每页默认显示条数
                    _this.defaultPageSize=resp.data.data.length;
                })
                _this.query_name=null;
            }
            _this.downloadVisible="none";
        },
        //打开添加用户框
        handleAddUser(){
            const _this=this;
            this.addUserVisible=true;
        },
        //确认添加用户
        confirmAddUser(username,password,profile){
            const _this=this;
            if(username==null||username==null||profile==null||username.match(/^[ ]*$/)||password.match(/^[ ]*$/)||profile.match(/^[ ]*$/)){
                _this.$alert("账号密码身份都不能为空!","提示");
            } else {
                _this.$axios({
                    method: 'get',
                    url: 'http://'+host.host+':8082/manage/check?username='+username
                }).then(function (res) {
                    if(res.data==false){
                        _this.$axios({
                            method: 'post',
                            url:'http://'+host.host+':8082/manage/add_user',
                            data:{username,password,profile}
                        }).then(function (resp) {
                            console.log(resp)
                            if(resp.data==true){
                                _this.$alert("添加用户成功！")
                                _this.addUserVisible=false;
                                setTimeout(function () {
                                    window.location.reload();
                                },1000)
                            }else{
                                _this.$alert("添加用户失败！");
                                _this.addUserVisible=false;
                            }
                        }).catch(error=>{
                            _this.$message.error("网络连接失败");
                        })
                    }else {
                        _this.$alert("该用户已存在，添加失败！");
                    }
                })
                //添加完磁力清空表单和关闭表单窗口
                _this.userForm.username=null;
                _this.userForm.password=null;
                _this.userForm.profile=null;
                _this.addUserVisible=false;
            }
        },

        // 删除操作
        handleDelete(index,uid) {
            const _this=this;
            // 二次确认删除
            _this.$confirm('确定要删除吗？', '提示', {
                type: 'warning'
            }).then(() => {
                this.$axios({
                    method:'get',
                    url:'http://'+host.host+':8082/manage/delete?uid='+uid,
                    }).then(function (resp) {
                        console.log(resp);
                        if(resp.data==true){
                            _this.$message.success('删除成功');
                            _this.tableData.splice(index, 1);
                            _this.msgTotal-=1;
                        }else{
                            _this.$message.error("删除用户失败！");
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
        this.$axios.get('http://'+host.host+':8082/manage/all').then(function (resp) {
            _this.msgTotal=resp.data.data.length;
        })
        //获取第一页数据
        this.$axios.get('http://'+host.host+':8082/manage/all/1/6').then(function (resp) {
            _this.tableData=resp.data.data;
        })
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
