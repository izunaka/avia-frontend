<template>
    <div class="form">
        <form @submit.prevent="onSubmit" action="/header" method="post" class="form-comp">
            <div class="form-group">
                <label for="name">Откуда:</label>
                <v-autocomplete 
                    v-model.trim="form_data.where" 
                    :items="cities"
                    :append-icon="null">
                </v-autocomplete>
                <span class="message-error">{{ errors.where }}</span>
            </div>
            <button type="button" v-on:click="swap" class="swap-btn"></button>
            <div class="form-group">
                <label for="surname">Куда:</label>
                <v-autocomplete 
                    v-model.trim="form_data.to" 
                    :items="cities"
                    :append-icon="null">
                </v-autocomplete>
                <span class="message-error">{{ errors.to }}</span>
            </div>
            <div class="form-group">
                <label for="date">Дата отправления:</label>
                <v-menu
                        v-model="menu2"
                        :close-on-content-click="false"
                        :nudge-right="40"
                        transition="scale-transition"
                        offset-y
                        min-width="auto"
                    >
                        <template v-slot:activator="{ on, attrs }">
                            <v-text-field
                                v-model="form_data.date"
                                readonly
                                v-bind="attrs"
                                v-on="on"
                            ></v-text-field>
                        </template>
                        <v-date-picker
                            v-model="form_data.date"
                            @input="menu2 = false"
                            :min="minDate"
                            locale="ru"
                        ></v-date-picker>
                    </v-menu>
                <span class="message-error">{{ errors.date }}</span>
            </div>
            <input class="button" type="submit" value="Подобрать билеты" />
        </form> 
    </div>
</template>

<script>
import axios from "axios";

export default {
    name: "Form",
    data() {
        return {
            cities: [],
            minDate: (new Date(Date.now() - (new Date()).getTimezoneOffset() * 60000)).toISOString().substring(0, 10),
            menu2: false, 
            form_data: {
                where: "",
                to: "",
                date: (new Date(Date.now() - (new Date()).getTimezoneOffset() * 60000)).toISOString().substring(0, 10),
            },
            errors: {
                where: "",
                to: "",
                date: "",
            },
        };
    },
    computed: {
        getDate() {
            return this.form_data.date.getTime();
        },
    },
    async mounted() {
        this.cities = (await this.getCities()).data.map(e => ({
            text: e.cityName,
            value: e.id,
        }));
    },
    methods: {
        swap() {
            [this.form_data.where, this.form_data.to] = [
                this.form_data.to,
                this.form_data.where,
            ];
        },
        onSubmit() {
            let isValid = true;
            if (this.form_data.where == "") {
                this.errors.where =
                    "Введите город отправдения";
                isValid = false;
            } else {
                this.errors.where = "";
            }
            if (this.form_data.to == "") {
                this.errors.to =
                    "Введите город прибытия";
                isValid = false;
            } else {
                this.errors.to = "";
            }
            let date = new Date(this.form_data.date);
            date.setHours(23, 59, 59, 0);
            if (date < Date.now()) {
                this.errors.date = "Выбрана дата ранее сегодняшнего дня";
                isValid = false;
            } else {
                this.errors.date = "";
            }

            if (isValid) {
                this.$router.push({
                    path:
                        "/list/" +
                        this.form_data.where +
                        "/" +
                        this.form_data.to +
                        "/" +
                        date.getTime(),
                });
            }
        },
        getCities() {
            let request = `${this.$store.getters.getApi}cities`;
            return axios.get(request);
        }
    },

};
</script>


<style>
*::after {
    content: none !important;
}

*::before {
    border: none !important;
}

.form {
    display: flex;
    align-items: center;
    justify-content: center;
    width: 100%;
    height: 100%;
}

.form-comp {
    margin-top: -200px;
    width: 60%;
    font-family: "Comic Sans MS", cursive, sans-serif;
    color: #ffffff;
}

.form-group {
    margin-bottom: 10px;
}

.form-group input[type="text"] {
    background: white;
    display: block;
    margin: 4px 0;
    margin-bottom: 0;
    padding: 10px 10px;
    border-radius: 10px;
    border: 1px solid #eee;
    transition: 0.3s border-color;
    width: 100%;
}

.form-group input:hover {
    border: 1px solid #aaa;
}

.button {
    appearance: none;
    -webkit-appearance: none;
    padding: 10px;
    border: none;
    background-color: #3f5190;
    font-family: "Comic Sans MS", cursive, sans-serif;
    color: #ffffff;
    font-size: 16px;
    font-weight: 300;
    border-radius: 5px;
    width: 100%;
}

.button:hover {
    border: none;
    cursor: pointer;
}

.swap-btn {
    appearance: none;
    -webkit-appearance: none;
    margin: 0 auto;
    margin-top: 7px;
    display: block;
    height: 40px;
    width: 40px;
    border-radius: 50%;
    border: 3px solid #8989a7;
    background-image: url(../assets/img/arrows.png);
    background-color: white;
    background-size: 34px;
    background-repeat: no-repeat;
}

.swap-btn:hover {
    border: 3px solid #3f5190;
    background-image: url(../assets/img/arrows.png);
}

.swap-btn:active {
    background: #3f5190;
}

.message-error {
    margin: 0;
    font-size: 11px;
    color: #aa0000;
}
</style>

