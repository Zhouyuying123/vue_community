<template>
    <div class="theme-list" id="theme-list">
        <div class="nav">
            <tab :scroll-threshold="6" bar-active-color="#1F78D4" active-color="#1F78D4">
                <tab-item
                        :selected="tab_index == index"
                        v-for="(item,index) in theme_menu"
                        @on-item-click="getThemeData(item.tab,index,false)"
                        :key="item.tab"
                >
                    {{item.name}}
                </tab-item>
            </tab>
        </div>
        <div class="theme-box" id="theme-box">
            <div class="theme" v-for="item in theme_list">
                <router-link :to="'/article/'+item.id">
                    <div class="title">
                        <div class="avatar">
                            <img :src="item.author.avatar_url" alt="">
                        </div>
                        <h2>{{item.title}}</h2>
                        <div class="tab">
                            <span :class="{'top':item.top}">{{tagDeal(item.tab,item.top)}}</span>
                        </div>
                    </div>
                    <div class="option">
                        <div>
                            <span>{{item.author.loginname}}</span>
                            <span>最新{{timeDeal(item.last_reply_at)}}</span>
                        </div>
                        <div>
                            <span>回复:{{item.reply_count}}</span>
                            <span>浏览:{{item.visit_count}}</span>
                        </div>
                    </div>
                </router-link>
            </div>
            <div v-show="load_show">
                <load-more :tip="'正在加载'" v-show="had_more"></load-more>
                <load-more :show-loading="false" :tip="'加载完成'" background-color="#fbf9fe" v-show="!had_more"></load-more>
            </div>
        </div>
    </div>
</template>

<script>
    import { Tab, TabItem,LoadMore } from 'vux'
    export default{
        name:'themeList',
        data(){
            return{
                theme_menu:[
                    {name:'全部',tab:'all'},
                    {name:'精华',tab:'good'},
                    {name:'分享',tab:'share'},
                    {name:'问答',tab:'ask'},
                    {name:'weex',tab:'weex'},
                    {name:'招聘',tab:'job'}
                ],
                tab_index:0,
                tab_name:'all',
                page:1,
                theme_list:[],
                load_show:false,
                had_more:true,
                scroll_dom:''
            }
        },
        created(){
            this.getThemeData('all',0,false);
        },
        mounted(){
            this.scrollListen();
        },
        destroyed(){
            window.removeEventListener('scroll',this.scrollLoad,true);
        },
        methods:{
            getThemeData(tab,index,scroll){
                if(index != this.tab_index){
                    this.tab_name = tab;
                    this.tab_index = index;
                    this.page = 1;
                    this.theme_list = [];
                    this.scrollListen();
                    this.load_show = true;
                    this.had_more = true;
                }
                this.$axios.get('/api/v1/topics',{
                    params:{
                        tab:tab,
                        limit:15,
                        page:this.page
                    }
                })
                    .then(result => {
                        if(result.status != 200){ return false; }
                        var res = result.data.data;
                        this.load_show = false;
                        if(scroll){
                            if(res.length == 15){
                                this.scrollListen();
                            }else{
                                this.had_more = false;
                                this.load_show = true;
                            }
                        }
                        this.theme_list = this.theme_list.concat(res);
                    })
                    .catch(error => {
                        console.log(error)
                    })
            },
            tagDeal(data,top){
                switch (data){
                    case 'share':
                        if(top){
                            return '置顶';
                        }else{
                            return '分享';
                        }
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
            scrollListen(){
                var that = this;
                window.addEventListener('scroll',that.scrollLoad,true);
            },
            scrollLoad(event){
                var list_height = document.getElementById('theme-list').offsetHeight;
                var scroll_height = window.pageYOffset;
                var screen_height = document.documentElement.clientHeight;
                var that = this;
                if((list_height - screen_height - scroll_height) <= 10){
                    window.removeEventListener('scroll',that.scrollLoad,true);
                    that.load_show = true;
                    that.page++;
                    setTimeout(function(){
                        that.getThemeData(that.tab_name,that.tab_index,true);
                    },500)
                }
            }
        },
        components: {
            Tab,
            TabItem,
            LoadMore
        }
    }
</script>

<style scoped>
    .theme-list{
        width:100%;
        padding:4.5rem 0 2.2rem 0;
    }
    .theme-list .nav{
        position:fixed;
        top:2.5rem;
        left:0;
        width:100%;
        height:2rem;
    }
    .theme-list .nav ul{
        width:100%;
        height:2rem;
    }
    .theme-list .nav li{
        display: flex;
        justify-content: center;
        align-items: center;
        float:left;
        width:16.6%;
        height:2rem;
        font-size:0.6rem;
    }
    .theme-list .nav li:first-child,.theme-list .nav li:last-child{
        width:16.8% !important;
    }
    .theme-list .nav li.active{
        color:#1F78D4;
    }
    .theme-list .theme-box{
        width:100%;
    }
    .theme-list .theme{
        width:100%;
        padding:0.8rem 0 0.5rem;
        font-size:0.6rem;
        border-bottom:solid #ccc 0.02rem;
    }
    .theme-list .theme>a{
        display:block;
        width:100%;
    }
    .theme-list .theme .title{
        display: flex;
        justify-content: space-between;
        align-items: center;
        width:15rem;
        height:1.7rem;
        margin:0 auto;
    }
    .theme-list .theme .title .avatar{
        width:1.7rem;
        height:1.7rem;
        margin-right:0.5rem;
        background:url(../assets/img/logo.png) center center no-repeat;
        background-size:1.7rem 1.7rem;
    }
    .theme-list .theme .title .avatar img{
        width:1.7rem;
        height:1.7rem;
        border-radius:0.2rem;
        overflow: hidden;
    }
    .theme-list .theme .title h2{
        overflow: hidden;
        text-overflow: ellipsis;
        display: -webkit-box;
        -webkit-box-orient: vertical;
        -webkit-line-clamp: 2;
        word-break: break-all;
        width:10rem;
        height:1.7rem;
        color:#333;
    }
    .theme-list .theme .title .tab{
        display: flex;
        justify-content: flex-end;
        align-items: flex-end;
        width:2.8rem;
        height:1.7rem;
    }
    .theme-list .theme .title .tab span{
        padding:0.1rem 0.2rem;
        color:#1F78D4;
    }
    .theme-list .theme .title .tab span.top{
        color:#E40E0E;
    }
    .theme-list .theme .option{
        display: flex;
        justify-content: space-between;
        align-items: center;
        width:15rem;
        height:1.5rem;
        margin:0 auto;
        font-size:0.55rem;
        color:#999;
    }
    .theme-list .theme .option>div{
        display: flex;
        justify-content: flex-start;
        align-items: center;
    }
    .theme-list .theme .option>div>span{
        padding-right:0.4rem;
    }
</style>