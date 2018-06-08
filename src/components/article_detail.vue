<template>
    <div class="article" :class="{'no-scroll':reply_show}" v-cloak>
        <div class="top-bar">
            <a href="javascript:history.go(-1)" class="back align-center">返回</a>
            <h2 class="align-center">Vue中文社区</h2>
            <div class="reply align-center" @click="openReply">评论</div>
        </div>
        <div class="article-content">
            <h2>{{article.title}}</h2>
            <div class="title">
                <div>
                    <div class="avatar"><img :src="article.author.avatar_url" alt=""></div>
                    <div class="user-info">
                        <p>{{article.author.loginname}}</p>
                        <p>发布于{{timeDeal(article.create_at)}}</p>
                    </div>
                </div>
                <div class="article-data">
                    <p>来自：{{tagDeal(article.tab)}}<br>{{article.visit_count}}次访问</p>
                </div>
            </div>
            <div class="essay" v-html="article.content"></div>
        </div>
        <div class="focus">
            <div class="focus-tip">
                <p v-show="!focus_this">喜欢这篇文章？那就点击关注吧</p>
                <p v-show="focus_this">哈哈哈，您已关注！</p>
            </div>
            <div class="focus-option" @click="collect">
                <i :class="{'active':focus_this}"></i>
            </div>
        </div>
        <div class="comment-box">
            <h5>{{article.replies.length}}人评论：</h5>
            <div class="comment" v-for="(item,index) in article.replies">
                <div class="title">
                    <div>
                        <div class="avatar"><img :src="item.author.avatar_url" alt=""></div>
                        <div class="user-info">
                            <p>{{item.author.loginname}}<span>{{index+1}}楼</span></p>
                            <p>{{timeDeal(item.create_at)}}</p>
                        </div>
                    </div>
                    <div class="option">
                        <!--<div class="support" @click="supportReply(item.id)"><i></i><span>{{item.ups.length}}</span></div>-->
                        <div class="reply" @click="reply(item.id,item.author.loginname)"><i></i></div>
                    </div>
                </div>
                <div class="reply-content" v-html="item.content"></div>
            </div>
        </div>
        <div class="reply_box" v-show="reply_show">
            <div class="reply_input">
                <h4 class="align-center">请输入评论内容</h4>
                <textarea v-model="reply_content" placeholder="说点什么..."></textarea>
                <div class="btn">
                    <div class="cancle" @click="closeReply">取消</div>
                    <div class="confirm" @click="commit_reply">提交</div>
                </div>
            </div>
        </div>
        <toast v-model="alert_show" type="text">{{alert_txt}}</toast>
    </div>
</template>

