<template>
    <div>
        <el-row :gutter="20">
            <el-col :span="24">
                <!--管理员卡片-->
                <el-card shadow="hover" class="mgb20" style="height:252px;">
                    <!--管理员头像-->
                    <div class="user-info">
                        <img src="../../assets/img/kama.png" class="user-avator" alt />
                        <div class="user-info-cont">
                            <div class="user-info-name">{{name}}</div>
                            <div>{{role}}</div>
                        </div>
                    </div>
                    <div class="user-info-list">
                        上次登录时间：
                        <span>{{logintime}}</span>
                    </div>
                    <div class="user-info-list">
                        上次登录地点：
                        <span>珠海</span>
                    </div>
                </el-card>
                <!--前端语言详情栏-->
                <el-card shadow="hover" style="height:252px;" class="mgb20">
                    <div slot="header" class="clearfix">
                        <span>前端语言详情</span>
                    </div>
                    Vue
                    <el-progress :percentage="71.3" color="#42b983"></el-progress>
                    JavaScript
                    <el-progress :percentage="24.1" color="#f1e05a"></el-progress>
                    CSS
                    <el-progress :percentage="13.7"></el-progress>
                    HTML
                    <el-progress :percentage="5.9" color="#f56c6c"></el-progress>
                </el-card>
                <!--后端语言详情栏-->
                <el-card shadow="hover" style="height: 150px;">
                    <div slot="header" class="clearfix">
                        <span>后端语言详情</span>
                    </div>
                    JAVA
                    <el-progress :percentage="100" color="green"></el-progress>
                </el-card>
            </el-col>
        </el-row>
    </div>
</template>

<script>
export default {
    name: 'dashboard',
    data() {
        return {
            //从localStorage中获取信息
            name: localStorage.getItem('ms_username'),
            authority: localStorage.getItem('ms_authority')
        };
    },
    computed: {
        role() {
            if(this.authority==='2'){
                return '超级管理员';
            }else if(this.authority=='1'){
                return '高级用户';
            }else {
                return '普通用户';
            }
            // return this.authority === '1' ? '高级用户' : '普通用户';
        },
        logintime(){
            var oldTime=localStorage.getItem('ms_oldLoginTime');
            var newTime=localStorage.getItem('ms_newLoginTime');
            //不存在旧登录时间就把当前登录时间记录为旧登录时间
            if(oldTime===null){
                return newTime;
            }else {
                return oldTime;
            }
        }
    },
    methods: {
        // changeDate() {
        //     const now = new Date().getTime();
        //     this.data.forEach((item, index) => {
        //         const date = new Date(now - (6 - index) * 86400000);
        //         item.name = `${date.getFullYear()}/${date.getMonth() + 1}/${date.getDate()}`;
        //     });
        // },
    },
    created() {
        // alert(this.$route.query.keyword)
    }
};
</script>


<style scoped>
.el-row {
    margin-bottom: 20px;
}

.grid-content {
    display: flex;
    align-items: center;
    height: 100px;
}

.grid-cont-right {
    flex: 1;
    text-align: center;
    font-size: 14px;
    color: #999;
}

.grid-num {
    font-size: 30px;
    font-weight: bold;
}

.grid-con-icon {
    font-size: 50px;
    width: 100px;
    height: 100px;
    text-align: center;
    line-height: 100px;
    color: #fff;
}

.grid-con-1 .grid-con-icon {
    background: rgb(45, 140, 240);
}

.grid-con-1 .grid-num {
    color: rgb(45, 140, 240);
}

.grid-con-2 .grid-con-icon {
    background: rgb(100, 213, 114);
}

.grid-con-2 .grid-num {
    color: rgb(45, 140, 240);
}

.grid-con-3 .grid-con-icon {
    background: rgb(242, 94, 67);
}

.grid-con-3 .grid-num {
    color: rgb(242, 94, 67);
}

.user-info {
    display: flex;
    align-items: center;
    padding-bottom: 20px;
    border-bottom: 2px solid #ccc;
    margin-bottom: 20px;
}

.user-avator {
    width: 120px;
    height: 120px;
    border-radius: 50%;
}

.user-info-cont {
    padding-left: 50px;
    flex: 1;
    font-size: 14px;
    color: #999;
}

.user-info-cont div:first-child {
    font-size: 30px;
    color: #222;
}

.user-info-list {
    font-size: 14px;
    color: #999;
    line-height: 25px;
}

.user-info-list span {
    margin-left: 70px;
}

.mgb20 {
    margin-bottom: 20px;
}

.todo-item {
    font-size: 14px;
}

.todo-item-del {
    text-decoration: line-through;
    color: #999;
}
</style>
