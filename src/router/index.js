import Vue from 'vue'
import Router from 'vue-router'
import Hello from '@/components/Hello'
import Goods from '@/components/Goods'
import AddGood from '@/components/AddGood'

Vue.use(Router)

export default new Router({
  routes: [
    {
      path: '/',
      name: 'Hello',
      component: Hello
    },
    {
      path: '/goods',
      name: 'Goods',
      component: Goods
    },
    {
      path: '/add',
      name: 'add',
      component: AddGood
    }
  ]
})
