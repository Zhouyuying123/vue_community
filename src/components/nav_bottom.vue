<template>
    <div class="nav-bottom">
        <ul>
            <li :class="{'active':page == ' '}">
                <router-link to="/">首页</router-link>
            </li>
            <li :class="{'active':page == '2'}">
                <router-link to="/message/2">消息</router-link>
            </li>
            <li :class="{'active':page == '3'}">
                <router-link to="/mine/3">我的</router-link>
            </li>
        </ul>
    </div>
</template>

<script>
    export default{
        name:'navBottom',
        data(){
            return{
            }
        },
        props:['page']
    }
</script>

<style scoped>
    .nav-bottom{
        position:fixed;
        bottom:0;
        left:0;
        width:100%;
        height:2.2rem;
        background-color:#202D3D;
    }
    .nav-bottom li{
        float:left;
        width:33.33%;
        height:2.2rem;
        font-size:0.65rem;
    }
    .nav-bottom li a{
        display: flex;
        justify-content: center;
        align-items: center;
        width:100%;
        height:2.2rem;
        color:#fff;
    }
    .nav-bottom li.active a{
        color:#1F78D4;
    }
</style>