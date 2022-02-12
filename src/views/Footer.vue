<template>
    <footer>
      <div class="footer__telephone">
        <h3 class="footer__header">КОНТАКТНЫЕ ТЕЛЕФОНЫ</h3>
        <div class="footer__telephone-text">
          <ul>
            <li v-for="(tel, index) in telephones" v-bind:key="index">{{ tel }}</li>
          </ul>
        </div>
      </div>
      <div class="footer__about">
        <h3 class="footer__header">О НАС</h3>
        <div class="footer__about-text">
          Мы сравниваем все доступные варианты перелётов 
          по вашему запросу, а потом предлагаем мгновенно
          приобрести желаемый авиабилет.
        </div>
      </div>
    </footer>
</template>

<script>
export default {
    name: "Footer",
    data() {
        return {
            telephones: [
                "+7 (999) 999 XX-XX",
                "+7 (888) 888 XX-XX",
                "+7 (777) 777 XX-XX"
            ]
        }
    }
}
</script>

<style scoped>
footer {
  font-family: "Comic Sans MS", cursive, sans-serif;
  display: flex;
  flex-wrap: wrap;
  justify-content: space-around;
  align-items: flex-start;  
}

.footer__header {
  margin-bottom: 5px;
}

.footer__telephone,
.footer__about {
  text-align: center;
  flex-grow: 1;
  max-width: 500px;
}

.footer__about {
  margin-left: 10px;
}

</style>