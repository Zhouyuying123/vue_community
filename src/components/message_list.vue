<template>
    <div class="message-list">
        <div class="close-box"><span class="align-center" @click="closeMessageList">关闭</span></div>
        <div class="container">
            <div class="message-item" v-for="item in message_list">
                <p class="topic-message">
                    {{item.author.loginname}}在<router-link :to="'/article/'+item.topic.id">{{item.topic.title}}</router-link>中回复你：
                </p>
                <div class="reply">
                    <p>{{item.reply.content || '...'}}</p>
                </div>
                <p class="time">{{timeDeal(item.reply.create_at)}}</p>
            </div>
        </div>
    </div>
</template>

<script>
    export default{
        name:'messageList',
        methods:{
            closeMessageList(){
                this.$emit('closeList',false)
            },
            timeDeal(date){
                if(!date){
                    return ' ';
                }
                var time = new Date(date);
                return time.getFullYear()+'年'+(time.getMonth()+1)+'月'+time.getDate()+'日'+' '+time.getHours()+':'+time.getMinutes()+':'+time.getSeconds()+' '+this.weekDeal(date);
            },
            weekDeal(date){
                var day = (new Date(date)).getDay();
                switch(day){
                    case 0:
                        return '星期日';
                        break;
                    case 1:
                        return '星期一';
                        break;
                    case 2:
                        return '星期二';
                        break;
                    case 3:
                        return '星期三';
                        break;
                    case 4:
                        return '星期四';
                        break;
                    case 5:
                        return '星期五';
                        break;
                    case 6:
                        return '星期六';
                        break;
                }
            }
        },
        props:['message_list']
    }
</script>

<style scoped>
    .message-list{
        position:absolute;
        top:0;
        left:0;
        width:100%;
        background-color:#fff;
        z-index: 7;
    }
    .message-list .close-box{
        position:fixed;
        top:0;
        left:0;
        height:2.5rem;
        width:100%;
        background-color:#1F78D4;
    }
    .message-list .close-box span{
        float:right;
        width:3rem;
        height:2.5rem;
        font-size:0.65rem;
        color:#fff;
    }
    .message-list .container{
        width:100%;
        padding:2.5rem 0.8rem 0.8rem;
    }
    .message-list .message-item{
        width:100%;
        padding:0.4rem 0;
        border-bottom:solid #ccc 0.02rem;
    }
    .message-list .message-item .reply{
        width:100%;
        padding:0.4rem 0.3rem;
        margin-bottom:0.5rem;
        border-left:solid 0.2rem #1F78D4;
        font-size:0.6rem;
        background-color: #f0f0f0;
        color:#333;
    }
    .message-list .message-item .reply p{
        line-height:1rem;
    }
    .message-list .message-item .topic-message{
        padding:0.5rem;
        font-size:0.6rem;
        line-height:1rem;
    }
    .message-list .message-item .topic-message a{
        color:#1F78D4;
    }
    .message-list .message-item .time{
        font-size:0.55rem;
        color: #b8b8b8;
        line-height:1rem;
    }
</style>