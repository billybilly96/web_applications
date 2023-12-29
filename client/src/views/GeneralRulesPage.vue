<template>
    <v-container :class="loading ? 'd-flex align-center' : ''">
        <LoadingComponent v-if="loading" /> 
        <v-row v-else class="d-flex justify-center"> 
            <v-col cols="12"> 
                <v-card v-show="!loading">
                    <v-card-text class="indigo--text headline text-center" :class="{'subtitle-1': $vuetify.breakpoint.smAndDown}"><span class="font-weight-black">AlmaNotes</span> è una piattaforma per la condivisione di libri e appunti universitari</v-card-text>
                    <v-card-text class="my-0 py-0 subtitle-1" :class="{'body-2': $vuetify.breakpoint.smAndDown}">
                        <div class="px-1 mx-1">
                            <ul style="list-style-type:disc">
                                <li><span class="font-weight-black">Cerca i libri e gli appunti</span> di cui hai bisogno e richiedili gratuitamente in prestito.</li>
                                <li><span class="font-weight-black">Carica i tuoi documenti</span> sulla piattaforma, rendendoli disponibili agli altri studenti.</li>
                                <li><span class="font-weight-black">Gestisci i prestiti</span> che hai ottenuto e quelli che hai concesso. Inoltre, puoi inserire una recensione sul documento o un feedback sul beneficiario.</li>
                                <li>Portare a termine un prestito concesso ti consente di <span class="font-weight-black">guadagnare punti</span>, e puoi ottenerli anche inserendo recensioni o feedback.</li>  
                                <li>Utilizza i punti guadagnati per <span class="font-weight-black">riempire la tua borraccia</span>.</li>
                            </ul>
                        </div>
                    </v-card-text>
                    <v-card-text class="text-center">
                        <v-tooltip v-model="show_tooltip" top color="brown lighten-1" :max-width="$vuetify.breakpoint.smAndDown? '21em' : '38em'" class="d-flex justify-center mt-0 pt-0">
                            <template v-slot:activator="{ on }">
                                <v-btn text class="green--text title font-weight-bold" :class="{'subtitle-1': $vuetify.breakpoint.smAndDown}" v-on="on">Come guadagnare punti</v-btn>
                            </template>
                            <span class="subtitle-2">
                                <ul style="list-style-type:disc">
                                    <li>Al momento della registrazione, l'utente riceve 150 punti come bonus di benvenuto.</li>
                                    <li>Per ogni prestito terminato correttamente, il proprietario del documento riceve un punteggio compreso tra 100 e 400.</li>
                                    <li>I punti ricevuti per un prestito sono proporzionali alla sua durata: da 100 in caso di durata minima (15 giorni) a 400 per la durata massima (60 giorni).</li>
                                    <li>Per ogni recensione o feedback inserito, l'autore riceve 20 punti extra.</li>
                                </ul>
                            </span>
                        </v-tooltip>
                    </v-card-text>
                </v-card>
            </v-col>
        </v-row>
        <v-row class="d-flex justify-center"> 
            <v-col :hidden="loading" cols="12" sm="6">
                <v-card class="pl-1 pr-1 pb-1">                
                    <v-card-title :class="{'subtitle-2': $vuetify.breakpoint.smAndDown}" class="title d-flex justify-space-between pa-1">
                        <span><span class="font-weight-black">Studenti iscritti </span> <span>ad AlmaNotes</span></span>
                        <v-spacer></v-spacer>
                        <v-btn icon color="indigo" @click="draw_bar_students">
                            <v-icon>mdi-refresh</v-icon>
                        </v-btn>
                    </v-card-title>
                    <canvas class="d-flex align-center" id="chartStudent"></canvas>
                </v-card>
            </v-col>
            <v-col :hidden="loading" cols="12" sm="6"> 
                <v-card class="pl-1 pr-1 pb-1">
                    <v-card-title :class="{'subtitle-2': $vuetify.breakpoint.smAndDown}" class="title d-flex justify-space-between pa-1">
                        <span><span class="font-weight-black">Documenti presenti </span> <span>su AlmaNotes</span></span>
                        <v-btn icon color="indigo" @click="draw_doughnut_documents">
                            <v-icon>mdi-refresh</v-icon>
                        </v-btn>
                    </v-card-title>
                    <canvas class="d-flex align-center" id="chartDocument"></canvas>
                </v-card>
            </v-col>
        </v-row>
    </v-container>
</template>

