<template>
    <v-container fluid :class="!loading ? 'd-flex align-center' : ''">
        <LoadingComponent v-if="!loading" />
        <NoDataComponent v-else-if="Object.values(document).length == 0" text="Impossibile recuperare informazioni relative al documento cercato" />
        <template v-else>
            <LoginComponent :overlay.sync="login_popup"/>
            <InsertRequestComponent v-on:submit="submit_request" :loan_request_popup.sync="request_popup" :document="document" />
            <v-row class="d-flex justify-center">
                <v-col>
                    <v-card>
                        <v-card-title class="title font-weight-bold justify-center text-center d-flex d-md-none indigo--text">{{ document.kind == "Note" ? "Appunti: " + document.subject : "Libro: " + document.title }}</v-card-title>
                        <v-card-title class="display-1 font-weight-bold justify-center text-center d-none d-md-flex indigo--text">{{ document.kind == "Note" ? "Appunti: " + document.subject : "Libro: " + document.title }}</v-card-title>
                        <v-card-text>
                            <v-row class="d-flex align-center ma-1 justify-space-between">                              
                                <div>
                                    <router-link :to="'/student-detail/' + document.owner_username" :class="kind_page_header" class="link">{{ document.owner_username }}</router-link>
                                </div>                               
                                <div>
                                    <v-btn text :class="[kind_page_header, $vuetify.breakpoint.smAndDown ? 'ma-0 pa-0' : 'mx-10 px-10']" >                          
                                        <div class="inline" @click="shown_reviews.length > 0 ? $vuetify.goTo('#reviews', review_options) : null" >
                                            <v-rating :value="document.medium_review" empty-icon="$vuetify.icons.ratingFull" background-color="grey" half-increments color="amber darken-1" dense :size="$vuetify.breakpoint.smAndDown ? '16' : '26'" readonly></v-rating>
                                            <span v-if="document.reviews.length > 0" :class="$vuetify.breakpoint.smAndDown ? 'caption ml-1' : 'headline ml-4'">{{ Number.isInteger(document.medium_review) ? document.medium_review : document.medium_review.toFixed(1) }} ({{ shown_reviews.length }})</span>
                                        </div>    
                                    </v-btn>
                                </div> 
                            </v-row>
                        </v-card-text>
                        <v-divider></v-divider>
                        <v-card-text>
                            <v-row>
                                <v-col cols="12" :class="class_col">
                                    <span :class="$vuetify.breakpoint.smAndDown ? 'body-2' : 'title'" class="text-uppercase text-center black--text font-weight-bold">{{ document.degree_course }}</span>
                                </v-col>
                                <v-col cols="12" :class="class_col" v-if="document.kind == 'Book'">
                                    <span :class="[kind_page_header, black]">Autore</span>
                                    <v-spacer></v-spacer>
                                    <span :class="kind_page_content">{{ document.author }}</span>
                                </v-col>
                                <v-col cols="12" :class="class_col" v-if="document.kind == 'Book' && document.edition != null">
                                    <span :class="[kind_page_header, black]">Edizione</span>                                    
                                    <v-spacer></v-spacer>
                                    <span :class="kind_page_content">{{ document.edition }}</span>                                        
                                </v-col>
                                <v-col v-if="document.kind == 'Book'" cols="12" :class="class_col">
                                    <span :class="[kind_page_header, black]">Anno di corso</span>
                                    <v-spacer></v-spacer>
                                    <span :class="kind_page_content">{{ document.study_year }}</span> 
                                </v-col>
                                <v-col v-if="document.kind == 'Note'" cols="12" :class="class_col">
                                    <span :class="[kind_page_header, black]">Anno accademico</span>                                   
                                    <v-spacer></v-spacer>
                                    <span :class="kind_page_content">{{ document.academic_year }}</span>
                                </v-col>
                                <v-col v-if="document.kind == 'Book'" cols="12" :class="class_col">
                                    <span :class="[kind_page_header, black]">Materia</span>
                                    <v-spacer></v-spacer>
                                    <span :class="kind_page_content">{{ document.subject }}</span>
                                </v-col>
                                <v-col v-if="document.kind == 'Note' && document.description != null && document.description != ''" cols="12" :class="class_col">
                                    <span :class="[kind_page_header, black]">Descrizione</span>
                                    <v-spacer></v-spacer>
                                    <span :class="kind_page_content">{{ document.description }}</span> 
                                </v-col>
                                <v-col cols="12" :class="class_col">
                                    <span :class="[kind_page_header, black]">Numero di prestiti</span>
                                    <v-spacer></v-spacer>
                                    <span :class="kind_page_content">{{ document.number_loans }}</span>
                                </v-col>
                            </v-row>
                        </v-card-text>
                        <div v-if="Object.values(logged_user).length > 0 && logged_user.username == document.owner_username" class="text-center">
                            <span class="font-weight-black">{{ "Sei il proprietario di " + (document.kind == "Note" ? "questi appunti" : "questo libro") }}</span>
                        </div>
                        <v-card-text>
                            <div class="d-flex align-center justify-center text-center title text--primary">
                                <div class="d-flex align-center">
                                    <v-avatar :color="check_color" size="20" class="mr-2"></v-avatar>
                                    <span :style="{color: check_color }">{{ document.availability }}</span>
                                </div>
                            </div>
                        </v-card-text>
                        <div v-if="document.owner_username != logged_user.username && document.availability_color == 'green' && !requested">
                            <v-card-actions class="justify-center">                       
                                <v-btn outlined color="indigo" @click="open_request_popup">Richiedi Prestito</v-btn>
                            </v-card-actions>
                        </div>
                        <div v-if="requested">
                            <v-card-actions class="justify-center">                       
                                <v-btn outlined disabled>Hai già richiesto il prestito</v-btn>
                            </v-card-actions>
                        </div>
                        <v-divider class="mt-4"></v-divider>
                        <div id="reviews" v-if="shown_reviews.length > 0">
                            <ShowCommentsComponent :comments="shown_reviews" />
                        </div>
                    </v-card>
                </v-col>
            </v-row>
        </template>
    </v-container>
