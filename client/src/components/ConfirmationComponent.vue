<template>
    <v-overlay :absolute="false" :value="confirm">
        <AlertComponent v-if="alert" :type="alert_type" :text="alert_text" />
        <v-container v-if="dialog">
            <v-row>
                <v-col cols="12">
                    <v-card light class="elevation-20" max-width="35em">
                        <v-toolbar dark color="red darken-4 d-flex justify-center">
                            <v-toolbar-title>{{ dialog_title }}</v-toolbar-title>
                        </v-toolbar>
                        <v-card-text class="title text-center">{{ dialog_text }}</v-card-text>
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
    import AlertComponent from "@/components/AlertComponent";
 
    export default {
        components: { AlertComponent },
        props: {
            confirm: { required: true },
            alert: { required: true },
            alert_text: { required: true },
            alert_type: { required: true },
            dialog: { required: true },
            dialog_text: { required: true },
            dialog_title: { required: true }
        },
        methods: {
            submit() {
                this.$emit("submit");
            },
            close() {
                this.$emit("update:confirm", false);
                this.$emit("update:alert", false);
                this.$emit("update:dialog", false);
            }
        }
    }
</script>