import { createRouter, createWebHistory } from 'vue-router'
import BookingAppoinment from '@/views/BookingAppointment.vue'
import SearchAppointments from '@/views/SearchAppointments.vue'

const routes = [
  {
    path: '/',
    name: 'Booking',
    component: BookingAppoinment
  },
  {
    path: '/appointments/:date?',
    name: 'AppointmentsByDate',
    component: SearchAppointments
  },
  {
    path: '/:catchAll(.*)',
    redirect: '/'
  }
]

const router = createRouter({
  history: createWebHistory(),
  routes: routes
})

export default router
