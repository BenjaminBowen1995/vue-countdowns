import Vue from 'vue'
import Router from 'vue-router'
import UserList from '@/components/UserList'
import CountdownPage from '@/components/CountdownPage'

Vue.use(Router)

export default new Router({
  routes: [
    {
      path: '/',
      name: 'UserList',
      component: UserList
    },
	{
      path: '/countdowns',
      name: 'CountdownPage',
      component: CountdownPage
    }
  ]
})
