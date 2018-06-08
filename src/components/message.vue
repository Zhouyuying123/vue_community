<template>
    <div class="message">
        <top-bar></top-bar>
        <div class="message-container">
            <dl @click="messageListShow(1)">
                <dt class="align-center">未读消息</dt>
                <dd class="align-center"><span class="align-center">{{had_not_read.length}}</span></dd>
            </dl>
            <dl @click="messageListShow(2)">
                <dt class="align-center">已读消息</dt>
                <dd class="align-center"><span class="align-center">{{had_read.length}}</span></dd>
            </dl>
        </div>
        <transition name="nav-fade">
            <nav-bar :page="page" v-show="!message_list_show"></nav-bar>
        </transition>
        <transition name="fade">
            <message-list
                    v-show="message_list_show"
                    @closeList="messageListClose"
                    :message_list="message_list_data"
            ></message-list>
        </transition>
        <toast v-model="toast_show" type="text">{{toast_txt}}</toast>
    </div>
</template>

<script>
    import topBar from '@/components/top_bar.vue'
    import nav from '@/components/nav_bottom.vue'
    import messageList from '@/components/message_list.vue'
    import { Toast } from 'vux'
    export default{
        name:'message',
        data(){
            return{
                page:this.$route.params.page,
                accesstoken:'a38f7992-0096-4c65-b3ff-b7db7d264d98',
                had_read:[],
                had_not_read:[],
                message_list_data:[],
                message_list_show:false,
                toast_show:false,
                toast_txt:''
            }
        },
        created(){
            this.getMessageData();
        },
        methods:{
            getMessageData(){
                this.$axios.get('/api/v1/messages',{
                    params:{
                        accesstoken:this.accesstoken
                    }
                })
                    .then( result => {
                        if(result.status != 200){ return false; }
                        var res = result.data.data;
                        this.had_read = res.has_read_messages;
                        this.had_not_read = res.hasnot_read_messages;
                    } )
                    .catch( error => {
                        console.log(error)
                    } )
            },
            messageListShow(type){
                if(type == 1){
                    if(this.had_not_read.length == 0){
                        this.toast_show = true;
                        this.toast_txt = '没有未读信息';
                        return false;
                    }
                    this.message_list_data = this.had_not_read;
                }else if(type == 2){
                    if(this.had_read.length == 0){
                        this.toast_show = true;
                        this.toast_txt = '没有已读信息';
                        return false;
                    }
                    this.message_list_data = this.had_read;
                }
                this.message_list_show = true;
                this.markRead();
            },
            messageListClose(data){
                this.message_list_data = [];
                console.log(this.message_list_data);
                this.message_list_show = data;
                this.getMessageData();
            },
            markRead(){
                this.$axios.post('/api/v1//message/mark_all',{
                    accesstoken:this.accesstoken
                })
                    .then( result => {
                        console.log(result);
                        if(result.status != 200){ return false; }
                    } )
                    .catch( error => {
                        console.log(error)
                    } )
            }
        },
        components:{
            'top-bar':topBar,
            'nav-bar':nav,
            'message-list':messageList,
            'Toast':Toast
        }
    }
</script>

<style scoped>
    .message{
        width:100%;
    }
    .message-container{
        width:100%;
        padding:2.5rem 0 2.2rem 0;
    }
    .message-container:before{
        content:'';
        display: table;
    }
    .message dl{
        display: flex;
        justify-content: space-between;
        align-items: center;
        width:15rem;
        height:2rem;
        margin:0 auto;
        font-size:0.6rem;
        color:#333;
    }
    .message dl:nth-child(1){
        margin-top:1rem;
    }
    .message dl dt{
        height:2rem;
        width:3.5rem;
    }
    .message dl dd{
        width:3rem;
        height:2rem;
    }
    .message dl dd span{
        height:0.8rem;
        padding:0 0.5rem;
        background-color:rgba(0,0,0,0.7);
        color:#fff;
        border-radius:0.4rem;
    }
    .fade-enter{
        transform: translateX(100vh);
    }
    .fade-enter-active {
        transition: all 0.3s linear;
    }
    .nav-fade-leave-to{
        transform: translateY(2.5rem);
    }
    .nav-fade-leave-active {
        transition: all 0.1s linear;
    }
</style>