<script>
    import { Toast } from 'vux'
    export default {
        name: "articleDetail",
        data(){
            return{
                article_id:this.$route.params.id || '',
                article:{},
                focus_this:false,
                accesstoken:'a38f7992-0096-4c65-b3ff-b7db7d264d98',
                reply_content:'',
                reply_id:'',
                reply_show:false,
                alert_txt:'',
                alert_show:false
            }
        },
        created(){
            this.getArticle();
            this.verifyAccesstoken();
        },
        methods:{
            getArticle(){
                this.$axios.get('/api/v1/topic/'+this.article_id)
                    .then( result => {
                        if(result.status != 200){ return false; }
                        this.article = result.data.data;
                    } )
                    .catch( error => {
                        console.log(error)
                    } )
            },
            getUserData(user_name){
                this.$axios.get('/api/v1/user/'+user_name)
                    .then( result => {
                        if(result.status != 200){ return false; }
                        this.verifyCollect(this.article_id,result.data.data.collect_topics)
                        console.log(this.focus_this);
                    } )
                    .catch( error => {
                        console.log(error)
                    } )
            },
            verifyAccesstoken(){
                this.$axios.post('/api/v1/accesstoken',{
                    accesstoken:this.accesstoken
                })
                    .then( result => {
                        if(result.status != 200){ return false; }
                        this.getUserData(result.data.loginname);
                    } )
                    .catch( error => {
                        console.log(error)
                    } )
            },
            verifyCollect(id,arr){
                for(let i=0;i<arr.length;i++){
                    if(id == arr[i].id){
                        this.focus_this = true;
                        return false;
                    }
                }

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
            },
            tagDeal(data){
                switch (data){
                    case 'share':
                        return '分享';
                        break;
                    case 'job':
                        return '招聘';
                        break;
                    case 'weex':
                        return 'weex';
                        break;
                    case 'ask':
                        return '问答';
                        break;
                }
            },
            supportReply(id){
                this.$axios.post('/api/v1/reply/'+id+'/ups',{
                    accesstoken:this.accesstoken
                })
                    .then( result => {
                        console.log(result)
                    } )
                    .catch( error => {
                        console.log(error)
                    } )
            },
            commit_reply(){
                this.$axios.post('/api/v1/topic/'+this.article_id+'/replies',{
                    accesstoken:this.accesstoken,
                    content:this.reply_content,
                    reply_id:this.reply_id
                })
                    .then( result => {
                        this.closeReply();
                        if(result.status != 200){ return false; }
                        this.getArticle();
                    } )
                    .catch( error => {
                        console.log(error);
                        this.closeReply();
                    } )
            },
            closeReply(){
                this.reply_content = '';
                this.reply_id = '';
                this.reply_show = false;
            },
            openReply(){
                this.reply_show = true;
            },
            reply(reply_id,name){
                this.reply_id = reply_id;
                this.reply_content = '@'+name+' ';
                this.reply_show = true;
            },
            collect(){
                if(this.focus_this){
                    this.$axios.post('/api/v1/topic/de_collect',{
                        accesstoken:this.accesstoken,
                        topic_id:this.article_id
                    })
                        .then( result => {
                            if(result.status != 200){
                                this.alert_txt = '取消收藏失败';
                                this.alert_show = true;
                                return false;
                            }
                            this.focus_this = false;
                            this.alert_txt = '取消收藏成功';
                            this.alert_show = true;
                        } )
                        .catch( error => {
                            console.log(error)
                        } )
                }else{
                    this.$axios.post('/api/v1/topic/collect',{
                        accesstoken:this.accesstoken,
                        topic_id:this.article_id
                    })
                        .then( result => {
                            if(result.status != 200){
                                this.alert_txt = '收藏失败';
                                this.alert_show = true;
                                return false;
                            }
                            this.focus_this = true;
                            this.alert_txt = '收藏成功';
                            this.alert_show = true;
                        } )
                        .catch( error => {
                            console.log(error)
                        } )
                }
            }
        },
        components: {
            Toast
        }
    }
</script>

