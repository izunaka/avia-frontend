<template>
    <div class="form">
        <form @submit.prevent="onSubmit" action="/header" method="post">
            <div class="form-group">
                <label for="name">Откуда:</label>
                <input type="text" v-model.trim="form_data.where" name="city" />
                <span class="message-error">{{ errors.where }}</span>
            </div>
            <button type="button" v-on:click="swap" class="swap-btn"></button>
            <div class="form-group">
                <label for="surname">Куда:</label>
                <input type="text" v-model.trim="form_data.to" name="cityTo" />
                <span class="message-error">{{ errors.to }}</span>
            </div>
            <div class="form-group">
                <label for="date">Дата отправления:</label>
                <Datepicker v-model="form_data.date" :language="ru" style="color: #000000"></Datepicker>
                <span class="message-error">{{ errors.date }}</span>
            </div>
            <input class="button" type="submit" value="Подобрать билеты" />
        </form>
    </div>
</template>

<script>
import Datepicker from 'vuejs-datepicker';
import {ru} from 'vuejs-datepicker/dist/locale'

export default {
    name: "Form",
    data() {
        return {
            form_data: {
                where: '',
                to: '',
                date: new Date()
            },
            errors: {
                where: '',
                to: '',
                date: ''
            },
            ru: ru,
        }  
    },
    computed: {
        getDate() {
            return this.form_data.date.getTime();
        }
    },
    methods: {
        swap() {
            [this.form_data.where, this.form_data.to] = [this.form_data.to, this.form_data.where];
        },
        onSubmit() {
            let isValid = true;
            if (this.form_data.where.length <= 2) {
                this.errors.where = "Название города должно содержать больше двух символов";
                isValid = false;
            } else {
                this.errors.where = "";
            }
            if (this.form_data.to.length <= 2) {
                this.errors.to = "Название города должно содержать больше двух символов";
                isValid = false;
            } else {
                this.errors.to = "";
            }
            this.form_data.date.setHours(23, 59, 59, 0)
            if (this.form_data.date < Date.now()) {
                this.errors.date = "Выбрана дата ранее сегодняшнего дня";
                isValid = false;
            } else {
                this.errors.date = "";
            }

            if (isValid) {
                this.$router.push({ 
                    path: '/list/' + this.form_data.where + '/' + this.form_data.to + '/' + this.getDate,
                })
            }
        }
    },
    components: {
       Datepicker
    }
}
</script>


<style>

.form {
    display: flex;
    align-items: center;
    justify-content: center;
    width: 100%;
    height: 100%;
}

form {
    margin-top: -200px;
    width: 60%;
    font-family: "Comic Sans MS", cursive, sans-serif;
    color: #FFFFFF;
}

.form-group {
    margin-bottom: 10px;
}

input[type="text"] {
    display:block;
    margin: 4px 0;
    margin-bottom: 0;
    padding: 10px 10px;
    border-radius:10px;
    border: 1px solid #eee;
    transition: .3s border-color;
    width: 100%;
}

.form-group > input {
    width: calc(100% - 20px);
}

input:hover {
    border: 1px solid #aaa;
}

.button {
    appearance:none;
    -webkit-appearance:none;
    padding:10px;
    border:none;
    background-color:#3F5190;
    font-family: "Comic Sans MS", cursive, sans-serif;
    color: #FFFFFF;
    font-size: 16px;
    font-weight: 300;
    border-radius:5px;
    width:100%;
    margin-top: 25px;
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
    display:block;
    height: 40px;
    width: 40px;
    border-radius: 50%;
    border: 3px solid #8989a7;
    background-image: url(../assets/img/arrows.png);
    background-size: 35px;
    background-repeat: no-repeat;
}

.swap-btn:hover {
    border: 3px solid #3F5190;
    background-image: url(../assets/img/arrows.png);
}

.swap-btn:active {
    background: #3F5190;
}

.message-error {
    margin: 0;
    font-size: 11px;
    color: #AA0000;
}

</style>

