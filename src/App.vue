<template>
  <main-navigation />
  <router-view></router-view>
  <main-footer />
</template>

<script>
import MainFooter from './components/MainFooter.vue'
import MainNavigation from './components/MainNavigation.vue'

export default {
  name: 'App',
  components: {
    MainFooter,
    MainNavigation
  }
}
</script>

<style>
@import './assets/css/styles.css';

#app {
  background-image: url('../public/imgs/background-waves.svg');
  background-repeat: no-repeat;
  background-position: left top;
  background-size: auto 500px;
  overflow-x: hidden;
}

@media screen and (min-width: 992px) {
  #app {
    background-size: contain;
  }
}
</style>
