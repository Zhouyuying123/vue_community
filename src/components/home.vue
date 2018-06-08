<template>
    <div class="home">
        <top-bar></top-bar>
        <theme-list></theme-list>
        <nav-bar :page="page"></nav-bar>
    </div>
</template>

<script>
    import topBar from '@/components/top_bar.vue'
    import nav from '@/components/nav_bottom.vue'
    import themeList from '@/components/theme_list.vue'
    export default {
        name:'home',
        data(){
            return{
                page:this.$route.params.page || ' '
            }
        },
        components:{
            'top-bar':topBar,
            'nav-bar':nav,
            'theme-list':themeList
        }
    }
</script>

<style scoped>
    .home{
        width:100%;
        height:100vh;
        color:#333;
    }
</style>