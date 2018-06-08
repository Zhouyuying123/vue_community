<template>
    <div class="top-bar">
        <h2 class="align-center">Vue中文社区</h2>
    </div>
</template>

<script>
    export default {
        name:'topBar'
    }
</script>

<style scoped>
    .top-bar{
        position:fixed;
        top:0;
        left:0;
        height:2.5rem;
        width:100%;
        background-color:#1F78D4;
        color:#fff;
        font-size:0.7rem;
        z-index:5;
    }
    .top-bar h2{
        height:2.5rem;
    }
</style>