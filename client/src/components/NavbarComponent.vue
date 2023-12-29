<template>
    <nav>
        <notifications :duration="5000" :position="$vuetify.breakpoint.smAndDown ? 'top center' : 'bottom right'">
            <template slot="body" slot-scope="props">
                <div @click="read_notification_and_jump(props.item.data.id, props.item.data.link)" :style="{cursor: 'pointer'}" class="d-flex align-center justify-space-between push-notification">
                    <span>{{ props.item.text }}</span>
                    <v-btn icon dark @click="props.close">
                        <v-icon small color="black">mdi-close</v-icon>
                    </v-btn>
                </div>
            </template>
        </notifications>
        <LoginComponent :overlay.sync="overlay" :next_route="next_route" />
        <ConfirmationComponent
            :confirm.sync="logout_confirm"
            :alert.sync="logout_alert"
            alert_text="Logout effettuato con successo!"
            alert_type="success"
            :dialog.sync="logout_dialog"
            dialog_text="Sei sicuro di voler effettuare il logout?"
            dialog_title="Logout"
            v-on:submit="handle_logout_click"
        />
        <v-app-bar app class="red lighten-1" dark>
            <v-app-bar-nav-icon @click="toggle_drawer"></v-app-bar-nav-icon>
            <router-link class="link" to="/">
                <v-toolbar-title>
                    <v-img src="@/assets/almanotes.png" max-width="150"></v-img>
                </v-toolbar-title>
            </router-link>
            <v-spacer></v-spacer>
            <template v-if="Object.values(logged_user).length > 0">
                <v-menu allow-overflow offset-y max-height="400">
                    <template v-slot:activator="{ on }">
                        <v-badge color="indigo" class="mx-2" overlap>
                            <template v-slot:badge>
                                <span v-if="new_notifications > 0">{{ new_notifications }}</span>
                            </template>
                            <v-icon v-if="new_notifications > 0" large v-on="on">notifications</v-icon>  
                            <v-icon v-else large v-on="on">notifications_none</v-icon>           
                        </v-badge>
                    </template>
                    <v-row no-gutters>
                        <v-col cols="12">
                            <v-card dense>
                                <div v-for="(item,i) in sorted_notifications" :key="i">
                                    <v-card outlined tile :class="item.read ? 'white' : 'indigo lighten-5'">
                                        <v-row no-gutters>
                                            <v-col :cols="!item.read ? '11' : '12'" @click="read_notification_and_jump(item._id, item.link)">
                                                <v-card-title class="body-2 font-weight-bold">{{ moment(item.insertion_date).format("DD/MM/YYYY - HH:mm") }}</v-card-title>
                                                <v-card-text class="body-2">{{ item.text }}</v-card-text>
                                            </v-col>
                                            <v-col v-if="!item.read" cols="1" class="d-flex align-center justify-center"> 
                                                <v-tooltip bottom :disabled="$vuetify.breakpoint.smAndDown">
                                                    <template v-slot:activator="{ on }">
                                                        <v-icon @click="read_notification(item._id)" v-on="on">mdi-checkbox-marked-circle</v-icon>
                                                    </template>
                                                    <span>Segna come letta</span>
                                                </v-tooltip>   
                                            </v-col>
                                        </v-row>
                                    </v-card>
                                    <v-divider v-if="i < (sorted_notifications.length - 1)" :class="!item.read ? 'indigo lighten-4' : 'indigo lighten-5'"></v-divider>
                                </div>
                                <v-card-text v-if="notifications.length == 0">Nessuna notifica presente</v-card-text>
                                <v-card-actions v-if="notifications.length > 0" class="sticky-bottom d-flex justify-center">
                                    <v-btn text block color="indigo" class="font-weight-bold" :to="('/notification')">Mostra tutte</v-btn>
                                </v-card-actions>
                            </v-card>
                        </v-col>
                    </v-row>
                </v-menu>
            </template>
        </v-app-bar>
        <v-navigation-drawer app v-model="drawer" class="red lighten-1" :disable-resize-watcher="disable_resize_watcher">
            <v-list :class="{'pt-0': $vuetify.breakpoint.smAndDown, 'pt-2': $vuetify.breakpoint.mdAndUp}">
                <v-list-item @click='navigate({ route: "/", auth: false })'>
                    <v-list-item-icon>
                        <v-icon>home</v-icon>
                    </v-list-item-icon>
                    <v-list-item-content>
                        <v-list-item-title class="white--text">Home</v-list-item-title>
                    </v-list-item-content>
                </v-list-item>
                <v-divider></v-divider>
                <v-divider v-if="Object.values(logged_user).length == 0"></v-divider>
                <v-list-item v-if="Object.values(logged_user).length == 0" @click='navigate({ route: "/registration", auth: false })'>
                    <v-list-item-content>
                        <v-list-item-title class="white--text">
                            <span class="mr-1">Sei nuovo?</span>
                            <span class="font-weight-bold">Registrati</span>
                        </v-list-item-title>
                    </v-list-item-content>
                </v-list-item>
                <v-list-item v-if="Object.values(logged_user).length > 0">
                    <v-list-item-content>
                        <v-list-item-title class="white--text">
                            <span class="mr-1">Ciao,</span>
                            <span class="font-weight-bold">{{ logged_user.username }}</span>
                        </v-list-item-title>
                    </v-list-item-content>
                </v-list-item>
                <v-list-item @click="login_or_logout">
                    <v-btn width="70%" v-if="Object.values(logged_user).length > 0" rounded outlined class="white--text font-weight-bold">Logout</v-btn>
                    <v-btn width="70%" v-else rounded outlined class="white--text font-weight-bold">Login</v-btn>
                </v-list-item>
                <v-divider></v-divider>
                <v-list-item v-for="(link,i) in links" :key="i" @click="navigate(link)">
                    <v-list-item-content>
                        <v-list-item-title class="white--text">{{ link.text }}</v-list-item-title>
                    </v-list-item-content>
                </v-list-item>
                <v-divider></v-divider>                
                <v-list-item @click='navigate({ route: "/general-rules", auth: false })'>
                    <v-btn width="70%" outlined class="white--text font-weight-bold">Scopri di più</v-btn>
                </v-list-item>
            </v-list>
        </v-navigation-drawer>
    </nav>
