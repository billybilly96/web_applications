<template>
    <v-overlay :absolute="false" :value="loan_request_popup">
        <AlertComponent v-if="alert" :type="alert_type" :text="this.alert_text" />
        <v-container v-if="confirm" class="d-flex justify-center">
            <v-card light class="elevation-20" :width="$vuetify.breakpoint.smAndDown ? '100%' : '65%'">
                <v-toolbar dark color="red darken-4 d-flex justify-center">
                    <v-toolbar-title>Riepilogo Richiesta</v-toolbar-title>
                </v-toolbar>
                <v-card-text>
                    <v-row>
                        <v-col cols="12" :class="class_col">
                            <span :class="kind_dialog_header">Corso di laurea</span>
                            <v-spacer></v-spacer>
                            <span :class="kind_dialog_content">{{ document.degree_course }}</span>
                        </v-col>
                        <v-col cols="12" :class="class_col" v-if="document.kind=='Book'">
                            <span :class="kind_dialog_header">Anno di corso</span>                            
                            <v-spacer></v-spacer>
                            <span :class="kind_dialog_content">{{ document.study_year }}</span>                              
                        </v-col>
                        <v-col cols="12" :class="class_col" v-if="document.kind=='Note'">
                            <span :class="kind_dialog_header">Anno accademico</span>                            
                            <v-spacer></v-spacer>
                            <span :class="kind_dialog_content">{{ document.academic_year }}</span>                            
                        </v-col>
                        <v-col cols="12" :class="class_col">
                            <span :class="kind_dialog_header">Materia</span>                           
                            <v-spacer></v-spacer>
                            <span :class="kind_dialog_content">{{ document.subject }}</span>                            
                        </v-col>
                        <v-col cols="12" :class="class_col" v-if="document.kind=='Book'">
                            <span :class="kind_dialog_header">Titolo</span>                          
                            <v-spacer></v-spacer>
                            <span :class="kind_dialog_content">{{ document.title }}</span>
                        </v-col>
                        <v-col cols="12" :class="class_col" v-if="document.kind=='Book'">
                            <span :class="kind_dialog_header">Autore</span>             
                            <v-spacer></v-spacer>
                            <span :class="kind_dialog_content">{{ document.author }}</span>
                        </v-col>
                        <v-col cols="12" :class="class_col">
                            <span :class="kind_dialog_header">Proprietario</span>          
                            <v-spacer></v-spacer>
                            <span :class="kind_dialog_content">{{ document.owner_username }}</span>   
                        </v-col>
                    </v-row>
                    <v-row>
                        <v-col cols="12">
                            <v-select 
                                :dense="$vuetify.breakpoint.smAndDown" 
                                :class="{'ml-12 pl-12 mr-12 pr-12': $vuetify.breakpoint.mdAndUp}" 
                                light 
                                color="grey" 
                                :items="loan_duration_options" 
                                v-model="loan_duration" 
                                label="Seleziona la durata del prestito" 
                                menu-props="auto" 
                                required 
                                :error-messages="loan_duration_errors" 
                                @input="$v.loan_duration.$touch()" 
                                @blur="$v.loan_duration.$touch()"
                            ></v-select>
                        </v-col>
                    </v-row>
                </v-card-text>
                <v-card-actions class="d-flex justify-center">
                    <v-btn dark @click="submit" class="mr-4" width="45%" color="green">Conferma</v-btn>
                    <v-btn dark @click="close" class="ml-4" width="45%" color="red lighten-1">Annulla</v-btn>
                </v-card-actions>
            </v-card>
        </v-container>
    </v-overlay>
</template>

<script>
    import { validationMixin } from "vuelidate";
    import { required } from "vuelidate/lib/validators";
    import styleMixin from "@/mixins/styleMixin";
    import AlertComponent from "@/components/AlertComponent";

    export default {
        components: { AlertComponent },
        mixins: [ styleMixin, validationMixin ],
        props: {
            loan_request_popup: { required: true },
            document: { required: true }
        },
        validations: {
            loan_duration: { required }
        },
        computed: {
            loan_duration_errors() {
                var errors = [];
                if (!this.$v.loan_duration.$dirty) {
                    return errors;
                }
                !this.$v.loan_duration.required && errors.push("Il campo durata del prestito è obbligatorio.");
                return errors;
            }
        },
        data: () => ({
            confirm: true,
            alert: false,
            alert_type: "",
            alert_text: "",
            loan_duration: "",
            loan_duration_options: [ "15 giorni", "30 giorni", "45 giorni", "60 giorni"]
        }),
        methods: {
            async submit() {
                this.$v.$touch();
                if (!this.$v.$invalid) {
                    try {
                        await this.axios.post(this.serverHost + "/request", {
                            document_id: this.document._id,
                            loan_duration: parseInt(this.loan_duration.replace(" giorni", ""))
                        });
                        this.alert_text = "Richiesta di prestito inviata con successo!";
                        this.alert_type = "success";
                        this.alert = true;
                        this.confirm = false;
                        this.$emit("submit");
                        await new Promise(res => setTimeout(res, 2000));
                        this.close();
                    } catch (err) {
                        this.alert_text = err.response.data.description;
                        this.alert_type = "error";
                        this.alert = true;  
                    }
                }
            },
            close() {
                this.$v.$reset();
                this.alert = false;
                this.confirm = true;
                this.loan_duration = "";
                this.$emit("update:loan_request_popup", false);              
            }
        }
    }
</script>