</template>

<script>
    import * as easings from "vuetify/es5/services/goto/easing-patterns";
    import notificationMixin from "@/mixins/notificationMixin";
    import styleMixin from "@/mixins/styleMixin";
    import InsertRequestComponent from "@/components/InsertRequestComponent";
    import LoginComponent from "@/components/LoginComponent";
    import ShowCommentsComponent from "@/components/ShowCommentsComponent";
    import LoadingComponent from "@/components/LoadingComponent";
    import NoDataComponent from "@/components/NoDataComponent";

    export default {
        components: { InsertRequestComponent, LoginComponent, ShowCommentsComponent, LoadingComponent, NoDataComponent },
        mixins: [ notificationMixin, styleMixin ],
        data: () => ({
            easing: "easeInOutCubic",
            easings: Object.keys(easings),
            document: {},
            requested: false,
            loading: false,
            login_popup: false,
            request_popup: false
        }),
        methods: {
            async get_document(id) {
                try {
                    var response = await this.axios.get(this.serverHost + "/document?document_id=" + id);
                    return response.data;
                } catch (err) {
                    return {};
                }
            },
            async get_request(document, user) {
                try {
                    var response = await this.axios.get(this.serverHost + "/request/sended");
                    return response.data.find(req => req.document._id == document._id && req.beneficiary_username == user.username) != null;
                } catch (err) {
                    return false;
                }
            },
            open_request_popup() {
                Object.values(this.logged_user).length == 0 ? this.login_popup = true : this.request_popup = true;
            },
            submit_request() {
                this.requested = true;
            }
        },
        computed: {
            review_options() {
                return {
                    duration: 500,
                    offset: 0,
                    easing: this.easing
                }
            },
            shown_reviews() {
                return this.document.reviews == null ? [] : this.document.reviews.slice().sort((a,b) => new Date(b.insertion_date) - new Date(a.insertion_date));
            },
            check_color() {
                return this.document.availability_color == 'yellow' ? 'orange' : this.document.availability_color;
            }
        },
        async mounted() {
            var result = await Promise.all([
                this.setup_ui_component(), this.get_document(this.$route.params.id)
            ]);
            this.document = result[1];
            this.requested = await this.get_request(this.document, this.logged_user);
            this.loading = true;
        },
        watch: {
            "logged_user": async function() {
                this.requested = await this.get_request(this.document, this.logged_user);
            },
            "$route.params.id": async function () {
                this.document = await this.get_document(this.$route.params.id);
                this.requested = await this.get_request(this.document, this.logged_user);
            }
        }
    }
</script>