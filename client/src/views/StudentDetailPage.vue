<template>
    <v-container :class="loading ? 'd-flex align-center' : ''">
        <SendEmailComponent
            :confirm.sync="email_confirm"
            :alert.sync="email_alert"
            :alert_text.sync="email_alert_text"
            :alert_type.sync="email_alert_type"
            :dialog.sync="email_dialog"
            :email_recipient="student.email"
            :email_sender="logged_user.email"
            v-on:submit="handle_email_click"
        />
        <LoginComponent :overlay.sync="login_popup"/>
        <LoadingComponent v-if="loading" />
        <NoDataComponent v-else-if="Object.values(student).length == 0" text="Impossibile recuperare informazioni relative allo studente cercato" />
        <template v-else>
            <v-row>
                <v-col>
                    <v-card>
                        <v-card-title class="display-1 font-weight-bold justify-center">{{ student.username }}</v-card-title>
                        <v-card-text class="align-center">
                            <v-row class="d-flex align-center justify-center ma-2">
                                <span class="black--text justify-self-center">{{ student.name }} {{ student.surname }}</span>                       
                            </v-row>
                        </v-card-text>  
                        <v-divider></v-divider>
                        <v-card-text class="pb-0">
                            <v-row>
                                <v-col cols="12" class="d-flex align-center">
                                    <span :class="[kind_page_header, black]">Contatto</span>
                                    <v-spacer></v-spacer>
                                    <span :class="kind_page_content" :style="{wordBreak: 'break-all'}">{{ student.email }}</span>  
                                </v-col>
                                <v-col v-if="student.degree_course != null" cols="12" class="d-flex align-center">
                                    <span :class="[kind_page_header, black]">Corso di laurea</span>
                                    <v-spacer></v-spacer>
                                    <span :class="kind_page_content">{{ student.degree_course }}</span>  
                                </v-col> 
                                <v-col cols="12" class="d-flex align-center">
                                    <span :class="[kind_page_header, black]">Data di registrazione</span>
                                    <v-spacer></v-spacer>
                                    <span :class="kind_page_content">{{ moment(student.registration_date).format("DD/MM/YYYY") }}</span>  
                                </v-col>                       
                            </v-row>
                        </v-card-text> 
                        <v-card-actions v-if="logged_user.username != student.username" class="justify-center">               
                            <v-btn color="indigo" outlined @click="open_email_popup">
                                <v-icon color="indigo">mdi-email</v-icon>
                                <span class="ml-1">Contatta</span>
                            </v-btn>
                        </v-card-actions>
                        <v-divider class="mt-4"></v-divider>
                        <div v-if="student.feedbacks != null && student.feedbacks.length > 0">
                            <ShowCommentsComponent :comments="student.feedbacks" />
                        </div>         
                    </v-card>
                </v-col>
            </v-row>
        </template>
    </v-container>
</template>

<script>
    import ShowCommentsComponent from "@/components/ShowCommentsComponent";
    import SendEmailComponent from "@/components/SendEmailComponent";
    import LoadingComponent from "@/components/LoadingComponent";
    import LoginComponent from "@/components/LoginComponent";
    import NoDataComponent from "@/components/NoDataComponent";
    import notificationMixin from "@/mixins/notificationMixin";
    import styleMixin from "@/mixins/styleMixin";

    export default {
        components: { SendEmailComponent, ShowCommentsComponent, LoadingComponent, LoginComponent, NoDataComponent },
        mixins: [ notificationMixin, styleMixin ],
        data: () => ({
            student: {},
            loading: true,
            email_confirm: false,
            email_alert: false,
            email_alert_text: null,
            email_alert_type: null,
            email_dialog: false,
            login_popup: false
        }),
        methods: {
            async get_user_detail(user) {
                try { 
                    var response = await this.axios.get(this.serverHost + "/student?student_username=" + user);
                    return response.data;
                } catch (err) {
                    return {};
                } 
            },
            open_email_popup() {
                if (Object.values(this.logged_user).length == 0) {
                    this.login_popup = true;
                } else {
                    this.email_dialog = true;
                    this.email_confirm = true;
                }
            },
            async handle_email_click(mail_text) {
                try {
                    var response = await this.axios.post(this.serverHost + "/email", {
                        mail_recipient: this.student.email,
                        mail_text: mail_text
                    });
                    this.email_dialog = false;
                    this.email_alert = true;
                    this.email_alert_text = response.data.description;
                    this.email_alert_type = "success";
                    await new Promise(res => setTimeout(res, 2000));
                    this.email_alert = false;
                    this.email_confirm = false;
                } catch (err) {
                    this.email_alert = true;
                    this.email_alert_text = err.response.data.description;
                    this.email_alert_type = "error";
                }
            }
        },
        watch: {
            "$route.params.user": async function () {
                this.student = await this.get_user_detail(this.$route.params.user);
            }   
        },
        async mounted() {
            var result = await Promise.all([
                this.get_user_detail(this.$route.params.user), this.setup_ui_component()
            ]);
            this.student = result[0];
            this.loading = false;          
        }
    }
</script>