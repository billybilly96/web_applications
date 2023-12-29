<template>
    <v-container fluid :class="loading ? 'd-flex align-center' : ''">
        <LoadingComponent v-if="loading" />
        <template v-else>
            <ConfirmationComponent
                :confirm.sync="confirmation"
                :alert.sync="confirmation_alert"
                :alert_text.sync="confirmation_alert_text"
                :alert_type.sync="confirmation_alert_type"
                :dialog.sync="confirmation_dialog"
                :dialog_text.sync="confirmation_dialog_text"
                :dialog_title.sync="confirmation_dialog_title"
                v-on:submit="handle_confirmation_click"
            />
            <InsertCommentComponent
                :comment_rating.sync="feedback_rating"
                :comment_text.sync="feedback_text"
                :confirm.sync="insert_confirm"
                :loading.sync="insert_loading"
                :alert.sync="insert_alert"
                :alert_text.sync="insert_alert_text"
                :alert_type.sync="insert_alert_type"
                :dialog.sync="insert_dialog"
                dialog_type="feedback"
                v-on:submit="handle_insert_click"
            />
            <TabsComponent :current_section.sync="current_section" :sections="sections" />
            <template v-if="current_section == sections[0]">
                <NoDataComponent v-if="granted_loans.length == 0" text="Non hai ancora concesso nessun documento in prestito" />
                <template v-else>
                    <HeaderComponent :headers="granted_loans_headers" />
                    <ShowLoansComponent :headers="granted_loans_headers" kind="granted" :loans="granted_loans" :loan_id.sync="loan_id" v-on:submit_write="show_insert_feedback_component" v-on:submit_undo="show_undo_loan_component" v-on:submit_terminate="show_terminate_loan_component" />
                </template>
            </template>
            <template v-if="current_section == sections[1]">
                <NoDataComponent v-if="received_requests.length == 0" text="Al momento, non è presente nessuna richiesta per i tuoi documenti" />
                <template v-else>          
                    <HeaderComponent :headers="received_requests_headers" />
                    <ShowRequestsComponent :headers="received_requests_headers" kind="received" :requests="received_requests" :request_id.sync="request_id" v-on:submit_accept="show_accept_request_component" v-on:submit_delete="show_reject_request_component" />            
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
            granted_loans: [],
            received_requests: [],
            loan_id: null,
            request_id: null,
            feedback_rating: 0,
            feedback_text: "",
            confirmation: false,
            confirmation_alert: false,
            confirmation_alert_text: null,
            confirmation_alert_type: null,
            confirmation_dialog: false,
            confirmation_dialog_text: null,
            confirmation_dialog_title: null,
            insert_confirm: false,
            insert_loading: false,
            insert_alert: false,
            insert_alert_text: null,
            insert_alert_type: null,
            insert_dialog: false,
            granted_loans_headers: [
                { text: "Beneficiario" },
                { text: "Documento" },
                { text: "Materia" },
                { text: "Periodo" },
                { text: "Stato" }
            ],
            received_requests_headers: [
                { text: "Beneficiario" },
                { text: "Documento" },
                { text: "Materia" },
                { text: "Durata Prevista" },
                { text: "Data Richiesta" }
            ],
            current_section: null,
            sections: [ "Prestiti Concessi", "Richieste Ricevute" ],
            loading: true
        }),
        methods: {
            async get_granted_loans() {
                try {
                    var response = await this.axios.get(this.serverHost + "/loan/granted");
                    return response.data;
                } catch (err) {
                    return [];
                }
            },
            async get_received_requests() {
                try {
                    var response = await this.axios.get(this.serverHost + "/request/received");
                    return response.data;
                } catch (err) {
                    return [];
                }
            },
            async handle_insert_click() {
                try {
                    this.insert_loading = true;
                    await this.axios.post(this.serverHost + "/loan/feedback", {
                        loan_id: this.loan_id,
                        rating: this.feedback_rating,
                        text: this.feedback_text
                    });
                    this.granted_loans = await this.get_granted_loans();
                    this.insert_dialog = false;
                    this.insert_alert = true;
                    this.insert_alert_text = "Feedback salvato correttamente!";
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
            async handle_confirmation_click() {
                try {
                    if (this.confirmation_dialog_title == "Accetta Richiesta") {
                        await this.handle_accept_request_click();
                    } else if (this.confirmation_dialog_title == "Rifiuta Richiesta") {
                        await this.handle_reject_request_click();
                    } else if (this.confirmation_dialog_title == "Registra Fine Prestito") {
                        await this.handle_end_loan_click(false);
                    } else if (this.confirmation_dialog_title == "Annulla Prestito") {
                        await this.handle_end_loan_click(true);
                    }
                } catch (err) {
                    this.confirmation_dialog = false;
                    this.confirmation_alert = true;
                    this.confirmation_alert_text = err.response.data.description;
                    this.confirmation_alert_type = "error";
                    await new Promise(res => setTimeout(res, 3000));
                    this.confirmation_alert = false;
                    this.confirmation = false;
                }
            },
            async handle_accept_request_click() {
                await this.axios.post(this.serverHost + "/loan", { request_id: this.request_id });
                var index = this.received_requests.findIndex(req => req._id == this.request_id);
                this.received_requests.splice(index, 1);
                this.granted_loans = await this.get_granted_loans();
                this.confirmation_dialog = false;
                this.confirmation_alert = true;
                this.confirmation_alert_text = "Richiesta accettata correttamente!";
                this.confirmation_alert_type = "success";
                await new Promise(res => setTimeout(res, 2000));
                this.confirmation_alert = false;
                this.confirmation = false;
            },
            async handle_reject_request_click() {
                await this.axios.delete(this.serverHost + "/request?request_id=" + this.request_id);
                var index = this.received_requests.findIndex(req => req._id == this.request_id);
                this.received_requests.splice(index, 1);
                this.confirmation_dialog = false;
                this.confirmation_alert = true;
                this.confirmation_alert_text = "Richiesta rifiutata correttamente!";
                this.confirmation_alert_type = "success";
                await new Promise(res => setTimeout(res, 2000));
                this.confirmation_alert = false;
                this.confirmation = false;
            },
            async handle_end_loan_click(undo) {
                var response = await this.axios.put(this.serverHost + "/loan", { loan_id: this.loan_id });
                var index = this.granted_loans.findIndex(loan => loan._id == this.loan_id);
                this.granted_loans[index].end_date = response.data.end_date;
                this.granted_loans[index].returned = response.data.returned;
                this.confirmation_dialog = false;
                this.confirmation_alert = true;
                this.confirmation_alert_text = undo ? "Prestito annullato correttamente!" : "Fine del prestito registrata correttamente!";
                this.confirmation_alert_type = "success";
                await new Promise(res => setTimeout(res, 2000));
                this.confirmation_alert = false;
                this.confirmation = false;
            },
            show_accept_request_component() {
                this.confirmation_dialog = true;
                this.confirmation_dialog_text = "Sei sicuro di voler accettare la richiesta?";
                this.confirmation_dialog_title = "Accetta Richiesta";
                this.confirmation = true;         
            },
            show_reject_request_component() {
                this.confirmation_dialog = true;
                this.confirmation_dialog_text = "Sei sicuro di voler rifiutare la richiesta?";
                this.confirmation_dialog_title = "Rifiuta Richiesta";
                this.confirmation = true;
            },
            show_terminate_loan_component() {
                this.confirmation_dialog = true;
                this.confirmation_dialog_text = "Sei sicuro di voler registrare la fine del prestito?";
                this.confirmation_dialog_title = "Registra Fine Prestito";
                this.confirmation = true;
            },
            show_undo_loan_component() {
                this.confirmation_dialog = true;
                this.confirmation_dialog_text = "Sei sicuro di voler annullare il prestito? Ricorda che annullando il prestito non riceverai nuovi punti";
                this.confirmation_dialog_title = "Annulla Prestito";
                this.confirmation = true;
            },
            show_insert_feedback_component() {
                var index = this.granted_loans.findIndex(loan => loan._id == this.loan_id);
                if (index < 0 || this.granted_loans[index].beneficiary_feedback == null) {
                    this.feedback_rating = 0;
                    this.feedback_text = "";
                } else {
                    this.feedback_rating = this.granted_loans[index].beneficiary_feedback.rating;
                    this.feedback_text = this.granted_loans[index].beneficiary_feedback.text;
                }
                this.insert_dialog = true;
                this.insert_confirm = true;
            }
        },
        async mounted() {
            this.current_section = this.$route.params.type == "request" ? this.sections[1] : this.sections[0];            
            var response = await Promise.all([
                this.get_granted_loans(), this.get_received_requests()
            ]);
            this.granted_loans = response[0];
            this.received_requests = response[1];
            this.loading = false;
        },
        watch: {
            "$route.params.type": function() {
                this.current_section = this.$route.params.type == "request" ? this.sections[1] : this.sections[0];            
            }
        }
    }
</script>