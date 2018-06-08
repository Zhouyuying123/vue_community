<template>
    <div class="mine">
        <top-bar></top-bar>
        <div class="mine-container">
            <div class="mine-head">
                <div class="user">
                    <span class="avatar"><img :src="user_detail.avatar_url" alt=""></span>
                    <p>{{user_detail.loginname}}</p>
                </div>
            </div>
            <div class="mine-topic">
                <ul>
                    <li>
                        <i></i>
                        <router-link :to="'/mine_list/'+user_name+'/1'">关注的主题({{collect_topics_length}})<i></i></router-link>
                    </li>
                    <li>
                        <i></i>
                        <router-link :to="'/mine_list/'+user_name+'/2'">回复的主题({{recent_replies_length}})<i></i></router-link>
                    </li>
                    <li>
                        <i></i>
                        <router-link :to="'/mine_list/'+user_name+'/3'">发布的主题({{recent_topics_length}})<i></i></router-link>
                    </li>
                </ul>
            </div>
            <!--<div class="release-btn align-center">发&nbsp;&nbsp;布</div>-->
        </div>
        <nav-bar :page="page"></nav-bar>
    </div>
</template>

<script>
    import topBar from '@/components/top_bar.vue'
    import nav from '@/components/nav_bottom.vue'
    export default{
        name:'mine',
        data(){
            return{
                page:this.$route.params.page,
                user_name:'',
                accesstoken:'a38f7992-0096-4c65-b3ff-b7db7d264d98',
                user_detail:{}
            }
        },
        computed:{
            collect_topics_length:function(){
                return this.user_detail.collect_topics.length;
            },
            recent_replies_length:function(){
                return this.user_detail.recent_replies.length;
            },
            recent_topics_length:function(){
                return this.user_detail.recent_topics.length;
            }
        },
        created(){
            this.getUserName();
        },
        methods:{
            getUserName(){
                this.$axios.post('/api/v1/accesstoken',{
                    accesstoken:this.accesstoken
                })
                    .then( result => {
                        if(result.status != 200){ return false; }
                        this.user_name = result.data.loginname;
                        this.getUserDetail(result.data.loginname);
                    } )
                    .catch( error => {
                        console.log(error)
                    } )
            },
            getUserDetail(name){
                this.$axios.get('/api/v1/user/'+name)
                    .then( result => {
                        if(result.status != 200){ return false; }
                        this.user_detail = result.data.data;
                    } )
                    .catch( error => {
                        console.log(error)
                    } )
            }
        },
        components:{
            'top-bar':topBar,
            'nav-bar':nav
        }
    }
</script>

<style scoped>
    .mine{
        width:100%;
    }
    .mine .mine-container{
        width:100%;
        padding:2.5rem 0 2.2rem 0;
    }
    .mine-head{
        position:relative;
        width:100%;
        height:4rem;
        background:url(../assets/img/mine-bg.png) center center no-repeat;
        background-size: 100% auto;
    }
    .mine-head .user{
        position:absolute;
        top:1rem;
        left:50%;
        width:4rem;
        height:5.5rem;
        transform: translateX(-50%);
        z-index:1;
    }
    .mine-head .user .avatar{
        display: block;
        width:4rem;
        height:4rem;
        overflow: hidden;
        background:rgba(255,255,255,0.5) url(../assets/img/logo.png) center 85% no-repeat;
        background-size: 3rem 3rem;
        border-radius:50%;
    }
    .mine-head .user .avatar img{
        width:4rem;
        height:4rem;
        border-radius:50%;
        overflow: hidden;
    }
    .mine-head .user p{
        text-align: center;
        line-height: 1.5rem;
        font-size:0.8rem;
        font-weight: bold;
    }
    .mine-topic{
        width:100%;
        margin-top:5rem;
    }
    .mine-topic ul{
        width:100%;
    }
    .mine-topic li{
        width:100%;
        height:2.32rem;
        border-bottom:solid #ccc 0.02rem;
        font-size:0;
    }
    .mine-topic li>i{
        float:left;
        width:2.5rem;
        height:2.3rem;
    }
    .mine-topic li:nth-child(1)>i{
        background:url(../assets/img/focus.png) center center no-repeat;
        background-size:1rem 1rem;
    }
    .mine-topic li:nth-child(2)>i{
        background:url(../assets/img/reply.png) center center no-repeat;
        background-size:1rem 1rem;
    }
    .mine-topic li:nth-child(3)>i{
        background:url(../assets/img/release.png) center center no-repeat;
        background-size:1rem 1rem;
    }
    .mine-topic li a{
        width:100%;
        height:2.3rem;
        padding-left:2.5rem;
        display: block;
        font-size:0.6rem;
        line-height:2.3rem;
        color:#333;
    }
    .mine-topic li a i{
        float:right;
        display: inline-block;
        width:2rem;
        height:2.3rem;
        background:url(../assets/img/next.png) center center no-repeat;
        background-size:0.7rem 0.7rem;
    }
    .mine .release-btn{
        width:10rem;
        height:2rem;
        margin:2rem auto;
        background-color:#1F78D4;
        border-radius:0.3rem;
        font-size:0.65rem;
        color:#fff;
    }
</style>