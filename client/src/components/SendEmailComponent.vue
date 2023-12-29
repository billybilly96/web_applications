<template>
    <v-overlay :absolute="false" :value="confirm" >
        <AlertComponent v-if="alert" :type="alert_type" :text="alert_text" />
        <v-container v-if="dialog">
            <v-row>
                <v-col cols="12">
                    <v-card light class="elevation-20" :min-width="$vuetify.breakpoint.smAndDown ? '19em' : '35em'">
                        <v-toolbar dark color="red darken-4 d-flex justify-center">
                            <v-toolbar-title :class="$vuetify.breakpoint.smAndDown ? 'body-1' : ''">Invia email</v-toolbar-title>
                        </v-toolbar>
                        <v-card-text class="pb-0">
                            <v-row no-gutters>
                                <v-col :cols="$vuetify.breakpoint.smAndDown ? '2' : '1'">
                                    <span class="font-weight-light subtitle-1" :class="{'subtitle-2': $vuetify.breakpoint.smAndDown}">Da: </span>
                                </v-col>
                                <v-col :cols="$vuetify.breakpoint.smAndDown ? '10' : '11'">
                                    <span class="black--text subtitle-1" :class="{'subtitle-2': $vuetify.breakpoint.smAndDown}" :style="{wordBreak: 'break-all'}">{{ email_sender }}</span>
                                </v-col>
                            </v-row>
                            <v-row no-gutters>
                                <v-col :cols="$vuetify.breakpoint.smAndDown ? '2' : '1'">
                                    <span class="font-weight-light subtitle-1" :class="{'subtitle-2': $vuetify.breakpoint.smAndDown}">A: </span>
                                </v-col>
                                <v-col :cols="$vuetify.breakpoint.smAndDown ? '10' : '11'">
                                    <span class="black--text subtitle-1" :class="{'subtitle-2': $vuetify.breakpoint.smAndDown}" :style="{wordBreak: 'break-all'}">{{ email_recipient }}</span>
                                </v-col>
                            </v-row>
                            <v-textarea class="mt-3 mb-0" outlined v-model="email_text" label="Inserisci il testo dell'email" rows="5" full-width auto-grow :error-messages="email_text_errors" @input="$v.email_text.$touch()" @blur="$v.email_text.$touch()"></v-textarea>
                        </v-card-text>
                        <v-card-actions class="d-flex justify-space-around">
                            <v-btn dark @click="submit" width="45%" color="green" class="mb-2 mx-2">Conferma</v-btn>
                            <v-btn dark @click="close" width="45%" color="red lighten-1" class="mb-2 mx-2">Annulla</v-btn>
                        </v-card-actions>
                    </v-card>
                </v-col>
            </v-row>
        </v-container>
    </v-overlay>
</template>

<script>
    import { validationMixin } from "vuelidate";
    import { required } from "vuelidate/lib/validators";
    import AlertComponent from "@/components/AlertComponent";

    export default {
        mixins: [ validationMixin ],
        components: { AlertComponent },
        props: {
            confirm: { required: true },
            alert: { required: true },
            alert_text: { required: true },
            alert_type: { required: true },
            dialog: { required: true },
            email_recipient: { required: true },
            email_sender: { required: true }
        },
        validations: {
            email_text: { required }
        },
        data: () => ({
            email_text: ""
        }),
        computed: {
            email_text_errors() {
                var errors = [];
                if (!this.$v.email_text.$dirty) {
                    return errors;
                }
                !this.$v.email_text.required && errors.push("Il testo dell'email è obbligatorio.");
                return errors;
            }
        },
        methods: {
            submit() {
                this.$v.$touch();
                if (!this.$v.$invalid) {
                    this.$emit("submit", this.email_text);
                    this.$v.$reset();
                }
            },
            close() {
                this.$v.$reset();
                this.$emit("update:confirm", false);
                this.$emit("update:alert", false);
                this.$emit("update:dialog", false);
                this.email_text = "";
            }
        },
        watch: {
            "dialog": function() {
                this.$v.$reset();
                this.email_text = "";
            }
        }     
    }
</script>