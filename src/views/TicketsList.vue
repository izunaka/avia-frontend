<template>
  <div class="main-div">
    <div class="list-header">
      <h2 class="header-in-2">Билеты по вашему запросу</h2>
    </div>
    <div class="container">
      <v-dialog v-model="dialog" max-width="600" v-if="this.$vuetify.breakpoint.xs || this.$vuetify.breakpoint.sm">
        <template v-slot:activator="{ on, attrs }">
          <v-btn v-bind="attrs" v-on="on"> Фильтры и сортировка </v-btn>
        </template>
        <v-card>
          <v-card-title>
            <span class="text-h5">Фильтры и сортировка</span>
          </v-card-title>
          <v-card-text>
            <v-container>
              <v-row>
                <v-col cols="12">
                  <v-range-slider
                    v-model="value"
                    :max="maxCost"
                    :min="minCost"
                    :thumb-label="true"
                    :tick-size="0"
                    @input="limitedFilterTickets"
                  >
                  </v-range-slider>
                </v-col>
                <v-col cols="12">
                  <v-autocomplete
                    v-model="values"
                    :items="items"
                    outlined
                    dense
                    chips
                    small-chips
                    label="Сортировка"
                    multiple
                    @change="changeItems"
                  >
                  </v-autocomplete>
                </v-col>
              </v-row>
            </v-container>
          </v-card-text>
          <v-card-actions>
            <v-spacer></v-spacer>
            <v-btn color="blue darken-1" text @click="dialog = false">
              Готово
            </v-btn>
          </v-card-actions>
        </v-card>
      </v-dialog>
      <div class="filt-sort" v-if="!this.$vuetify.breakpoint.xs && !this.$vuetify.breakpoint.sm">
        <div class="filter">
          <h3>Фильтр цены:</h3>
          <v-range-slider
            v-model="value"
            :max="maxCost"
            :min="minCost"
            tick-size="0"
            :thumb-label="true"
            @input="limitedFilterTickets"
          >
          </v-range-slider>
        </div>
        <div class="sort">
          <h3>Сортировка:</h3>
          <v-autocomplete
            v-model="values"
            :items="items"
            outlined
            dense
            chips
            small-chips
            label="Сортировка"
            multiple
            @change="changeItems"
          >
          </v-autocomplete>
          <button class="button" style="width: 40%" v-on:click="clear">
            Сбросить
          </button>
        </div>
      </div>
      <div class="text-center" v-if="this.$vuetify.breakpoint.xs || this.$vuetify.breakpoint.sm">
        <v-chip
          v-if="value[0] != minCost"
          class="ma-2"
          color="green"
          text-color="white"
          close
          @click="clearMinCost"
          @click:close="clearMinCost"
        >
          Минимальная цена: {{ value[0] }}
        </v-chip>
        <v-chip
          v-if="value[1] != maxCost"
          class="ma-2"
          color="green"
          text-color="white"
          close
          @click="clearMaxCost"
          @click:close="clearMaxCost"
        >
          Максимальная цена: {{ value[1] }}
        </v-chip>
      </div>
      <div class="text-center" v-if="this.$vuetify.breakpoint.xs || this.$vuetify.breakpoint.sm">
        <v-chip
          v-for="(item, index) in values"
          :key="index"
          class="ma-2"
          close
          color="primary"
          @click="clearFilter(item)"
          @click:close="clearFilter(item)"
        >
          {{ item }}
        </v-chip>
      </div>
      <div class="text-center" v-if="this.$vuetify.breakpoint.xs || this.$vuetify.breakpoint.sm">
        <v-chip
          v-if="options"
          class="ma-2"
          color="red"
          text-color="white"
          @click="clear"
        >
          Сбросить
        </v-chip>
      </div>
      <div v-if="loading">
        <v-progress-circular
          :size="70"
          :width="7"
          color="purple"
          indeterminate>
        </v-progress-circular>
      </div>
      <ticket-item
        v-else
        v-for="(item, index) in needsTickets"
        :key="index"
        :from-city="item.fromCity"
        :to-city="item.toCity"
        :dep-date="item.depDate"
        :arr-date="item.arrDate"
        :cost="item.cost">
      </ticket-item>
    </div>
    <p v-if="needsTickets.length == 0 && !loading" class="not-found">
      К сожалению, по вашему запросу не найдено билетов.
    </p>
  </div>
</template>

<script>
import axios from "axios";
import TicketItem from '@/components/TicketItem.vue'

