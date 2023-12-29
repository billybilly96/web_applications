<template>
    <v-container class="d-flex flex-column">
        <LoginComponent :overlay.sync="overlay" :next_route="next_route" />
        <v-spacer></v-spacer>
        <section>
            <v-row class="d-flex align-center justify-center text-center">
                <v-col cols="12">
                    <v-row class="justify-center align-center" no-gutters>
                        <v-col cols="12" sm="6">
                            <v-img class="pa-0 ma-0" src="@/assets/almanotes.png"></v-img>
                        </v-col>
                    </v-row>
                    <v-row class="justify-center align-center my-4" no-gutters>
                        <v-col cols="10" sm="4">
                            <span :class="$vuetify.breakpoint.smAndDown ? 'subtitle-2' : 'title'" class="font-italic font-weight-bold" :style="{textShadow: '1px 1px grey'}">
                                Libri e appunti a portata di click! Condividi, accumula punti e riempi la tua borraccia.                                
                            </span>  
                        </v-col>                           
                    </v-row>
                    <v-btn rounded dark color="red lighten-1" class="font-weight-bold" @click='$router.push("/general-rules")'>Scopri di più</v-btn>          
                </v-col>
            </v-row>            
        </section>
        <v-spacer></v-spacer>
        <v-spacer class="d-flex d-md-none"></v-spacer>     
        <section>
            <v-row no-gutters>
                <v-col v-for="(link,i) in links" :key="i" cols="6" sm="4">
                    <div @click="navigate(link)">
                        <v-row class="d-flex justify-center" no-gutters>
                            <v-col cols="12">
                                <v-hover v-slot:default="{ hover }">
                                    <v-card :class="$vuetify.breakpoint.smAndDown ? 'ma-1 pa-2' : 'ma-3 pa-0'" :style="{cursor: 'pointer'}" class="d-flex align-center justify-center text-center overline" hover :elevation="hover ? 24 : 0">                                       
                                        <v-row :no-gutters="$vuetify.breakpoint.smAndDown">
                                            <v-col :cols="$vuetify.breakpoint.smAndDown ? '4' : '12'" class="d-flex align-center justify-center">
                                                <v-btn class="ma-2" outlined :small="$vuetify.breakpoint.smAndDown" :large="$vuetify.breakpoint.mdAndUp" fab color="red lighten-2">
                                                    <v-icon>{{ link.icon }}</v-icon>
                                                </v-btn>
                                            </v-col>
                                            <v-col :cols="$vuetify.breakpoint.smAndDown ? '8' : '12'" class="d-flex align-center justify-center">
                                                <span class="font-weight-bold">{{ link.text }}</span>
                                            </v-col>
                                        </v-row>
                                    </v-card>
                                </v-hover>
                            </v-col>
                        </v-row>
                    </div>
                </v-col>
            </v-row>
        </section>
        <v-spacer></v-spacer>
    </v-container>
</template>

<script>
    import LoginComponent from "@/components/LoginComponent";
    import navigationMixin from "@/mixins/navigationMixin";

    export default {
        components: { LoginComponent },
        mixins: [ navigationMixin ],
        data: () => ({
            overlay: false,
            next_route: null
        }),
        methods: {
            async navigate(link) {
                try {
                    this.next_route = link.route;
                    if (link.auth && this.current_user == null) {
                        await this.axios.get(this.serverHost + "/student/login");
                        this.$router.push(this.next_route);
                    } else {
                        this.$router.push(this.next_route);
                    }
                } catch (err) {
                    this.overlay = true;
                }
            }
        }
    }
</script>