</template>

<script>
    import EventBus from "../eventBus";
    import ConfirmationComponent from "@/components/ConfirmationComponent";
    import LoginComponent from "@/components/LoginComponent";
    import navigationMixin from "@/mixins/navigationMixin";
    import notificationMixin from "@/mixins/notificationMixin";

    export default {
        components: { ConfirmationComponent, LoginComponent },
        mixins: [ navigationMixin, notificationMixin ],
        data: () => ({
            disable_resize_watcher: true,
            drawer: false,
            overlay: false,
            next_route: null,
            logout_confirm: false,
            logout_alert: false,
            logout_dialog: false
        }),
        computed: {
            new_notifications() {
                return this.notifications.filter(n => !n.read).length;
            },
            sorted_notifications() {
                return this.notifications.slice().sort((a,b) => new Date(b.insertion_date) - new Date(a.insertion_date));
            }
        },
        methods: {
            async handle_logout_click() {
                try {
                    await this.axios.delete(this.serverHost + "/student/login");
                    this.logout_dialog = false;
                    this.logout_alert = true;
                    EventBus.$emit("Logout");
                    await new Promise(res => setTimeout(res, 2000));
                    this.logout_alert = false;
                    this.logout_confirm = false;
                    await this.$router.push("/").catch(() => {});
                } catch (err) {
                    this.logout_dialog = false;
                    this.logout_confirm = false;
                }
            },
            async toggle_drawer() {
                await this.initialize_notifications();
                this.drawer = !this.drawer;
            },
            async login_or_logout() {
                await this.initialize_notifications();
                this.next_route = null;
                if (Object.values(this.logged_user).length == 0) {
                    this.overlay = true;
                    this.drawer = false;
                } else {
                    this.logout_dialog = true;
                    this.logout_confirm = true;
                    this.drawer = false;
                }
            },
            async navigate(link) {
                await this.initialize_notifications();
                this.next_route = link.route;
                if (link.auth && Object.values(this.logged_user).length == 0) {
                    this.overlay = true;
                    this.drawer = false;
                } else {
                    try {
                        await this.$router.push(this.next_route);
                        this.drawer = false;
                    } catch (err) {
                        this.drawer = false;
                    }
                }
            }
        },
        async mounted() {
            await this.setup_ui_component();
        },
        watch: {
            "push_notification": function() {
                this.$notify({
                    text: this.push_notification.text,
                    data: {
                        id: this.push_notification._id,
                        link: this.push_notification.link
                    }
                });
            }
        }
    }
</script>

<style scoped>
    .sticky-bottom {
        position: sticky;
        bottom: 0px;
        z-index: 1;
        background: white;
        border-top: 2px solid #E8EAF6;
    }
    .v-card__text :hover {
        cursor: pointer;
    }
    .v-btn:before {
        background-color: transparent;
    }
    .push-notification {
        padding: 10px;
        margin: 0 5px 5px;
        font-size: 12px;
        color: black;
        background: white;  
        border-top: 1px solid #187FE7;
        border-right: 1px solid #187FE7;
        border-bottom: 1px solid #187FE7;
        border-left: 5px solid #187FE7;

    }
</style>