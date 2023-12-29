<template>
    <v-container :class="loading ? 'd-flex align-center' : ''">
        <LoadingComponent v-if="loading" />
        <ObtainRewardComponent
            :logged_user.sync="logged_user"
            :confirm.sync="obtain_confirm"
            :alert.sync="obtain_alert"
            :alert_text="obtain_alert_text"
            :alert_type="obtain_alert_type"
            :dialog.sync="obtain_dialog"
            v-on:submit="handle_obtain_click"
        />
        <div hidden class="qrcode" ref="qrCodeUrl"></div>
        <v-card v-show="!loading">
            <v-card-title class="d-flex justify-center"> 
                <span class="display-1 font-weight-bold">Ciao {{ logged_user.username }}!</span>               
            </v-card-title>
            <div class="d-flex justify-center my-2">
                <svg id="fillgauge" width="120px" height="120px" viewBox="0 0 120 120"></svg>
            </div>
            <v-card-text class="text-center pb-0 mb-0">
                <span class="font-weight-bold title">{{ "Guadagna " + (100 - available_score) + " punti per accumulare un " + (available_liters > 0 ? "altro " : "") + "litro d'acqua" }}</span>
                <br/><span class="font-weight-bold subtitle-2"> (100 punti corrispondono ad un litro d'acqua)</span>
            </v-card-text>
            <v-card-text class="text-center pa-0 ma-0">
                <v-tooltip v-model="show_tooltip" top color="brown lighten-1" :max-width="$vuetify.breakpoint.smAndDown? '21em' : '30em'" class="d-flex justify-center">
                    <template v-slot:activator="{ on }">
                        <v-btn icon v-on="on">
                            <v-icon color="grey lighten-1">mdi-information-outline</v-icon>
                        </v-btn>
                    </template>
                    <span class="subtitle-2">
                        Per guadagnare punti è sufficiente cedere in prestito libri o appunti. Inoltre, sono previsti punti extra per gli utenti che inseriscono recensioni o feedback nella piattaforma.
                    </span>
                </v-tooltip>
            </v-card-text>
            <v-divider></v-divider>
            <v-card-text class="text-center title" v-if="available_liters == 0">
                {{ "Hai a disposizione " + logged_user.account_score + " punti, che non sono sufficienti per ottenere una ricompensa" }}
            </v-card-text>
            <v-card-text class="text-center title" v-else-if="available_liters == 1">
                {{ "Hai a disposizione " + logged_user.account_score + " punti, che ti consentono di ottenere un litro d'acqua" }}
            </v-card-text>
            <v-card-text class="text-center title" v-else>
                {{ "Hai a disposizione " + logged_user.account_score + " punti, che ti consentono di ottenere fino a " + available_liters + " litri d'acqua" }}
            </v-card-text>
            <v-container>
                <v-row v-if="available_liters < 5" class="pa-0 ma-0 hidden-md-and-up justify-center">     
                    <v-col cols="3" v-for="n in available_liters" :key="n" class="pa-0 ma-0">
                        <v-img src="@/assets/bottle.png"></v-img>
                    </v-col>
                </v-row>
                <v-row v-else class="pa-0 ma-0 hidden-md-and-up">     
                    <v-col cols="3" v-for="n in 3" :key="n" class="pa-0 ma-0">
                        <v-img src="@/assets/bottle.png"></v-img>
                    </v-col>
                    <v-col cols="3" class="pa-0 ma-0 hidden-md-and-up">
                        <p class="text-center font-weight-bold headline mt-3"> + {{ available_liters - 3 }} </p>
                    </v-col>
                </v-row>
                <v-row v-if="available_liters < 7" class="pa-0 ma-0 hidden-sm-and-down justify-center">
                    <v-col cols="2" v-for="n in available_liters" :key="n" class="pa-0 ma-0">
                        <v-img src="@/assets/bottle.png"></v-img>
                    </v-col>
                </v-row>
                <v-row v-else class="pa-0 ma-0 hidden-sm-and-down">
                    <v-col cols="2" v-for="n in 5" :key="n" class="pa-0 ma-0">
                        <v-img src="@/assets/bottle.png"></v-img>
                    </v-col>
                    <v-col cols="2" class="pa-0 ma-0 hidden-sm-and-down">
                        <p class="text-center font-weight-bold headline mt-12"> + {{ available_liters - 5 }} </p>
                    </v-col>
                </v-row>
            </v-container> 
            <v-card-actions class="justify-center">               
                <v-btn outlined color="indigo" :disabled="available_liters == 0" @click="open_obtain_popup">
                    <span>Ottieni Ricompensa</span>
                </v-btn>
            </v-card-actions>
            <v-card-text></v-card-text>
        </v-card>   
    </v-container>
</template>

<script>
    import JsPDF from 'jspdf';
    import QRCode from 'qrcodejs2';
    import ObtainRewardComponent from "@/components/ObtainRewardComponent";
    import LoadingComponent from "@/components/LoadingComponent";

    export default {
        components: { ObtainRewardComponent, LoadingComponent },
        data: () => ({
            obtain_confirm: false,
            obtain_alert: false,
            obtain_alert_text: null,
            obtain_alert_type: null,
            obtain_dialog: false,
            show_tooltip: false,
            logged_user: {},
            config: {},
            gauge: {},
            loading: true
        }),
        computed: {
            available_liters() {
                return Math.floor(this.logged_user.account_score / 100);
            },
            available_score() {
                return this.logged_user.account_score % 100;
            }
        },
        methods: {
            fill_water(percentage) {
                this.config = liquidFillGaugeDefaultSettings();
                this.config.circleThickness = 0.05;
                this.config.textColor = "#000000";
                this.config.waveTextColor = "#FFFFAA";
                this.config.textVertPosition = 0.8;
                this.config.waveAnimateTime = 1000;
                this.config.waveHeight = 0.06;
                this.config.waveAnimate = true;
                this.config.waveRise = true;
                this.config.waveHeightScaling = true;
                this.config.waveOffset = 0.25;
                this.config.textSize = 0.75;
                this.config.waveCount = 2;
                this.gauge = loadLiquidFillGauge("fillgauge", percentage, this.config);
            },
            generate_pdf(qrcode_info) {
                var doc = new JsPDF("", "pt", "a4");
                var current_url = window.location.href;
                var canvas_div = document.createElement("div");
                canvas_div.id = "canvas";
                this.$refs.qrCodeUrl.append(canvas_div);
                new QRCode("canvas", {
                    text: current_url.replace("personal-score", "qrcode/" + qrcode_info._id),
                    width: 400,
                    height: 400,
                    colorDark: "#000000",
                    colorLight: "#ffffff",
                    correctLevel: QRCode.CorrectLevel.H
                });
                var canvas = document.getElementById("canvas").querySelector("canvas")
                var dataURL = canvas.toDataURL();
                doc.text("QrCode ottenuto dall'utente " + qrcode_info.user, 100, 100);                
                doc.text("Generato il " + this.moment(qrcode_info.creation_date).format("DD/MM/YYYY") + " alle ore " + this.moment(qrcode_info.creation_date).format("HH:mm"), 100, 130);
                doc.text("Valido per caricare la smartcard con " + (qrcode_info.n_liters > 1 ?  qrcode_info.n_liters + " litri d'acqua" : "un litro d'acqua"), 100, 160);
                doc.addImage(dataURL, "JPEG", 100, 190);
                doc.save("QrCode" + qrcode_info.creation_date + ".pdf");
            },
            open_obtain_popup() {
                this.obtain_dialog = true;
                this.obtain_confirm = true;
            },
            async handle_obtain_click(request_liters) {
                try {
                    var response = await this.axios.put(this.serverHost + "/student/reward", { n_liters: request_liters });
                    this.logged_user.account_score -= (request_liters * 100);
                    this.obtain_dialog = false;
                    this.obtain_alert = true;
                    this.obtain_alert_type = "success";
                    this.obtain_alert_text = "Ricompensa ottenuta correttamente!";
                    this.generate_pdf(response.data);
                    await new Promise(res => setTimeout(res, 2000));
                    this.obtain_alert = false;
                    this.obtain_confirm = false;
                } catch (err) {
                    this.obtain_alert = true;
                    this.obtain_alert_type = "error";
                    this.obtain_alert_text = err.response.data.description;
                }
            },
            async get_logged_user() {
                try {
                    var response = await this.axios.get(this.serverHost + "/student/login");
                    return response.data;
                } catch (err) {
                    return {};
                }
            }
        },
        async mounted() {
            this.logged_user = await this.get_logged_user();
            this.loading = false;
            this.fill_water(this.available_score);
        }
    }
</script>

<style scoped>
    .liquidFillGaugeText { 
        font-family: Helvetica; 
        font-weight: bold; 
    }
</style>