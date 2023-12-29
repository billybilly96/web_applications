<template>
    <v-container fluid :class="loading ? 'd-flex align-center' : ''">
        <LoadingComponent v-if="loading" />
        <template v-else>
            <ConfirmationComponent
                :confirm.sync="delete_confirm"
                :alert.sync="delete_alert"
                :alert_text.sync="delete_alert_text"
                :alert_type.sync="delete_alert_type"
                :dialog.sync="delete_dialog"
                dialog_text="Sei sicuro di voler annullare la richiesta?"
                dialog_title="Annulla Richiesta"
                v-on:submit="handle_delete_click"
            />
            <InsertCommentComponent
                :comment_rating.sync="review_rating"
                :comment_text.sync="review_text"
                :confirm.sync="insert_confirm"
                :loading.sync="insert_loading"
                :alert.sync="insert_alert"
                :alert_text.sync="insert_alert_text"
                :alert_type.sync="insert_alert_type"
                :dialog.sync="insert_dialog"
                dialog_type="review"
                v-on:submit="handle_insert_click"
            />
            <TabsComponent :current_section.sync="current_section" :sections="sections" />  
            <template v-if="current_section == sections[0]">
                <NoDataComponent v-if="obtained_loans.length == 0" text="Non hai ancora ottenuto nessun documento in prestito" />     
                <template v-else>
                    <HeaderComponent :headers="obtained_loans_headers" />
                    <ShowLoansComponent :headers="obtained_loans_headers" kind="obtained" :loans="obtained_loans" :loan_id.sync="loan_id" v-on:submit_write="show_insert_review_component" />
                </template>
            </template>
            <template v-if="current_section == sections[1]">
                <NoDataComponent v-if="sended_requests.length == 0" text="Al momento, non sei responsabile di nessuna richiesta" />
                <template v-else>          
                    <HeaderComponent :headers="sended_requests_headers" />        
                    <ShowRequestsComponent :headers="sended_requests_headers" kind="sended" :requests="sended_requests" :request_id.sync="request_id" v-on:submit_delete="show_delete_request_component" />      
                </template>   
            </template>
        </template>
    </v-container>
</template>

<script>
    import ConfirmationComponent from "@/components/ConfirmationComponent";
    import HeaderComponent from "@/components/HeaderComponent";
    import InsertCommentComponent from "@/components/InsertCommentComponent";
    import NoDataComponent from "@/components/NoDataComponent";
    import ShowLoansComponent from "@/components/ShowLoansComponent";
    import ShowRequestsComponent from "@/components/ShowRequestsComponent";
    import TabsComponent from "@/components/TabsComponent";
    import LoadingComponent from "@/components/LoadingComponent";
    
    export default {
        components: { ConfirmationComponent, HeaderComponent, InsertCommentComponent, NoDataComponent, ShowLoansComponent, ShowRequestsComponent, TabsComponent, LoadingComponent },
        data: () => ({
            obtained_loans: [],
            sended_requests: [],
            loan_id: null,
            request_id: null,
            review_rating: 0,
            review_text: "",
            delete_confirm: false,
            delete_alert: false,
            delete_alert_text: null,
            delete_alert_type: null,
            delete_dialog: false,
            insert_confirm: false,
            insert_loading: false,
            insert_alert: false,
            insert_alert_text: null,
            insert_alert_type: null,
            insert_dialog: false,
            obtained_loans_headers: [
                { text: "Proprietario" },
                { text: "Documento" },
                { text: "Materia" },
                { text: "Periodo" },
                { text: "Stato" }
            ],
            sended_requests_headers: [
                { text: "Proprietario" },
                { text: "Documento" },
                { text: "Materia" },
                { text: "Durata Prevista" },
                { text: "Data Richiesta" }
            ],
            current_section: null,
            sections: [ "Prestiti Ottenuti", "Richieste Inviate" ],
            loading: true
        }),
        methods: {
            async get_obtained_loans() {
                try {
                    var response = await this.axios.get(this.serverHost + "/loan/obtained");
                    return response.data;
                } catch (err) {
                    return [];
                }
            },        
            async get_sended_requests() {
                try {
                    var response = await this.axios.get(this.serverHost + "/request/sended");
                    return response.data;
                } catch (err) {
                    return [];
                }
            },
            async handle_delete_click() {
                try {
                    await this.axios.delete(this.serverHost + "/request?request_id=" + this.request_id);
                    var index = this.sended_requests.findIndex(req => req._id == this.request_id);
                    this.sended_requests.splice(index, 1);
                    this.delete_dialog = false;
                    this.delete_alert = true;
                    this.delete_alert_text = "Richiesta annullata correttamente!";
                    this.delete_alert_type = "success";
                    await new Promise(res => setTimeout(res, 2000));
                    this.delete_alert = false;
                    this.delete_confirm = false;
                } catch (err) {
                    this.delete_dialog = false;
                    this.delete_alert = true;
                    this.delete_alert_text = err.response.data.description;
                    this.delete_alert_type = "error";
                    await new Promise(res => setTimeout(res, 3000));
                    this.delete_alert = false;
                    this.delete_confirm = false;
                }
            },
            async handle_insert_click() {
                try {
                    this.insert_loading = true;
                    await this.axios.post(this.serverHost + "/loan/review", {
                        loan_id: this.loan_id,
                        rating: this.review_rating,
                        text: this.review_text
                    });
                    this.obtained_loans = await this.get_obtained_loans();
                    this.insert_dialog = false;
                    this.insert_alert = true;
                    this.insert_alert_text = "Recensione salvata correttamente!";
                    this.insert_alert_type = "success";
                    this.insert_loading = false;
                    await new Promise(res => setTimeout(res, 2000));
                    this.insert_alert = false;
                    this.insert_confirm = false;
                } catch (err) {
                    this.insert_alert = true;
                    this.insert_alert_text = err.response.data.description;
                    this.insert_alert_type = "error";
                    this.insert_loading = false;
                }
            },
            show_delete_request_component() {
                this.delete_dialog = true;
                this.delete_confirm = true;
            },
            show_insert_review_component() {
                var index = this.obtained_loans.findIndex(loan => loan._id == this.loan_id);
                if (index < 0 || this.obtained_loans[index].document_review  == null) {
                    this.review_rating = 0;
                    this.review_text = "";
                } else {
                    this.review_rating = this.obtained_loans[index].document_review.rating;
                    this.review_text = this.obtained_loans[index].document_review.text;
                }
                this.insert_dialog = true;
                this.insert_confirm = true;
            }
        },
        async mounted() {
            this.current_section = this.$route.params.type == "request" ? this.sections[1] : this.sections[0];            
            var response = await Promise.all([
                this.get_obtained_loans(), this.get_sended_requests()
            ]);
            this.obtained_loans = response[0];
            this.sended_requests = response[1];
            this.loading = false;
        },
        watch: {
            "$route.params.type": function() {
                this.current_section = this.$route.params.type == "request" ? this.sections[1] : this.sections[0];            
            }
        }
    }
</script>