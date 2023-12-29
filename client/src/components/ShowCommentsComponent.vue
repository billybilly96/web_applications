<template>
    <div>
        <v-row class="d-flex justify-center">
            <v-col cols="12" sm="5">
                <canvas class="d-flex align-center" id="myChart"></canvas>
            </v-col>
        </v-row>
        <div v-for="(comment,i) in comments" :key="i">
            <v-card-title class="d-flex justify-space-between">
                <v-row no-gutters>
                    <v-col cols="12" class="d-flex align-center justify-center pb-0">
                        <router-link :class="kind_class" class="link" :to="'/student-detail/' + comment.author">
                            <span class="break-text">{{ comment.author }}</span>
                        </router-link>
                        <v-spacer></v-spacer>
                        <span :class="kind_class" class="body-1 text-right">{{ moment(comment.insertion_date).format("DD/MM/YYYY") }}</span>                    
                    </v-col>
                </v-row>      
            </v-card-title>
            <v-card-text>
                <v-rating :class="kind_class" :value="comment.rating" empty-icon="$vuetify.icons.ratingFull" background-color="grey" color="amber darken-1" half-increments dense size="16" readonly></v-rating>
            </v-card-text>
            <v-card-text>
                <v-row no-gutters>
                    <v-col cols="12" class="d-flex align-center">
                        <span :class="kind_class">{{ comment.text }}</span>
                    </v-col>
                </v-row>
            </v-card-text>                          
            <v-divider></v-divider>
        </div>
    </div>
</template>

<script>
    import * as Chart from "chart.js";
    import ChartDataLabels from 'chartjs-plugin-datalabels';

    export default {
        props: {
            comments: { required: true },
        },
        methods: {
            countReview() {
                var review_count = [];
                review_count.push(this.comments.filter(r => r.rating == 1).length);
                review_count.push(this.comments.filter(r => r.rating == 2).length);
                review_count.push(this.comments.filter(r => r.rating == 3).length);
                review_count.push(this.comments.filter(r => r.rating == 4).length);
                review_count.push(this.comments.filter(r => r.rating == 5).length);
                return review_count;
            },  
            drawPie() {
                Chart.defaults.global.legend.labels.usePointStyle = true;
                var review = this.countReview();
                var ctx = document.getElementById("myChart").getContext('2d');
                new Chart(ctx, {
                    type: 'doughnut',
                    data: {
                        labels: ['1★', '2★', '3★', '4★', '5★'],
                        datasets: [{
                            data: review,
                            backgroundColor: [
                                '#EF5350',
                                '#EC407A',
                                '#42A5F5',
                                '#26A69A',
                                '#FDD835'
                            ],
                            borderWidth: 1,
                            borderColor: "#fff"
                        }]
                    },
                    options: {
                        legend: {
                            display: true,
                            position: 'left',
                            onClick: e => e.stopPropagation()
                        },
                        tooltips: {
                            callbacks: {
                                label: function(tooltipItem, data) { 
                                    var txt = data.labels[tooltipItem.index];
                                    var num = data.datasets[tooltipItem.datasetIndex].data[tooltipItem.index];
                                    return txt + ": " + num + (num == 1 ? " recensione" : " recensioni");
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
        computed: {
            kind_class() {
                return this.$vuetify.breakpoint.smAndDown ? '' : 'mx-12 px-12';
            }
        },
        watch: {
            "$route.params.user": function () {
                this.drawPie();
            }   
        },
        mounted() {
            this.drawPie();
        }
    }
</script>

<style scoped>
    .v-card__text {
        padding-top: 0;
    }
    .break-text {
        word-break: break-all;
    }
</style>