<template>
    <div class="mine-page-list">
        <div class="close-box"><a href="javascript:history.go(-1)" class="align-center">返回</a></div>
        <div class="container">
            <div class="item" v-for="column in list_data">
                <router-link :to="'/article/'+column.id">
                    <h2>{{column.title}}</h2>
                    <div class="info">
                        <div class="author">作者：{{column.author.loginname}}</div>
                        <div class="time">最近回复：{{timeDeal(column.last_reply_at)}}</div>
                    </div>
                </router-link>
            </div>
        </div>
    </div>
</template>

<script>
    export default {
        name: "minePageList",
        data(){
            return{
                user_name:this.$route.params.user_name,
                list_type:this.$route.params.type,
                list_data:[]
            }
        },
        created(){
            this.getUserDetail()
        },
        methods:{
            getUserDetail(){
                this.$axios.get('/api/v1/user/'+this.user_name)
                    .then( result => {
                        if(result.status != 200){ return false; }
                        var res = result.data.data;
                        if(this.list_type == 1){
                            this.list_data = res.collect_topics;
                        }else if(this.list_type == 2){
                            this.list_data = res.recent_replies;
                        }else if(this.list_type == 3){
                            this.list_data = res.recent_topics;
                        }
                    } )
                    .catch( error => {
                        console.log(error)
                    } )
            },
            timeDeal(date){
                var time_now = new Date().getTime();
                var reply_time = new Date(date).getTime();
                var time_interval = parseInt((time_now - reply_time)/1000);
                if(time_interval<60){
                    return 1 + '分钟前';
                }else if(time_interval<60*60){
                    return parseInt(time_interval/60) + '分钟前';
                }else if(time_interval<60*60*24){
                    return parseInt(time_interval/(60*60)) + '小时前';
                }else if(time_interval<60*60*24*30){
                    return parseInt(time_interval/(60*60*24)) + '天前';
                }else if(time_interval<60*60*24*30*12){
                    return parseInt(time_interval/(60*60*24*30)) + '月前';
                }else{
                    return parseInt(time_interval/(60*60*24*30*12)) + '年前';
                }
            }
        }
    }
</script>

<style scoped>
    .mine-page-list{
        width:100%;
        background-color:#fff;
    }
    .mine-page-list .close-box{
        position:fixed;
        top:0;
        left:0;
        height:2.5rem;
        width:100%;
        background-color:#1F78D4;
    }
    .mine-page-list .close-box a{
        float:left;
        width:3rem;
        height:2.5rem;
        font-size:0.6rem;
        color:#fff;
    }
    .mine-page-list .container{
        width:100%;
        padding:2.5rem 0.8rem 0.8rem;
    }
    .mine-page-list .container .item{
        width:100%;
        padding:0.7rem 0.3rem 0.3rem;
        border-bottom:solid #ccc 0.02rem;
    }
    .mine-page-list .container .item a{
        display: block;
        width:100%;
        color:#222;
    }
    .mine-page-list .item h2{
        line-height:0.9rem;
        word-break: break-all;
    }
    .mine-page-list .item .info{
        display: flex;
        justify-content: space-between;
        align-items: center;
        width:100%;
        height:1.5rem;
        color:#999;
    }
</style>