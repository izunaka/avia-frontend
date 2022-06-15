import Vue from 'vue'
import VueRouter from 'vue-router'
import Home from '../views/Home.vue'
import TicketsList from '../views/TicketsList.vue'

Vue.use(VueRouter)

const routes = [
  {
    path: '/',
    name: 'Home',
    component: Home
  },
  {
    path: '/list/:where/:to/:dateNumb',
    name: 'TicketsList',
    component: TicketsList,
    props: true,
  }
]

const router = new VueRouter({
  routes
})

export default router
