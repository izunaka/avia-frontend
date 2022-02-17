<template>
  <div id="app">
    <v-app>
    <Header></Header>
    <router-view></router-view>
    <hr>
    <Footer></Footer>
    </v-app>
  </div>
</template>

<script>
import Header from '@/views/Header.vue';
import Footer from '@/views/Footer.vue';

export default {
  name: 'App',
  components: {
    Header,
    Footer,
  },
}
</script>


<style>
img {
    width: 100%;
    height: 100%;
    object-fit: contain;
}

ul {
  padding-left: 0;
  margin-top: 0;
}

li {
  padding-left: 0;
  list-style-type: none;
}

hr {
	margin-top: 0;
  margin-bottom: 20px;
	padding: 0;
	height: 3px;
	border: none;
	background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
}

</style>