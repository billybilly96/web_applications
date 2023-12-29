<template>
    <v-overlay :absolute="false" :value="confirm" width="95%">
        <AlertComponent v-if="alert" :type="alert_type" :text="alert_text" />
        <v-container v-if="dialog" class="d-flex justify-center">
            <v-card light class="elevation-20" :min-width="$vuetify.breakpoint.smAndDown ? '18em' : '35em'" max-width="35em" :loading="loading" loader-height="7">
                <v-toolbar dark color="red darken-4 d-flex justify-center">
                    <v-toolbar-title :class="$vuetify.breakpoint.smAndDown ? 'body-1' : ''">{{ dialog_type == "feedback" ? "Scrivi un feedback sul beneficiario" : "Scrivi una recensione sul documento" }}</v-toolbar-title>
                </v-toolbar>
                <v-card-text>
                    <template>
                        <div class="text-center">
                            <v-rating v-model="comment_rating_computed" empty-icon="$vuetify.icons.ratingFull" background-color="grey" color="amber darken-1" dense @input="$v.comment_rating.$touch()" @blur="$v.comment_rating.$touch()"></v-rating>
                            <span style="font-size: 12px; color: #ff5252 !important; caret-color: #ff5252" v-if="comment_rating_errors.length != 0">{{ comment_rating_errors[0] }}</span>
                        </div>
                        <v-textarea v-model="comment_text_computed" :label="'Inserisci il testo ' + (dialog_type == 'feedback' ? 'del feedback' : 'della recensione')" rows="1" full-width auto-grow class="pa-4 pb-0 mb-0" :error-messages="comment_text_errors" @input="$v.comment_text.$touch()" @blur="$v.comment_text.$touch()"></v-textarea>
                    </template>
                    <div class="text-center caption teal lighten-5 black--text mt-4">{{"Per essere " + (dialog_type == "feedback" ? "accettato su AlmaNotes, il feedback " : "accettata su AlmaNotes, la recensione ") + "deve contenere un linguaggio appropriato: non sono ammessi insulti, minacce e oscenità. Il contenuto da te inserito sarà verificato."}}</div>
                </v-card-text>
                <v-card-actions class="d-flex justify-space-between">
                    <v-btn dark @click="submit" width="45%" color="green">Conferma</v-btn>
                    <v-btn dark @click="close" width="45%" color="red lighten-1">Annulla</v-btn>
                </v-card-actions>
            </v-card>
        </v-container>
    </v-overlay>
</template>

<script>
    import { validationMixin } from "vuelidate";
    import { required, between } from "vuelidate/lib/validators";
    import AlertComponent from "@/components/AlertComponent";
 
    export default {
        mixins: [ validationMixin ],
        validations: {
            comment_rating: { between: between(1, 5) },
            comment_text: { required, minCharLength: function(c_text) {
                var c_text_no_spaces = c_text.replace(/\s/g, '');
                return c_text_no_spaces.length >= 30;
            } }
        },
        components: { AlertComponent },
        props: {
            comment_rating: { required: true },
            comment_text: { required: true },
            confirm: { required: true },
            loading: { required: true },
            alert: { required: true },
            alert_text: { required: true },
            alert_type: { required: true },
            dialog: { required: true },
            dialog_type: { required: true }
        },
        computed: {
            comment_rating_computed: {
                get() {
                    return this.comment_rating;
                },
                set(value) {
                    this.$emit("update:comment_rating", value);
                }
            },
            comment_text_computed: {
                get() {
                    return this.comment_text;
                },
                set(value) {                                                   
                    this.$emit("update:comment_text", value);
                }
            },
            comment_rating_errors() {
                var errors = [];
                if (!this.$v.comment_rating.$dirty) {
                    return errors;
                }
                !this.$v.comment_rating.between && errors.push("Il punteggio " + (this.dialog_type == "feedback" ? "del feedback" : "della recensione") + " deve essere compreso tra 1 e 5.");
                return errors;
            },
            comment_text_errors() {
                var errors = [];
                if (!this.$v.comment_text.$dirty) {
                    return errors;
                }
                !this.$v.comment_text.required && errors.push("Il testo " + (this.dialog_type == "feedback" ? "del feedback" : "della recensione") + " è obbligatorio.");
                !this.$v.comment_text.minCharLength && errors.push("Il testo " + (this.dialog_type == "feedback" ? "del feedback" : "della recensione") + " deve contenere minimo 30 caratteri (spazi esclusi).");
                return errors;
            }
        },
        methods: {
            submit() {
                this.$v.$touch();
                if (!this.$v.$invalid) {
                    this.$emit("submit");
                    this.$v.$reset();
                }
            },
            close() {
                this.$v.$reset();
                this.$emit("update:confirm", false);
                this.$emit("update:alert", false);
                this.$emit("update:dialog", false);
            }
        }
    }
</script>