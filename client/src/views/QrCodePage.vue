<template>
    <v-container :class="!loading ? 'd-flex align-center' : ''">
        <LoadingComponent v-if="!loading" />
        <template v-else>
            <ConfirmationComponent
                :confirm.sync="qrcode_confirm"
                :alert.sync="qrcode_alert"
                :alert_text="qrcode_alert_text"
                :alert_type="qrcode_alert_type"
                :dialog.sync="qrcode_dialog"
                dialog_text="Sei sicuro di voler usare il QrCode? Ricorda che puoi farlo soltanto una volta"
                dialog_title="Utilizza QrCode"
                v-on:submit="handle_qrcode_click($route.params.id)"
            />
            <v-row>
                <v-col>
                    <v-card v-if="Object.values(qrcode).length > 0">
                        <v-card-text class="text-center title" :class="{'subtitle-1': $vuetify.breakpoint.smAndDown}">
                            <div class="pb-2">QrCode ottenuto dall'utente <span class="font-weight-black">{{ qrcode.user + "." }}</span></div>
                            <div class="pb-2">Generato il <span class="font-weight-black">{{ moment(qrcode.creation_date).format("DD/MM/YYYY") }}</span> alle ore <span class="font-weight-black">{{ moment(qrcode.creation_date).format("HH:mm") + "." }}</span></div>
                            <div>Valido per ricaricare la smartcard con <span class="font-weight-black">{{ qrcode.n_liters }}</span>{{ qrcode.n_liters > 1 ? " litri d'acqua." : " litro d'acqua." }}</div>
                        </v-card-text>
                        <v-card-actions class="justify-center">               
                            <v-btn width="75%" outlined color="indigo">
                                <span class="title" :class="{'subtitle-1': $vuetify.breakpoint.smAndDown}" @click="open_qrcode_dialog">Utilizza QrCode</span>
                            </v-btn>
                        </v-card-actions>
                        <v-card-text></v-card-text>
                    </v-card>
                    <v-alert v-else border="bottom" prominent colored-border color="indigo" icon="mdi-alert" elevation="2">
                        Il QrCode inserito risulta non essere valido!
                    </v-alert>
                </v-col>
            </v-row>
        </template>
    </v-container>
</template>

<script>
    import ConfirmationComponent from "@/components/ConfirmationComponent";
    import LoadingComponent from "@/components/LoadingComponent";

    export default {
        components: { ConfirmationComponent, LoadingComponent },
        data: () => ({
            qrcode: {},
            qrcode_confirm: false,
            qrcode_alert: false,
            qrcode_alert_text: null,
            qrcode_alert_type: null,
            qrcode_dialog: false,
            loading: false
        }),
        methods: {
            async get_qrcode_info(id) {
                try {
                    var response = await this.axios.get(this.serverHost + "/qrcode?qrcode_id=" + id);
                    return response.data;
                } catch (err) {
                    return {};
                }
            },
            async handle_qrcode_click(id) {
                try {
                    await this.axios.delete(this.serverHost + "/qrcode?qrcode_id=" + id);
                    this.qrcode_dialog = false;
                    this.qrcode_alert = true;
                    this.qrcode_alert_type = "success";
                    this.qrcode_alert_text = "QrCode utilizzato correttamente!";
                    await new Promise(res => setTimeout(res, 2000));
                    this.qrcode_alert = false;
                    this.qrcode_confirm = false;
                    this.$router.push("/").catch(() => {});
                } catch (err) {
                    this.qrcode_alert = true;
                    this.qrcode_alert_type = "error";
                    this.qrcode_alert_text = err.response.data.description;
                }
            },
            open_qrcode_dialog() {
                this.qrcode_dialog = true;
                this.qrcode_confirm = true;
            }
        },
        async mounted() {
            this.qrcode = await this.get_qrcode_info(this.$route.params.id);
            this.loading = true;
        },
        watch: {
            "$route.params.id": async function () {
                this.qrcode = await this.get_qrcode_info(this.$route.params.id);
            }
        }
    }
</script>