<template>
    <v-container fluid>
        <v-row>
            <v-col class="pa-2" cols="12" v-for="(request,i) in shown_requests" :key="i">
                <v-card>
                    <v-card-text>
                        <v-row>
                            <template v-if="kind == 'sended'">
                                <v-col cols="12" md="2" :class="class_col">
                                    <span :class="[page_header_mobile, black]">{{ headers[0].text }}</span>   
                                    <v-spacer :class="class_spacer"></v-spacer>  
                                    <router-link class="link" :to="'/student-detail/' + request.document.owner_username">                    
                                        <span :class="kind_mix_content">{{ request.document.owner_username }}</span>  
                                    </router-link>                                            
                                </v-col>
                            </template>
                            <template v-if="kind == 'received'">
                                <v-col cols="12" md="2" :class="class_col">
                                    <span :class="[page_header_mobile, black]">{{ headers[0].text }}</span>   
                                    <v-spacer :class="class_spacer"></v-spacer>                        
                                    <router-link class="link" :to="'/student-detail/' + request.beneficiary_username">
                                        <span :class="kind_mix_content">{{ request.beneficiary_username }}</span>                     
                                    </router-link>                                              
                                </v-col>
                            </template>
                            <v-col cols="12" md="3" :class="class_col">
                                <span :class="[page_header_mobile, black]">{{ headers[1].text }}</span>   
                                <v-spacer :class="class_spacer"></v-spacer> 
                                <template v-if="request.document.kind == 'Book'">
                                    <span :class="kind_mix_content">Libro '{{ request.document.title }}'</span>
                                </template>                       
                                <template v-if="request.document.kind == 'Note'">
                                    <span :class="kind_mix_content">Appunti</span>
                                </template>                                         
                            </v-col>
                            <v-col cols="12" md="2" :class="class_col">             
                                <template>
                                    <span :class="[page_header_mobile, black]">{{ headers[2].text }}</span>
                                    <v-spacer :class="class_spacer"></v-spacer>
                                    <span :class="kind_mix_content">{{ request.document.subject }}</span>
                                </template>   
                            </v-col>
                            <v-col cols="12" md="3" :class="class_col">
                                <span :class="[page_header_mobile, black]">{{ headers[3].text }}</span>
                                <v-spacer :class="class_spacer"></v-spacer>                        
                                <span :class="kind_mix_content">{{ request.loan_day_duration }} giorni</span>                                              
                            </v-col>
                            <v-col cols="12" md="2" :class="class_col">
                                <span :class="[page_header_mobile, black]">{{ headers[4].text }}</span>   
                                <v-spacer :class="class_spacer"></v-spacer>
                                <span :class="kind_mix_content">{{ moment(request.request_date).format("DD/MM/YYYY") }}</span>                                                                            
                            </v-col>
                            <v-col cols="12">
                                <TimelineComponent current_state="1" :current_user="kind == 'received' ? 'owner' : 'beneficiary'" />
                            </v-col>
                            <template v-if="kind == 'sended'">
                                <v-col cols="12" :class="class_col">
                                    <v-btn dark color="red lighten-1" @click="submit_delete(request)">Annulla Richiesta</v-btn>        
                                </v-col>
                            </template>
                            <template v-if="kind == 'received'">
                                <v-col cols="12" class="d-flex align-center justify-space-around">
                                    <v-btn dark :width="$vuetify.breakpoint.smAndDown ? '45%' : '18%'" :class="$vuetify.breakpoint.smAndDown ? 'mx-2' : 'mx-4'" color="green" @click="submit_accept(request)">Accetta</v-btn>        
                                    <v-btn dark :width="$vuetify.breakpoint.smAndDown ? '45%' : '18%'" :class="$vuetify.breakpoint.smAndDown ? 'mx-2' : 'mx-4'" color="red lighten-1" @click="submit_delete(request)">Rifiuta</v-btn>
                                </v-col>
                            </template>
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
            requests: { required: true },
            request_id: { required: true }
        },
        computed: {
            shown_requests() {
                return this.requests.slice().sort((a,b) => new Date(a.insertion_date) - new Date(b.insertion_date));
            }
        },
        methods: {
            submit_accept(request) {
                this.$emit("update:request_id", request._id);
                this.$emit("submit_accept");
            },
            submit_delete(request) {
                this.$emit("update:request_id", request._id);
                this.$emit("submit_delete");
            }
        }
    }
</script>