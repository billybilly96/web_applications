<template>
    <v-container :class="loading ? 'd-flex align-center' : ''">
        <LoadingComponent v-if="loading" />
        <template v-else>
            <AlertComponent v-if="alert" :type="alert_type" :text="alert_text" />
            <ChangeAttributeComponent :popup_type.sync="change_popup_type" :logged_user.sync="logged_user" />
            <ConfirmationComponent
                :confirm.sync="delete_confirm"
                :alert.sync="delete_alert"
                :alert_text="delete_alert_text"
                :alert_type="delete_alert_type"
                :dialog.sync="delete_dialog"
                dialog_text="Sei sicuro di voler eliminare il documento?"
                dialog_title="Elimina Documento"
                v-on:submit="handle_delete_click"
            />
            <v-row>
                <v-col>
                    <v-card>
                        <router-link class="black--text link" :to="'/student-detail/' + logged_user.username">
                            <v-card-title class="display-1 font-weight-bold justify-center">Ciao {{ logged_user.username }}!</v-card-title> 
                        </router-link>  
                        <v-divider></v-divider>
                        <v-card-text class="px-2">
                            <v-row class="mx-2">
                                <span :class="{'pl-6': $vuetify.breakpoint.mdAndUp}" class="subtitle-2 black--text">Nome:</span>
                                <v-spacer></v-spacer>
                                <span class="pr-6">{{ logged_user.name }}</span>                           
                            </v-row>
                            <v-row class="mx-2">
                                <span :class="{'pl-6': $vuetify.breakpoint.mdAndUp}" class="subtitle-2 black--text">Cognome:</span>
                                <v-spacer></v-spacer>
                                <span class="pr-6">{{ logged_user.surname }}</span>                           
                            </v-row>
                            <v-row class="d-flex justify-space-between" v-if="logged_user.degree_course != null" >
                                <v-col cols="6">
                                    <span :class="{'pl-6': $vuetify.breakpoint.mdAndUp}" class="subtitle-2 black--text ml-2">Corso di laurea:</span>
                                </v-col>
                                <v-col cols="6" class="d-flex justify-end">
                                    <span class="text-right">{{ logged_user.degree_course }}</span>  
                                    <v-tooltip top color="brown lighten-1" :disabled="$vuetify.breakpoint.smAndDown">
                                        <template v-slot:activator="{ on }">
                                        <v-icon class="mr-2" @click="change_popup_type = 'degree_course'" v-on="on">mdi-pencil</v-icon>
                                        </template>
                                        <span>Modifica il tuo Corso di laurea</span>
                                    </v-tooltip>   
                                </v-col>                                                                         
                            </v-row>
                            <v-row class="d-flex justify-space-between" v-if="logged_user.email != null">
                                <v-col cols="6">
                                    <span :class="{'pl-6': $vuetify.breakpoint.mdAndUp}" class="subtitle-2 black--text ml-2">Email:</span>
                                </v-col>
                                <v-col cols="6" class="d-flex justify-end">
                                    <span class="text-right" :style="{wordBreak: 'break-all'}">{{ logged_user.email }}</span>
                                    <v-tooltip top color="brown lighten-1" :disabled="$vuetify.breakpoint.smAndDown">
                                        <template v-slot:activator="{ on }">
                                        <v-icon class="mr-2" @click="change_popup_type = 'email'" v-on="on">mdi-pencil</v-icon>
                                        </template>
                                        <span>Modifica la tua Email</span>
                                    </v-tooltip>   
                                </v-col>                                                                         
                            </v-row>
                            <v-row class="mx-2">
                                <span :class="{'pl-6': $vuetify.breakpoint.mdAndUp}" class="subtitle-2 black--text">Username:</span>
                                <v-spacer></v-spacer>
                                <span>{{ logged_user.username }}</span>  
                                <v-tooltip top color="brown lighten-1" :disabled="$vuetify.breakpoint.smAndDown">
                                    <template v-slot:activator="{ on }">
                                        <v-icon @click="change_popup_type = 'username'" v-on="on">mdi-pencil</v-icon>          
                                    </template>
                                    <span>Modifica il tuo Username</span>
                                </v-tooltip>                                                   
                            </v-row>
                        </v-card-text>
                        <v-divider></v-divider>
                        <v-card-text class="text-center">
                            <span @click="change_popup_type = 'password'">
                                <v-btn text small color="primary">Modifica la tua password</v-btn>
                            </span>
                        </v-card-text>                                 
                    </v-card>
                </v-col>
            </v-row>
            <v-row>
                <LoadDocumentComponent v-on:loaded="get_user_documents" :alert.sync="alert" :alert_type.sync="alert_type" :alert_text.sync="alert_text" kind="book" />
                <LoadDocumentComponent v-on:loaded="get_user_documents" :alert.sync="alert" :alert_type.sync="alert_type" :alert_text.sync="alert_text" kind="note" />
            </v-row>     
            <TabsComponent :current_section.sync="current_section" :sections="sections" />
            <template v-if="current_section == 'Libri' && ordered_books.length > 0">
                <HeaderComponent :headers="book_headers" />
                <v-data-iterator :items="ordered_books" :items-per-page.sync="ordered_books.length" hide-default-footer>
                    <template v-slot:default="props">
                        <v-row no-gutters>
                            <v-col v-for="(item,i) in props.items" :key="i" cols="12">
                                <v-card class="pa-1 ma-1">                           
                                    <v-card-text>
                                        <v-row>
                                            <v-col cols="12" md="3" :class="class_col">
                                                <span :class="dialog_header_mobile">Titolo:</span>   
                                                <v-spacer :class="class_spacer"></v-spacer> 
                                                <router-link :to="'/document-detail/' + item._id" :class="kind_dialog_content" class="link">{{ item.title }}</router-link>     
                                            </v-col>
                                            <v-col cols="12" md="3" :class="class_col">
                                                <span :class="dialog_header_mobile">Corso di studi:</span>   
                                                <v-spacer :class="class_spacer"></v-spacer>                        
                                                <span :class="kind_dialog_content">{{ item.degree_course }}</span>                                       
                                            </v-col>
                                            <v-col cols="12" md="3" :class="class_col">
                                                <span :class="dialog_header_mobile">Materia:</span>
                                                <v-spacer :class="class_spacer"></v-spacer>
                                                <span :class="kind_dialog_content">{{ item.subject }}</span>                                            
                                            </v-col>                                         
                                            <v-col cols="12" md="2" :class="class_col">
                                                <span :class="dialog_header_mobile">Stato:</span>
                                                <v-spacer :class="class_spacer"></v-spacer>
                                                <span :class="kind_dialog_content">{{ item.availability }}</span>                                          
                                            </v-col>
                                            <v-col v-if="item.availability_color == 'green'" md="1" class="d-none d-md-flex">
                                                <span class="body-1 text-center">
                                                    <v-tooltip :disabled="$vuetify.breakpoint.smAndDown" top color="brown lighten-1">
                                                        <template v-slot:activator="{ on }">
                                                            <v-btn @click="show_delete_document_component(item._id)" text icon v-on="on">
                                                                <v-icon>delete</v-icon>                   
                                                            </v-btn>
                                                        </template>
                                                        <span>Elimina Libro</span>
                                                    </v-tooltip>
                                                </span>
                                            </v-col> 
                                            <v-col v-if="item.availability_color == 'green'" class="body-1 d-flex d-md-none align-center justify-center">
                                                <v-btn large outlined @click="show_delete_document_component(item._id)"> 
                                                    <v-icon>delete</v-icon>
                                                    <span>Elimina Libro</span>
                                                </v-btn>
                                            </v-col>           
                                        </v-row>
                                    </v-card-text>
                                </v-card>
                            </v-col>
                        </v-row>
                    </template>
                </v-data-iterator>
            </template>
            <template v-if="current_section == 'Appunti' && ordered_notes.length > 0">          
                <HeaderComponent :headers="note_headers" />
                <v-data-iterator :items="ordered_notes" :items-per-page.sync="ordered_notes.length" hide-default-footer>
                    <template v-slot:default="props">
                        <v-row no-gutters>
                            <v-col v-for="(item,i) in props.items" :key="i" cols="12">
                                <v-card class="pa-1 ma-1">                           
                                    <v-card-text class="d-md-flex">
                                        <v-row>
                                            <v-col cols="12" md="3" :class="class_col">
                                                <span :class="dialog_header_mobile">Materia:</span>
                                                <v-spacer :class="class_spacer"></v-spacer>
                                                <router-link :to="'/document-detail/' + item._id" :class="kind_dialog_content" class="link">{{ item.subject }}</router-link>
                                            </v-col>
                                            <v-col cols="12" md="3" :class="class_col">
                                                <span :class="dialog_header_mobile">Corso di studi:</span>   
                                                <v-spacer :class="class_spacer"></v-spacer>                        
                                                <span :class="kind_dialog_content">{{ item.degree_course }}</span>
                                            </v-col>     
                                            <v-col cols="12" md="3" :class="class_col">
                                                <span :class="dialog_header_mobile">Anno accademico:</span>   
                                                <v-spacer :class="class_spacer"></v-spacer>                        
                                                <span :class="kind_dialog_content">{{ item.academic_year }}</span>        
                                            </v-col>                                    
                                            <v-col cols="12" md="2" class="d-flex align-center justify-center">
                                                <span :class="dialog_header_mobile">Stato:</span>
                                                <v-spacer :class="class_spacer"></v-spacer>
                                                <span :class="kind_dialog_content">{{ item.availability }}</span>                                                                               
                                            </v-col> 
                                            <v-col md="1" class="d-none d-md-flex">
                                                <span class="body-1 text-center">
                                                    <v-tooltip :disabled="$vuetify.breakpoint.smAndDown" top color="brown lighten-1">
                                                        <template v-slot:activator="{ on }">
                                                            <v-btn @click="show_delete_document_component(item._id)" text icon v-on="on">
                                                                <v-icon>delete</v-icon>                   
                                                            </v-btn>
                                                        </template>
                                                        <span>Elimina Appunti</span>
                                                    </v-tooltip>                                     
                                                </span>
                                            </v-col> 
                                            <v-col class="body-1 d-flex d-md-none align-center justify-center">
                                                <v-btn outlined large @click="show_delete_document_component(item._id)">
                                                    <v-icon>delete</v-icon>
                                                    <span>Elimina Appunti</span>
                                                </v-btn>
                                            </v-col>           
                                        </v-row>
                                    </v-card-text>
                                </v-card>
                            </v-col>
                        </v-row>
                    </template>
                </v-data-iterator>        
            </template>  
            <v-card class="pa-1 ma-1" v-if="current_section == 'Libri' && ordered_books.length == 0">
                <v-card-text class="title text-center black--text font-weight-light pa-2">Non hai libri caricati sulla piattaforma</v-card-text>
            </v-card>
            <v-card class="pa-1 ma-1" v-if="current_section == 'Appunti' && ordered_notes.length == 0">
                <v-card-text class="title text-center black--text font-weight-light pa-2">Non hai appunti caricati sulla piattaforma</v-card-text>
            </v-card>
        </template>
    </v-container>