export default {
  name: "TicketsList",
  props: ["where", "to", "dateNumb"],
  components: {
    TicketItem
  },
  data() {
    return {
      loading: false,
      data: null,
      date: null,
      dialog: false,
      items: [
        "Цена ↑",
        "Цена ↓",
        "Дата отправления ↑",
        "Дата отправления ↓",
        "Дата прибытия ↑",
        "Дата прибытия ↓",
      ],
      values: [],
      allTickets: [],
      needsTickets: [],
      value: [0, 10000],
      dateFormat: {
        year: "numeric",
        month: "long",
        day: "numeric",
        hour: "numeric",
        minute: "numeric",
      },
      maxCost: 0,
      minCost: 0,
      timerIdSort: -1,
      timerIdFilter: -1,
    };
  },
  computed: {
    options() {
      return (
        this.values.length != 0 ||
        this.value[0] != this.minCost ||
        this.value[1] != this.maxCost
      );
    },
  },
  methods: {
    clear() {
      this.values = [];
      this.items = [
        "Цена ↑",
        "Цена ↓",
        "Дата отправления ↑",
        "Дата отправления ↓",
        "Дата прибытия ↑",
        "Дата прибытия ↓",
      ];
      this.value = [this.minCost, this.maxCost];
      this.filterTickets();
    },
    clearMinCost() {
      this.value = [this.minCost, this.value[1]];
      this.filterTickets();
    },
    clearMaxCost() {
      this.value = [this.value[0], this.maxCost];
      this.filterTickets();
    },
    clearFilter(filt) {
      this.values = this.values.filter((item) => item != filt);
      this.changeItems();
    },
    filterTickets() {
      this.needsTickets = this.allTickets.filter(
        (item) => item.cost >= this.value[0]
      );
      this.needsTickets = this.needsTickets.filter(
        (item) => item.cost <= this.value[1]
      );
      this.sortTickets();
    },
    changeItems() {
      for (let i = this.values.length - 1; i >= 0; i--) {
        if (this.values[i] == "Дата прибытия ↓") {
          this.items = this.items.filter((item) => item != "Дата прибытия ↑");
        } else if (this.values[i] == "Дата прибытия ↑") {
          this.items = this.items.filter((item) => item != "Дата прибытия ↓");
        }
        if (this.values[i] == "Дата отправления ↓") {
          this.items = this.items.filter(
            (item) => item != "Дата отправления ↑"
          );
        } else if (this.values[i] == "Дата отправления ↑") {
          this.items = this.items.filter(
            (item) => item != "Дата отправления ↓"
          );
        }
        if (this.values[i] == "Цена ↓") {
          this.items = this.items.filter((item) => item != "Цена ↑");
        } else if (this.values[i] == "Цена ↑") {
          this.items = this.items.filter((item) => item != "Цена ↓");
        }
      }
      if (
        this.values.indexOf("Дата прибытия ↑") == -1 &&
        this.items.indexOf("Дата прибытия ↓") == -1
      ) {
        this.items = [...this.items, "Дата прибытия ↓"];
      }
      if (
        this.values.indexOf("Дата прибытия ↓") == -1 &&
        this.items.indexOf("Дата прибытия ↑") == -1
      ) {
        this.items = [...this.items, "Дата прибытия ↑"];
      }
      if (
        this.values.indexOf("Дата отправления ↑") == -1 &&
        this.items.indexOf("Дата отправления ↓") == -1
      ) {
        this.items = [...this.items, "Дата отправления ↓"];
      }
      if (
        this.values.indexOf("Дата отправления ↓") == -1 &&
        this.items.indexOf("Дата отправления ↑") == -1
      ) {
        this.items = [...this.items, "Дата отправления ↑"];
      }
      if (
        this.values.indexOf("Цена ↑") == -1 &&
        this.items.indexOf("Цена ↓") == -1
      ) {
        this.items = [...this.items, "Цена ↓"];
      }
      if (
        this.values.indexOf("Цена ↓") == -1 &&
        this.items.indexOf("Цена ↑") == -1
      ) {
        this.items = [...this.items, "Цена ↑"];
      }
      this.limitedSortTickets();
    },
    sortTickets() {
      for (let i = this.values.length - 1; i >= 0; i--) {
        if (this.values[i] == "Дата прибытия ↓") {
          this.needsTickets.sort((a, b) => a.arrDate - b.arrDate);
        } else if (this.values[i] == "Дата прибытия ↑") {
          this.needsTickets.sort((a, b) => b.arrDate - a.arrDate);
        }
        if (this.values[i] == "Дата отправления ↓") {
          this.needsTickets.sort((a, b) => a.depDate - b.depDate);
        } else if (this.values[i] == "Дата отправления ↑") {
          this.needsTickets.sort((a, b) => b.depDate - a.depDate);
        }
        if (this.values[i] == "Цена ↓") {
          this.needsTickets.sort((a, b) => a.cost - b.cost);
        } else if (this.values[i] == "Цена ↑") {
          this.needsTickets.sort((a, b) => b.cost - a.cost);
        }
      }
    },
  },
  async mounted() {
    this.loading = true;
    this.limitedFilterTickets = () => {
      clearTimeout(this.timerIdFilter);
      this.timerIdFilter = setTimeout(this.filterTickets, 500);
    };
    this.limitedSortTickets = () => {
      clearTimeout(this.timerIdSort);
      this.timerIdSort = setTimeout(this.sortTickets, 500);
    };

    this.date = new Date(Number(this.dateNumb));
    console.log(this.date);
    let year = this.date.getFullYear();
    let month = this.date.getMonth() + 1;
    let day = this.date.getDate();
    let request = `${this.$store.getters.getApi}tickets?from=${this.where}&to=${this.to}&dep=${year}-${month}-${day}`;
    let resp = await axios.get(request);

    this.data = resp.data;
    console.log(this.data);

    for (let i = 0; i < this.data.length; i++) {
        this.data[i].depDate = new Date(this.data[i].depDate);
        this.data[i].arrDate = new Date(this.data[i].arrDate);
        this.data[i].fromCity = this.data[i].fromCity.cityName;
        this.data[i].toCity = this.data[i].toCity.cityName;
    }

    this.allTickets = this.data;

    this.needsTickets = this.allTickets;

    let arr = this.allTickets;
    let max = arr[0]?.cost ?? 0;
    for (let i = 1; i < arr.length; i++) {
      if (arr[i].cost > max) {
        max = arr[i].cost;
      }
    }
    this.maxCost = Math.round(max + 1);
    let min = arr[0]?.cost ?? 0;
    for (let i = 1; i < arr.length; i++) {
      if (arr[i].cost < min) {
        min = arr[i].cost;
      }
    }
    this.minCost = Math.round(min - 1);
    this.value = [this.minCost, this.maxCost];

    this.loading = false;
  },
};
</script>

