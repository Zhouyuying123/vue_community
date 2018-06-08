import Vue from 'vue'
import Router from 'vue-router'
import home from '@/components/home'
import message from '@/components/message'
import mine from '@/components/mine'
import articleDetail from '@/components/article_detail'
import mineList from '@/components/mine_list'

Vue.use(Router)

export default new Router({
    // mode:'history',
    routes: [
        {
            path: '/',
            name: 'home',
            component: home
        },
        {
            path: '/message/:page',
            name: 'message',
            component: message
        },
        {
            path: '/mine/:page',
            name: 'mine',
            component: mine
        },
        {
            path: '/article/:id',
            name: 'articleDetail',
            component: articleDetail
        },
        {
            path: '/mine_list/:user_name/:type',
            name: 'mineList',
            component: mineList
        }
    ]
})