</template>

<script>
    import styleMixin from "@/mixins/styleMixin";
    import AlertComponent from "@/components/AlertComponent";
    import ChangeAttributeComponent from "@/components/ChangeAttributeComponent";
    import ConfirmationComponent from "@/components/ConfirmationComponent";
    import HeaderComponent from "@/components/HeaderComponent";
    import LoadDocumentComponent from "@/components/LoadDocumentComponent";
    import TabsComponent from "@/components/TabsComponent";
    import LoadingComponent from "@/components/LoadingComponent";

    export default {
        components: { AlertComponent, ChangeAttributeComponent, ConfirmationComponent, HeaderComponent, LoadDocumentComponent, TabsComponent, LoadingComponent },
        mixins: [ styleMixin ],
        data: () => ({
            logged_user: {},
            documents: [],
            alert: false,
            alert_type: null,
            alert_text: null,
            change_popup_type: null,
            delete_confirm: false,
            delete_alert: false,
            delete_dialog: false,
            delete_alert_text: null,
            delete_alert_type: null,
            delete_document_id: null,   
            current_section: "Libri",
            sections: [ "Libri", "Appunti" ],
            book_headers: [
                { text: "Titolo", value: "title", col: "3" },
                { text: "Corso di Laurea", value: "degree_course", col: "3" },
                { text: "Materia", value: "subject", col: "3" },
                { text: "Stato", value: "availability", col: "2" },
                { text: "", col: "1"}
            ],
            note_headers: [
                { text: "Materia", value: "subject", col: "3" },
                { text: "Corso di Laurea", value: "degree_course", col: "3" },
                { text: "Anno Accademico", value: "academic_year", col: "3" },               
                { text: "Stato", value: "availability", col: "2" },
                { text: "", col: "1"}
            ],
            loading: true
        }),
        computed: {
            ordered_books() {
                return this.documents.filter(doc => doc.kind == 'Book').sort((a, b) => a.title.localeCompare(b.title));
            },
            ordered_notes() {
                return this.documents.filter(doc => doc.kind == 'Note').sort((a, b) => a.subject.localeCompare(b.subject));
            }
        },
        methods: {
            async get_logged_user() {
                try {
                    var response = await this.axios.get(this.serverHost + "/student/login");
                    this.logged_user = response.data;
                } catch (err) {
                    this.logged_user = {};
                }
            },
            async get_user_documents() {
                try {
                    var response = await this.axios.get(this.serverHost + "/document/owned");
                    this.documents = response.data;
                } catch (err) {
                    this.documents = [];
                }
            },
            async handle_delete_click() {
                try {
                    await this.axios.delete(this.serverHost + "/document?document_id=" + this.delete_document_id);
                    var index = this.documents.findIndex(doc => doc._id == this.delete_document_id);
                    this.documents.splice(index, 1);
                    this.delete_dialog = false;
                    this.delete_alert = true;
                    this.delete_alert_text = "Eliminazione effettuata con successo!";
                    this.delete_alert_type = "success";
                    await new Promise(res => setTimeout(res, 2000));
                    this.delete_alert = false;
                    this.delete_confirm = false;
                } catch (err) {
                    this.delete_dialog = false;
                    this.delete_alert = true;
                    this.delete_alert_text = err.response.data.description;
                    this.delete_alert_type = "error";
                    await new Promise(res => setTimeout(res, 3000));
                    this.delete_alert = false;
                    this.delete_confirm = false;
                }             
            },
            show_delete_document_component(doc_id) {
                this.delete_document_id = doc_id;
                this.delete_dialog = true;
                this.delete_confirm = true;
            }
        },
        async mounted() {
            await Promise.all([
                this.get_logged_user(), this.get_user_documents()
            ]);  
            this.loading = false;           
        }
    }
</script>