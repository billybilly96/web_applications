<template>
    <v-container fluid :class="loading ? 'd-flex align-center' : ''">
        <LoadingComponent v-if="loading" />
        <template v-else>
            <v-row>
                <v-col cols="12">
                    <v-card>
                        <v-card-title class="red--text d-flex justify-center">Nuove Notifiche</v-card-title>
                        <div v-for="(item,i) in new_notifications" :key="i">
                        <v-divider class="indigo lighten-4"></v-divider>
                            <v-card outlined tile :class="item.read ? 'white' : 'indigo lighten-5'">
                                <v-row no-gutters>
                                    <v-col cols="1" class="d-flex align-center justify-center"> 
                                        <v-tooltip bottom :disabled="$vuetify.breakpoint.smAndDown">
                                            <template v-slot:activator="{ on }">
                                                <v-icon @click="read_notification(item._id)" v-on="on">mdi-checkbox-marked-circle</v-icon>
                                            </template>
                                            <span>Segna come letta</span>
                                        </v-tooltip>   
                                    </v-col>
                                    <v-col cols="11" @click="read_notification_and_jump(item._id, item.link)">
                                        <v-card-title class="body-2 font-weight-bold">{{ moment(item.insertion_date).format("DD/MM/YYYY - HH:mm") }}</v-card-title>
                                        <v-card-text class="body-2">{{ item.text }}</v-card-text>
                                    </v-col>
                                </v-row>
                            </v-card>
                            <v-divider class="indigo lighten-4"></v-divider>
                        </div>
                    </v-card>
                    <v-card v-if="new_notifications.length == 0" class="pa-1 ma-1">
                        <v-card-text class="title text-center black--text font-weight-light pa-2">Non sono presenti nuove notifiche</v-card-text>
                    </v-card>
                </v-col>    
            </v-row>
            <v-row>
                <v-col cols="12">
                    <v-card>
                        <v-card-title class="indigo--text d-flex justify-center">Notifiche Lette</v-card-title>
                        <div v-for="(item,i) in old_notifications" :key="i">
                            <v-card outlined tile @click="read_notification_and_jump(item._id, item.link)">
                                <v-card-title class="body-2 font-weight-bold">{{ moment(item.insertion_date).format("DD/MM/YYYY - HH:mm") }}</v-card-title>
                                <v-card-text class="body-2">{{ item.text }}</v-card-text>
                            </v-card>
                        </div>
                    </v-card>
                    <v-card v-if="old_notifications.length == 0" class="pa-1 ma-1">
                        <v-card-text class="title text-center black--text font-weight-light pa-2">Non sono presenti notifiche lette</v-card-text>
                    </v-card>
                </v-col>
            </v-row>
        </template>
    </v-container>
</template>

<script>
    import LoadingComponent from "@/components/LoadingComponent";
    import notificationMixin from "@/mixins/notificationMixin";

    export default {
        components: { LoadingComponent },
        mixins: [ notificationMixin ],
        data: () => ({
            loading: true
        }),
        computed: {
            new_notifications() {
                return this.notifications.filter(not => !not.read).sort((a,b) => new Date(b.insertion_date) - new Date(a.insertion_date));
            },
            old_notifications() {
                return this.notifications.filter(not => not.read).sort((a,b) => new Date(b.insertion_date) - new Date(a.insertion_date));
            }
        },
        async mounted() {
            await this.setup_ui_component();
            this.loading = false;
        }
    }
</script>