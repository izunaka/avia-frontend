<template>
  <div class="home">
    <div class="home__img">
      <img src="@/assets/img/airplane.png" alt="Картинка самолёта">
    </div>
    <div class="home__form">
      <Form></Form>
    </div>
  </div>
</template>

<script>
import Form from '@/components/Form.vue'

export default {
  name: 'Home',
  components: {
    Form
  }
}
</script>

<style scoped>

  .home {
    display: flex;
    background-image: url(../assets/img/bg.png);
    background-position: 100% 50%;
    background-size: 800px;
    background-repeat: no-repeat;
    height: 700px;
  }

  .home__img,
  .home__form {
    flex-grow: 1;
  }

  .home__img{
    max-width: 60%;
  }
  .home__form {
    max-width: 40%;
  }

  @media screen and (max-width: 1000px) {
    .home__img {
      display: none;
    }
    .home__form {
      max-width: 100%;
    }
  }

</style>
