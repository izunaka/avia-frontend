<template>
    <div class="main-div">
        <div class="list-header">
            <h2 class="header-in-2">Билеты по вашему запросу</h2>
        </div>
        <hr style="width: 60%">
        <div class="container">
            <div class="filt-sort">
                <div class="filter">
                    <h3>Фильтр цены:</h3>
                    <v-range-slider 
                        v-model="value" 
                        :max="maxCost" 
                        :min="minCost" 
                        :tick-labels="labels" 
                        tick-size="0"
                        @input="limitedFilterTickets">
                    </v-range-slider>
                </div>
                <div class="sort">
                    <h3>Сортировка:</h3>
                    <ul>
                        <li>
                            По цене:
                            <br>
                            <input type="radio" id="priceUp" value="up" v-model="sortPrice">
                            <label for="priceUp">по возрастанию</label>
                            <br>
                            <input type="radio" id="priceDown" value="down" v-model="sortPrice">
                            <label for="priceDown">по убыванию</label>
                        </li>
                        <li>
                            По дате отправления:
                            <br>
                            <input type="radio" id="depUp" value="up" v-model="sortDep">
                            <label for="depUp">по возрастанию</label>
                            <br>
                            <input type="radio" id="depDown" value="down" v-model="sortDep">
                            <label for="depUp">по убыванию</label>
                        </li>
                        <li>
                            По дате прибытия:
                            <br>
                            <input type="radio" id="arrUp" value="up" v-model="sortArr">
                            <label for="arrUp">по возрастанию</label>
                            <br>
                            <input type="radio" id="arrDown" value="down" v-model="sortArr">
                            <label for="arrDown">по убыванию</label>
                        </li>
                    </ul>
                    <button class="button" style="width: 40%" v-on:click="clear">Сбросить</button>
                </div>
            </div>
            <hr style="width: 60%">
            <div class="item" v-for="(item, index) in needsTickets" v-bind:key="index">
                <p>Город отправления: <b>{{ item.from }}</b></p>
                <p>Город прибытия: <b>{{ item.to }}</b></p>
                <p>Дата отправления: <b>{{ item.depDate.toLocaleDateString('ru', dateFormat) }}</b></p>
                <p>Дата прибытия: <b>{{ item.arrDate.toLocaleDateString('ru', dateFormat) }}</b></p>
                <p>Цена: <b>{{ item.cost }} $</b></p>
            </div>
        </div>
        <p v-if="needsTickets.length == 0" class="not-found">
            К сожалению, по вашему запросу не найдено билетов.
        </p>
    </div>
</template>

<script>
export default {
    name: "TicketsList",
    data() {
        return {
            where: this.$route.params.where.trim(),
            to: this.$route.params.to.trim(),
            date: new Date(Number(this.$route.params.date)),
            allTickets: [],
            needsTickets: [],
            value: [0, 10000],
            labels: [],
            dateFormat: {
                year: 'numeric', 
                month: 'long', 
                day: 'numeric', 
                hour: 'numeric', 
                minute: "numeric"
            },
            minPrice: "",
            maxPrice: "",
            sortPrice: "",
            sortDep: "",
            sortArr: "",
            maxCost: 0,
            minCost: 0,
        }
    },
    methods: {
        clear() {
            this.sortPrice = "";
            this.sortDep = "";
            this.sortArr = "";
        },
        filterTickets: function() {
            this.needsTickets = this.allTickets.filter((item) => (item.cost >= this.value[0]));
            this.needsTickets = this.allTickets.filter((item) => (item.cost <= this.value[1]));
        },
    },
    computed: {
        ourTickets() {
            let ticks = this.allTickets;
            ticks = ticks.filter((item) => (item.cost >= this.value[0]));
            ticks = ticks.filter((item) => (item.cost <= this.value[1]));

            if (this.sortArr == "up") {
                ticks.sort((a, b) => (a.arrDate - b.arrDate))
            } else if (this.sortArr == "down") {
                ticks.sort((a, b) => (b.arrDate - a.arrDate))
            }
            if (this.sortDep == "up") {
                ticks.sort((a, b) => (a.depDate - b.depDate))
            } else if (this.sortDep == "down") {
                ticks.sort((a, b) => (b.depDate - a.depDate))
            }
            if (this.sortPrice == "up") {
                ticks.sort((a, b) => (a.cost - b.cost))
            } else if (this.sortPrice == "down") {
                ticks.sort((a, b) => (b.cost - a.cost))
            }

            return ticks;
        },
    },
    created() {
        this.allTickets = this.$store.getters.allTickets.filter((item) => 
            ((item.from == this.where) && (item.to == this.to) && (item.depDate >= this.date.setHours(0, 0)) && (item.depDate <= this.date.setHours(23, 59))))
        this.needsTickets = this.allTickets.slice();
        let arr = this.allTickets;
        let max = arr[0].cost;
            for (let i = 1; i < arr.length; i++) {
                if (arr[i].cost > max) {
                    max = arr[i].cost;
                }
            }
        this.maxCost = Math.round(max + 1);
            let min = arr[0].cost;
            for (let i = 1; i < arr.length; i++) {
                if (arr[i].cost < min) {
                    min = arr[i].cost;
                }
            }
        this.minCost = Math.round(min - 1);
        this.value = [this.minCost, this.maxCost];

        let labels = [];
        labels[this.maxCost - this.minCost] = "";
        labels.fill("", 0 , this.maxCost - this.minCost);
        labels[0] = this.minCost;
        labels[this.maxCost - this.minCost] = this.maxCost;
        labels[Math.round((this.maxCost - this.minCost) / 3)] = this.minCost + Math.round((this.maxCost - this.minCost) / 3);
        labels[Math.round((this.maxCost - this.minCost) * 2 / 3)] = this.minCost + Math.round((this.maxCost - this.minCost) * 2 / 3);
        this.labels = labels;
        this.limitedFilterTickets = () => {
            setTimeout(this.filterTickets, 500);
        }
    }
}
</script>

<style scoped>
input[type="number"]::-webkit-outer-spin-button,
input[type="number"]::-webkit-inner-spin-button {
    -webkit-appearance: none;
    margin: 0;
}

input[type="number"] {
    -moz-appearance: textfield;
}
input[type="number"]:hover,
input[type="number"]:focus {
    -moz-appearance: number-input;
}

input[type=number]::-webkit-inner-spin-button,
input[type=number]::-webkit-outer-spin-button {
    -webkit-appearance: none;
    margin: 0;
}

input[type="number"] {
    display:block;
    padding: 10px 10px;
    border-radius:10px;
    border: 1px solid #eee;
    transition: .3s border-color;
    width: 100%;
}

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
    width: 60%;
    display: flex;
    align-items: flex-start;
    justify-content: space-between;
}

.filter, .sort {
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
    background: #FFFFFF;
    margin-bottom: 20px;
    width: 60%;
    font-family: "Comic Sans MS", cursive, sans-serif;
    font-size: 16px;
    color: #764ba2;
    box-shadow: 0 15px 30px 0 rgba(0,0,0,0.11),
    0 5px 15px 0 rgba(0,0,0,0.08);
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

.item>p:nth-child(even) {
    margin-left: 55%;
}

.item>p:nth-child(odd) {
    margin-right: 55%;
}

@media screen and (max-width: 900px) {
    .item, 
    .filt-sort {
        width: 80%;
    }
}



</style>