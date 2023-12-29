<template>
    <v-container>
        <v-stepper class="d-none d-md-flex flex-md-column" :value="current_state > 3 ? 3 : (current_state == 3 ? 2 : current_state)">
            <v-stepper-header class="elevation-0">
                <v-stepper-step step="1">{{ current_user == "owner" ? "Richiesta ricevuta" : "Richiesta inviata" }}</v-stepper-step>
                <v-divider></v-divider>
                <v-stepper-step step="2">Prestito in corso</v-stepper-step>   
                <v-divider></v-divider>
                <v-stepper-step step="3">{{ current_state == 4 || (current_state == 2 && current_user == "owner") ? "Prestito annullato" : "Prestito terminato" }}</v-stepper-step>
            </v-stepper-header>
            <v-stepper-items>
                <v-stepper-content class="text-center my-2 py-2 px-12 mx-12" step="1">
                    <span>
                        {{ this.request_text1 + (this.current_user == "owner" ? " consegnare e recuperare " : " ricevere e riconsegnare ") + this.request_text2 + (this.current_user == "owner" ? (" " + this.return_text) : "") }}
                    </span>
                </v-stepper-content>
                <v-stepper-content class="text-center my-2 py-2 px-12 mx-12" step="2">
                    <span>
                        {{ this.current_user == "owner" ? ((this.current_state == 2 ? loan_undo_text : loan_end_text) + " " + feedback_text) : review_text }}
                    </span>
                </v-stepper-content>
                <v-stepper-content class="text-center my-2 py-2 px-12 mx-12" step="3">
                    <span>
                        {{ this.current_user == "owner" ? feedback_text : review_text }}
                    </span>
                </v-stepper-content>
            </v-stepper-items>
        </v-stepper>
        <v-stepper class="d-md-none" vertical :value="current_state > 3 ? 3 : (current_state == 3 ? 2 : current_state)">
            <v-stepper-step step="1">{{ current_user == "owner" ? "Richiesta ricevuta" : "Richiesta inviata" }}</v-stepper-step>
            <v-stepper-content step="1">
                <span class="caption">
                    {{ this.request_text1 + (this.current_user == "owner" ? " consegnare e recuperare " : " ricevere e riconsegnare ") + this.request_text2 + (this.current_user == "owner" ? (" " + this.return_text) : "") }}
                </span>
            </v-stepper-content>
            <v-stepper-step step="2"> Prestito in corso </v-stepper-step>
            <v-stepper-content step="2">
                <span class="caption">
                    {{ this.current_user == "owner" ? ((this.current_state == 2 ? loan_undo_text : loan_end_text) + " " + feedback_text) : review_text }}
                </span>
            </v-stepper-content>
            <v-stepper-step step="3">{{ current_state == 4 || (current_state == 2 && current_user == "owner") ? "Prestito annullato" : "Prestito terminato" }}</v-stepper-step>
            <v-stepper-content step="3">
                <span class="caption">
                    {{ this.current_user == "owner" ? feedback_text : review_text }}
                </span>
            </v-stepper-content>
        </v-stepper>
    </v-container>
</template>

<script>
    export default {
        props: {
            current_state: { required: true },
            current_user: { required: true }
        },
        data: () => ({
            loan_undo_text: "Potrai registrare la fine del prestito solo quando verrà raggiunta la durata minima prevista (15 giorni).",
            loan_end_text: "Registra la fine del prestito non appena il tuo documento sarà stato riconsegnato.",
            feedback_text: "Inserire un feedback sul beneficiario ti consentirà di ottenere 20 punti extra.",
            review_text: "Inserire una recensione sul documento ti consentirà di ottenere 20 punti extra.",
            return_text: "Al completamento del prestito guadagnerai nuovi punti.",
            request_text1: "In caso di richiesta accettata, il prestito avrà inizio e dovrai",
            request_text2: "il documento entro la data prevista."
        })
    }
</script>