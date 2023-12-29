<template>
    <v-container fluid>
        <v-row>
            <v-col class="pa-2" cols="12" v-for="(loan,i) in shown_loans" :key="i">
                <v-card>
                    <v-card-text>
                        <v-row>
                            <template v-if="kind == 'obtained'">
                                <v-col cols="12" md="2" :class="class_col">
                                    <span :class="[page_header_mobile, black]">{{ headers[0].text }}</span>    
                                    <v-spacer :class="class_spacer"></v-spacer>                        
                                    <router-link class="link" :to="'/student-detail/' + loan.document.owner_username">
                                        <span :class="kind_mix_content">{{ loan.document.owner_username }}</span>     
                                    </router-link>       
                                </v-col>    
                            </template>
                            <template v-if="kind == 'granted'">
                                <v-col cols="12" md="2" :class="class_col">
                                    <span :class="[page_header_mobile, black]">{{ headers[0].text }}</span>   
                                    <v-spacer :class="class_spacer"></v-spacer>                        
                                    <router-link class="link" :to="'/student-detail/' + loan.beneficiary_username">
                                        <span :class="kind_mix_content">{{ loan.beneficiary_username }}</span> 
                                    </router-link>       
                                </v-col>    
                            </template>                           
                            <v-col cols="12" md="3" :class="class_col">
                                <span :class="[page_header_mobile, black]">{{ headers[1].text }}</span>   
                                <v-spacer :class="class_spacer"></v-spacer> 
                                <template v-if="loan.document.kind == 'Book'">
                                    <span :class="kind_mix_content">Libro '{{ loan.document.title }}'</span> 
                                </template>                       
                                <template v-if="loan.document.kind == 'Note'">
                                    <span :class="kind_mix_content">Appunti</span>  
                                </template>                                         
                            </v-col>
                            <v-col cols="12" md="2" :class="class_col">
                                <span :class="[page_header_mobile, black]">{{ headers[2].text }}</span>
                                <v-spacer :class="class_spacer"></v-spacer>
                                <span :class="kind_mix_content">{{ loan.document.subject }}</span>
                            </v-col>
                            <v-col cols="12" md="3" :class="class_col">
                                <span :class="[page_header_mobile, black]">{{ headers[3].text }}</span>   
                                <v-spacer :class="class_spacer"></v-spacer>
                                <span :class="kind_mix_content">{{ moment(loan.start_date).format("DD/MM/YYYY") + " - "+ moment(loan.end_date).format("DD/MM/YYYY") }}</span>
                            </v-col>
                            <v-col cols="12" md="2" :class="class_col">
                                <span :class="[page_header_mobile, black]">{{ headers[4].text }}</span>   
                                <v-spacer :class="class_spacer"></v-spacer>  
                                <span :class="kind_mix_content">{{ loan.state }}</span>
                            </v-col>
                            <v-col cols="12">
                                <TimelineComponent :current_state="loan.status_number" :current_user="kind == 'granted' ? 'owner' : 'beneficiary'" />
                            </v-col>
                            <v-col cols="12" :md="kind == 'obtained' || loan.returned ? '12' : '6'" :class="class_col">
                                <v-btn :width="$vuetify.breakpoint.smAndDown ? '85%' : kind == 'obtained'? '18%' : loan.returned ? '18%' : '36%'" dark color="green" @click="submit_write(loan)" v-if="kind == 'obtained'">{{ loan.document_review != null ? "Modifica Recensione": "Inserisci Recensione" }}</v-btn>
                                <v-btn :width="$vuetify.breakpoint.smAndDown ? '85%' : kind == 'obtained'? '18%' : loan.returned ? '18%' : '36%'" dark color="green" @click="submit_write(loan)" v-if="kind == 'granted'">{{ loan.beneficiary_feedback != null ? "Modifica Feedback" : "Inserisci Feedback" }}</v-btn>
                            </v-col>
                            <v-col v-if="kind == 'granted' && !loan.returned" cols="12" md="6" :class="class_col">
                                <v-btn :width="$vuetify.breakpoint.smAndDown ? '85%' : '36%'" dark color="red lighten-1" @click="submit_end(loan)">{{ loan.status_number == 2 ? "Annulla Prestito" : "Registra Fine Prestito" }}</v-btn>
                            </v-col>
                        </v-row>
                    </v-card-text>
                </v-card>
            </v-col>
        </v-row>
    </v-container>
</template>

<script>
    import TimelineComponent from "@/components/TimelineComponent";
    import styleMixin from "@/mixins/styleMixin"; 
     
    export default {
        components: { TimelineComponent },
        mixins: [ styleMixin ],
        props: {
            headers: { required: true },
            kind: { required: true },
            loans: { required: true },
            loan_id: { required: true }
        },
        data: () => ({
            current_date: new Date()
        }),
        computed: {
            shown_loans() {
                return this.loans.map(loan => {
                    var days;
                    if (loan.returned) {
                        days = this.get_days_between(new Date(loan.start_date), new Date(loan.end_date));
                        loan.state = days < 15 ? "Annullato" : "Terminato";
                        loan.status_number = days < 15 ? 4 : 5;
                    } else {
                        days = this.get_days_between(new Date(loan.start_date), this.current_date);
                        loan.state = "In corso";
                        loan.status_number = days < 15 ? 2 : 3;
                    }
                    return loan;
                }).sort((a, b) => {
                    if (a.state == b.state) {
                        var diff = new Date(b.end_date) - new Date(a.end_date);
                        return a.state == "In corso" ? - diff : diff;
                    } else if (a.state == "In corso" || (a.state == "Terminato" && b.state == "Annullato")) {
                        return -1;
                    } else if (a.state == "Annullato" || (a.state == "Terminato" && b.state == "In corso")) {
                        return 1;
                    }
                    return 0;
                });
            }
        },
        methods: {
            get_days_between(start_date, end_date) {
                return parseInt((end_date - start_date) / (1000 * 60 * 60 * 24));
            },
            submit_end(loan) {
                if (loan.status_number == 2) {
                    this.$emit("update:loan_id", loan._id);
                    this.$emit("submit_undo");
                } else if (loan.status_number == 3) {
                    this.$emit("update:loan_id", loan._id);
                    this.$emit("submit_terminate");
                }
            },
            submit_write(loan) {
                this.$emit("update:loan_id", loan._id);
                this.$emit("submit_write");
            }
        }
    }
</script>