<style scoped>
    .article{
        width:100%;
        padding-top:2.5rem;
        padding-bottom:0.8rem;
    }
    .article .top-bar{
        display: flex;
        justify-content: space-between;
        align-items: center;
        position:fixed;
        top:0;
        left:0;
        height:2.5rem;
        width:100%;
        background-color:#1F78D4;
        color:#fff;
        font-size:0.7rem;
        z-index: 1;
        -webkit-overflow-scroll:touch;
    }
    .article .top-bar h2{
        height:2.5rem;
    }
    .article .top-bar .back,.article .top-bar .reply{
        width:3rem;
        height:2.5rem;
        font-size:0.6rem;
        color:#fff;
    }
    .article .article-content{
        width:15rem;
        margin:0 auto;
    }
    .article-content h2{
        font-size:0.8rem;
        font-weight: bold;
        line-height:1.2rem;
        padding:0.9rem 0;
    }
    .article-content .title{
        display: flex;
        justify-content: space-between;
        align-items: center;
        width:100%;
        height:2rem;
    }
    .article-content .title>div:first-child{
        display: flex;
        justify-content: flex-start;
        align-items: center;
    }
    .article-content .title .avatar{
        width:2rem;
        height:2rem;
        margin-right:0.5rem;
    }
    .article-content .title .avatar img{
        width:2rem;
        height:2rem;
        border-radius:0.2rem;
        overflow: hidden;
    }
    .article-content .title .user-info{
        font-size:0.55rem;
        line-height:0.8rem;
    }
    .article-content .title .article-data{
        display: flex;
        flex-wrap: wrap;
        justify-content: flex-end;
        align-content: center;
        font-size:0.55rem;
        line-height:0.8rem;
        color:#ccc;
    }
    .article-content .title .article-data p{
        text-align: right;
    }
    .article-content .essay{
        width:100%;
        padding:0.8rem 0;
        line-height:1rem;
        overflow: hidden;
    }
    .article .focus{
        display: flex;
        justify-content: space-between;
        align-items: center;
        width:15rem;
        height:3.04rem;
        margin:0.8rem auto;
        border-top:solid #ccc 0.02rem;
        border-bottom:solid #ccc 0.02rem;
    }
    .article .focus-tip{
        width:10.8rem;
        height:3rem;
        padding-left:0.8rem;
    }
    .article .focus-tip p{
        line-height: 3rem;
    }
    .article .focus-option{
        display: flex;
        justify-content: center;
        align-items: center;
        width:3.2rem;
        height:3rem;
    }
    .article .focus-option i{
        display: block;
        width:1.3rem;
        height:1.3rem;
        border-radius: 50%;
        background:url(../assets/img/not_collect.png) center center no-repeat;
        background-size:1.3rem 1.3rem;
    }
    .article .focus-option i.active{
        background:url(../assets/img/collect.png) center center no-repeat;
        background-size:1.3rem 1.3rem;
    }
    .article .comment-box{
        width:15rem;
        margin:0 auto;
    }
    .article .comment-box h5{
        padding-top:0.8rem;
        font-size:0.7rem;
        font-weight: bold;
    }
    .article .comment{
        width:100%;
        padding-top:0.5rem;
    }
    .article .comment+div{
        border-top:solid #ccc 0.02rem;
    }
    .article .comment .title{
        display: flex;
        justify-content: space-between;
        align-items: center;
        width:100%;
        height:2rem;
    }
    .article .comment .title>div{
        display: flex;
        justify-content: flex-start;
        align-items: center;
    }
    .article .comment .title .option{
        display: flex;
        justify-content: flex-end;
        align-items: center;
        width:3.5rem;
        height:2rem;
    }
    .article .comment .title .option>div{
        display: flex;
        justify-content: center;
        align-items: flex-start;
        font-size:0.6rem;
    }
    .article .comment .title .option .support{
        width:2rem;
        height:2rem;
    }
    .article .comment .title .option .reply{
        width:1.5rem;
        height:2rem;
    }
    .article .comment .title .option .support i{
        width:1rem;
        height:1rem;
        background:url(../assets/img/support_1.png) center center no-repeat;
        background-size:1rem 1rem;
    }
    .article .comment .title .option .reply i{
        width:1rem;
        height:1rem;
        background:url(../assets/img/comment.png) center center no-repeat;
        background-size:1rem 1rem;
    }
    .article .comment .title .option>div>span{
        line-height:1rem;
    }
    .article .comment .title .avatar{
        width:1.8rem;
        height:1.8rem;
        margin-right:0.5rem;
    }
    .article .comment .title .avatar img{
        width:1.8rem;
        height:1.8rem;
        border-radius: 0.2rem;
        overflow: hidden;
    }
    .article .comment .title .user-info{
        font-size:0.55rem;
    }
    .article .comment .title .user-info p span{
        padding-left:0.5rem;
        color:#2E78D2;
    }
    .article .comment .reply-content{
        width:100%;
        padding:0.5rem 0;
        font-size:0.55rem;
        color:#666;
    }
    .article .reply_box{
        position:fixed;
        top:0;
        left:0;
        width:100%;
        height:100vh;
        background-color:rgba(0,0,0,0.8);
        z-index: 5;
        -webkit-overflow-scroll:touch;
    }
    .article .reply_box .reply_input{
        position:absolute;
        top:50%;
        left:50%;
        width:14rem;
        background-color:#fff;
        transform: translate(-50%,-50%);
    }
    .article .reply_box .reply_input h4{
        height:2rem;
        font-weight: bold;
        font-size:0.7rem
    }
    .article .reply_box .reply_input textarea{
        width:12rem;
        height:5rem;
        margin:0 1rem 0.8rem;
        padding:0.3rem;
        border:solid #ccc 0.02rem;
    }
    .article .reply_input .btn{
        width:100%;
        height:2rem;
    }
    .article .reply_input .btn>div{
        display: flex;
        justify-content: center;
        align-items: center;
        float:left;
        width:50%;
        height:2rem;
        background-color:#1F78D4;
        color:#fff;
    }
    .article .reply_input .btn .confirm{
        width:calc(50% - 0.02rem);
        border-left:solid #fff 0.02rem;
    }
</style>