<style scoped>
.header-in-2 {
  text-align: center;
  font-family: "Comic Sans MS", cursive, sans-serif;
  font-weight: 300;
  font-size: 26px;
  margin-top: 0px;
  padding-top: 20px;
  margin-bottom: 4px;
  color: #764ba2;
}

.main-div {
  margin-top: 0px;
  width: 100%;
  background: rgb(209, 230, 255);
}

.filt-sort {
  margin-bottom: 15px;
  width: 80%;
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
}

.filter,
.sort {
  width: 40%;
  font-family: "Comic Sans MS", cursive, sans-serif;
  font-size: 14px;
  font-weight: 100;
  color: #764ba2;
}

.filt {
  width: calc(100% - 20px);
  margin-bottom: 15px;
  background-color: white;
}

h3 {
  margin-top: 0;
  margin-bottom: 10px;
}

.container {
  display: flex;
  flex-direction: column;
  align-items: center;
}

.item {
  background: #ffffff;
  margin-bottom: 10px;
  margin-top: 10px;
  width: 80%;
  font-family: "Comic Sans MS", cursive, sans-serif;
  font-size: 16px;
  color: #764ba2;
  box-shadow: 0 15px 30px 0 rgba(0, 0, 0, 0.11),
    0 5px 15px 0 rgba(0, 0, 0, 0.08);
  border-radius: 0.5rem;
  border-left: 0 solid #00ff99;
  transition: border-left 300ms ease-in-out;
  padding: 15px 30px;
}

.item > p > b {
  font-size: 20px;
}

.not-found {
  font-family: "Comic Sans MS", cursive, sans-serif;
  font-size: 16px;
  color: #764ba2;
  text-align: center;
  padding-bottom: 20px;
  margin: 0 auto;
}

.item > p:nth-child(even) {
  margin-left: 55%;
}

.item > p:nth-child(odd) {
  margin-right: 55%;
}

@media screen and (max-width: 1000px) {
  .item,
  .filt-sort {
    width: 80%;
  }
}
</style>