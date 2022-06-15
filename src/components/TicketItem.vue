<template>
    <v-container>
        <v-row>
            <v-col cols="12">
                <v-card
                    :width="(this.$vuetify.breakpoint.xs || this.$vuetify.breakpoint.sm) ? '350px' : '800px'"
                    elevation="4"
                    class="mx-auto">
                    <v-card-text>
                        <p>
                        Город отправления: <b>{{ fromCity }}</b>
                        </p>
                        <p>
                        Город прибытия: <b>{{ toCity }}</b>
                        </p>
                        <p>
                        Дата отправления:
                        <b>{{ depDate.toLocaleDateString("ru", dateFormat) }}</b>
                        </p>
                        <p>
                        Дата прибытия:
                        <b>{{ arrDate.toLocaleDateString("ru", dateFormat) }}</b>
                        </p>
                        <p>
                        Цена: <b>{{ cost }} ₽</b>
                        </p>
                    </v-card-text>
                </v-card>
            </v-col>
        </v-row>
    </v-container>
</template>


<script>

export default {
    name: "TicketItem",
    props: ["fromCity", "toCity", "depDate", "arrDate", "cost"],
    data() {
        return {
            dateFormat: {
                year: "numeric",
                month: "long",
                day: "numeric",
                hour: "numeric",
                minute: "numeric",
            },
        }
    }
}

</script>
