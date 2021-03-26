<template>
    <div class="login-wrap">
        <div class="ms-login">
            <div class="ms-title">kbdog磁力</div>
            <el-form :model="param" :rules="rules" ref="login" label-width="0px" class="ms-content">
                <!--登录账号-->
                <el-form-item prop="username">
                    <el-input v-model="param.username" placeholder="用户名">
                        <el-button slot="prepend" icon="el-icon-lx-people"></el-button>
                    </el-input>
                </el-form-item>
                <!--登录密码-->
                <el-form-item prop="password">
                    <el-input
                        type="password"
                        placeholder="密码"
                        v-model="param.password"
                        @keyup.enter.native="submitForm()"
                    >
                        <el-button slot="prepend" icon="el-icon-lx-lock"></el-button>
                    </el-input>
                </el-form-item>
                <!--登录按钮-->
                <div class="login-btn">
                    <el-button type="primary" @click="submitForm()">登录</el-button>
                </div>
                <p class="login-tips">Tips : 默认超级用户账号密码皆为root</p>
            </el-form>
        </div>
    </div>
</template>

<script>
export default {
    data: function() {
        return {
            param: {
                username: '',
                password: '',
            },
            rules: {
                username: [{ required: true, message: '请输入用户名', trigger: 'blur' }],
                password: [{ required: true, message: '请输入密码', trigger: 'blur' }],
            },
        };
    },
    methods: {
        submitForm() {
            this.$refs.login.validate(valid => {
                //表单填写完整
                if (valid) {
                    const _this=this;
                    //查询是否存在用户
                    _this.$axios({
                        method:'post',
                        url:'http://localhost:8082/login/validate',
                        data:{
                            account:_this.param.username,
                            password:_this.param.password
                        }
                    }).then(function (resp1) {
                        //状态码正确则登陆成功
                        if(resp1.data.code=='200'){
                            //本地添加token
                            console.log(resp1.data.data.token);
                            localStorage.setItem('token',resp1.data.data.token);
                            //获取account
                            _this.$axios({
                                method:'post',
                                url:'http://localhost:8082/login/message',
                                data:{
                                    account:_this.param.username,
                                    password:_this.param.password
                                }
                            }).then(function (resp2) {
                                //登录日期格式化
                                var date=new Date();
                                var year=date.getFullYear();
                                var month=date.getMonth()+1;
                                var day=date.getDate();
                                if  (month >= 1 && month <= 9) {
                                    month =  "0"  + month;
                                }
                                if  (day >= 0 && day <= 9) {
                                    day =  "0"  + day;
                                }
                                var currentDate=year+'-'+month+'-'+day;
                                localStorage.setItem('ms_uid',JSON.parse(JSON.stringify(resp2.data.data))['uid']);
                                localStorage.setItem('ms_username',JSON.parse(JSON.stringify(resp2.data.data))['account']);
                                localStorage.setItem('ms_authority',JSON.parse(JSON.stringify(resp2.data.data))['authority']);
                                localStorage.setItem('ms_newLoginTime',currentDate);
                                _this.$message.success('登陆成功');
                                _this.$router.push('/');
                            });
                        }else {
                            _this.$message.error('账号或密码错误');
                            console.log('error submit!!');
                            return false;
                        }
                    }).catch(error=>{
                        _this.$message.error('网络连接失败！');
                    })
                } else {
                    this.$message.error('请输入账号和密码');
                    console.log('error submit!!');
                    return false;
                }
            });
        },
    },
};
</script>

<style scoped>
.login-wrap {
    position: relative;
    width: 100%;
    height: 100%;
    background-image: url(../../assets/img/7.jpg);
    background-size: 100%;
}
.ms-title {
    width: 100%;
    line-height: 50px;
    text-align: center;
    font-size: 20px;
    color: #fff;
    border-bottom: 1px solid #ddd;
}
.ms-login {
    position: absolute;
    left: 50%;
    top: 50%;
    width: 350px;
    margin: -190px 0 0 -175px;
    border-radius: 5px;
    background: rgba(255, 255, 255, 0.3);
    overflow: hidden;
}
.ms-content {
    padding: 30px 30px;
}
.login-btn {
    text-align: center;
}
.login-btn button {
    width: 100%;
    height: 36px;
    margin-bottom: 10px;
}
.login-tips {
    font-size: 12px;
    line-height: 30px;
    color: #fff;
}
</style>
