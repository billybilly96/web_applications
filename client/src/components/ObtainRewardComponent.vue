<template>
    <v-overlay :absolute="false" :value="confirm">
        <AlertComponent v-if="alert" :type="alert_type" :text="alert_text" />
        <v-container v-if="dialog">
            <v-row>
                <v-col cols="12">
                    <v-card light class="elevation-20" max-width="35em">
                        <v-toolbar dark color="red darken-4 d-flex justify-center">
                            <v-toolbar-title>Ottieni Ricompensa</v-toolbar-title>
                        </v-toolbar>
                        <v-card-text :class="{'subtitle-1': $vuetify.breakpoint.smAndDown}" class="title text-center">
                            Dopo la conferma, sarà generato un QrCode che potrai utilizzare per ricaricare la tua smart card.
                        </v-card-text>
                        <v-autocomplete class="px-3 mx-3" :items="available_bottles" v-model="n_liters" label="Litri richiesti" required :error-messages="n_liters_errors" @input="$v.n_liters.$touch()" @blur="$v.n_liters.$touch()"></v-autocomplete>
                        <v-card-actions class="d-flex justify-space-between">
                            <v-btn dark @click="submit" width="45%" color="green">Conferma</v-btn>
                            <v-btn dark @click="close" width="45%" color="red lighten-1">Annulla</v-btn>
                        </v-card-actions>
                    </v-card>
                </v-col>
            </v-row>
        </v-container>
    </v-overlay>
</template>

<script>
    import { validationMixin } from "vuelidate";
    import { required, integer } from "vuelidate/lib/validators";
    import AlertComponent from "@/components/AlertComponent";
 
    export default {
        mixins: [ validationMixin ],
        components: { AlertComponent },
        props: {
            logged_user: { required: true },
            confirm: { required: true },
            alert: { required: true },
            alert_text: { required: true },
            alert_type: { required: true },
            dialog: { required: true }
        },
        validations: {
            n_liters: { required, integer }
        },
        data: () => ({
            n_liters: null
        }),
        computed: {
            available_bottles() {
                var n_bottles = Math.floor(this.logged_user.account_score / 100);
                return (n_bottles == null) ? [] : [...Array(n_bottles).keys()].map(i => i + 1);
            },
            n_liters_errors() {
                var errors = [];
                if (!this.$v.n_liters.$dirty) {
                    return errors;
                }
                !this.$v.n_liters.required && errors.push("Il numero di litri richiesti è obbligatorio.");
                !this.$v.n_liters.integer && errors.push("I litri richiesti devono essere espressi con un numero.");
                return errors;
            }
        },
        methods: {
            submit() {
                this.$v.$touch();
                if (!this.$v.$invalid) {
                    this.$emit("submit", this.n_liters);
                }
            },
            close() {
                this.$v.$reset();
                this.n_liters = null;
                this.$emit("update:confirm", false);
                this.$emit("update:alert", false);
                this.$emit("update:dialog", false);
            }
        },
        watch: {
            "dialog": function() {
                this.$v.$reset();
                this.n_liters = null;
            }
        }
    }
</script>