<script>
    import * as Chart from "chart.js";
    import LoadingComponent from "@/components/LoadingComponent";
    import universityMixin from "@/mixins/universityMixin";

    export default {
        mixins: [ universityMixin ],
        components: { LoadingComponent },
        data: () => ({
            books: [],
            notes: [],
            students_statistics: [],
            loading: true,
            show_tooltip: false,
            chart_background_color: ['#EF5350', '#EC407A', '#5C6BC0', '#42A5F5', '#26A69A', '#66BB6A', '#FFEE58'],
            chart_border_color: ['#E53935', '#D81B60', '#3949AB', '#1E88E5', '#00897B', '#43A047', '#FDD835']
        }),
        computed: {
            subject_labels() {
                return this.get_degree_courses().map(dc => {
                    dc = dc.includes("Ingegneria") ? dc.replace("Ingegneria", "I.") : dc;
                    dc = dc.includes(" e Scienze") ? dc.replace(" e Scienze", "S.") : dc;
                    return dc;
                });
            },
            subject_data_students() {
                return this.get_degree_courses().map(dc => {
                    var statistic = this.students_statistics.find(stat => stat.degree_course == dc);
                    return statistic == null ? 0 : statistic.n_students;
                });
            },
            subject_data_documents() {
                return this.get_degree_courses().map(dc => {
                    return this.books.filter(doc => doc.degree_course == dc).length + this.notes.filter(doc => doc.degree_course == dc).length;
                });
            }
        },
        methods: {
            async get_books() {
                try {
                    var response = await this.axios.get(this.serverHost + "/book");
                    return response.data;
                } catch (err) {
                    return [];
                }
            },
            async get_notes() {
                try {
                    var response = await this.axios.get(this.serverHost + "/note");
                    return response.data;
                } catch (err) {
                    return [];
                }
            },
            async get_students_statistics() {
                try {
                    var response = await this.axios.get(this.serverHost + "/student/statistics");
                    return response.data;
                } catch (err) {
                    return [];
                }
            },
            draw_bar_students() {
                Chart.defaults.global.legend.display = false;
                Chart.defaults.global.defaultFontColor = "black";
                var ctx = document.getElementById("chartStudent").getContext('2d');
                new Chart(ctx, {
                    type: 'horizontalBar',
                    data: {
                        labels: this.subject_labels,
                        datasets: [{
                            data: this.subject_data_students,
                            backgroundColor: this.chart_background_color,
                            borderColor: this.chart_border_color,
                            borderWidth: 1
                        }]
                    },
                    options: {
                        scales: {
                            xAxes: [{ scaleLabel: { display: true }, ticks: { beginAtZero: true } }]
                        },
                        tooltips: {
                            callbacks: {
                                title: function() {
                                    return "";
                                },
                                label: function(tooltipItem, data) { 
                                    var txt = data.labels[tooltipItem.index];
                                    var num = data.datasets[tooltipItem.datasetIndex].data[tooltipItem.index];
                                    return txt + ": " + num + (num == 1 ? " studente" : " studenti");
                                }
                            }
                        },
                        plugins: {
                            datalabels: { display: false }
                        }
                    }
                });
            },
            draw_doughnut_documents() {
                Chart.defaults.global.legend.labels.usePointStyle = true;
                var ctx = document.getElementById('chartDocument').getContext('2d');
                new Chart(ctx, {
                    type: 'doughnut',
                    data: {
                        labels: this.subject_labels,
                        datasets: [{
                            label: '# di documenti',
                            data: this.subject_data_documents,
                            backgroundColor: this.chart_background_color,
                            borderWidth: 1              
                        }]
                    },
                    options: {
                        legend: {
                            display: true,
                            position: 'left',
                            labels: { fontSize: 9 },
                            onClick: e => e.stopPropagation()
                        },
                        tooltips: {
                            callbacks: {
                                label: function(tooltipItem, data) { 
                                    var txt = data.labels[tooltipItem.index];
                                    var num = data.datasets[tooltipItem.datasetIndex].data[tooltipItem.index];
                                    return txt + ": " + num + (num == 1 ? " documento" : " documenti");
                                }
                            }
                        },
                        plugins: {
                            datalabels: {
                                formatter: (value, ctx) => {
                                    var sum = 0;
                                    var dataArr = ctx.chart.data.datasets[0].data;                                   
                                    dataArr.map(data => sum += data);
                                    var percentage = (value * 100 / sum).toFixed(1) + "%";
                                    return value == 0 ? "" : percentage;
                                },
                                color: 'white',
                                labels: {
                                    title: { font: { weight: 'bold' } }
                                }
                            }
                        }
                    }
                });
            }
        },
        async mounted() {
            var result = await Promise.all([
                this.get_books(),this.get_notes(), this.get_students_statistics()
            ]);
            this.books = result[0];
            this.notes = result[1];
            this.students_statistics = result[2];
            this.loading = false;       
            this.draw_bar_students();
            this.draw_doughnut_documents();                     
        }
    }
</script>