<template>
    <header class="header-in">
      <div class="header__inst">
        <div class="header__inst-img">
          <img src="@/assets/img/inst.svg" v-bind:alt="images.inst">
        </div>
        <div class="header__inst-text">
          <span>{{ inst }}</span>
        </div>
      </div>
      <div class="header__telephone">
        <div class="header__telephone-img">
            <img src="@/assets/img/telephone.svg" v-bind:alt="images.tel">
        </div>
        <div class="header__telephone-text">
            {{ tel }}
        </div>
      </div>
      <router-link style="text-decoration: none; color: inherit;" to="/">
      <div class="header__header">
        <div class="header__header-img">
            <img src="@/assets/img/air.png" v-bind:alt="images.air">
        </div>
        <div class="header__header-text">
          {{ header }}
        </div>
      </div>
      </router-link>
    </header>
</template>

<script>
export default {
    name: 'Header',
    data() {
        return {
            images: {
                inst: "Иконка инстаграмма",
                tel: "Иконка телефона",
                air: "Иконка самолётика",
            },
            tel: "+7 (999) 999 XX-XX",
            inst: "airplanes",
            header: "Поиск авиабилетов"
        }
    }
}
</script>

<style>
.header-in {
  width: 100%;
  background-image: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: #FFFFFF;
  display: flex;
  flex-wrap: wrap-reverse;
  flex-direction: row-reverse;
  justify-content: space-around;
  align-items: center;
  font-family: "Comic Sans MS", cursive, sans-serif;
  text-transform: uppercase;
}

.header__header,
.header__inst,
.header__telephone {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  margin: 7px 20px;
}

.header__header-text {
    font-weight: 300;
    font-size: 34px;
}

.header__header-img {
  margin-right: 15px;
  width: 36px;
  height: 36px;
}

.header__inst-img {
  margin-right: 10px;
  width: 20px;
  height: 20px;
}

.header__telephone-img {
  margin-right: 10px;
  width: 20px;
  height: 20px;
}

</style>