<template>
    <v-container fluid :class="loading ? 'd-flex align-center' : ''">
        <LoadingComponent v-if="loading" />
        <template v-else>
            <v-toolbar color="grey lighten-3">
                <v-row>
                    <v-col cols="6">
                        <v-text-field v-model="search" clearable hide-details prepend-inner-icon="search" :label="'Ricerca ' + (kind == 'note' ? 'Appunti' : 'Libri')" color="black"></v-text-field>
                    </v-col>
                    <v-col cols="6">    
                        <v-select v-model="sort" hide-details :items="kind == 'note' ? keys_notes : keys_books" prepend-inner-icon="search" label="Ordina per" dense></v-select>                        
                    </v-col>
                </v-row>
                <template v-slot:extension>
                    <v-row :class="{'mb-2': $vuetify.breakpoint.smAndDown, 'mb-3': $vuetify.breakpoint.mdAndUp}">
                        <v-col cols="12" class="text-center">
                            <AdvancedSearchComponent :kind="kind" :document_to_search.sync="document_to_search"/>
                        </v-col>
                    </v-row>
                </template>
            </v-toolbar>
            <v-card flat tile color="grey lighten-3">
                <v-row class="justify-center">
                    <v-chip class="ma-1" v-if="document_to_search.degree_course != null && document_to_search.degree_course != ''">{{ document_to_search.degree_course }}</v-chip>
                    <v-chip :class="chip_style" v-if="document_to_search.study_year != null">{{ document_to_search.study_year }}</v-chip>
                    <v-chip :class="chip_style" v-if="document_to_search.academic_year != null && document_to_search.academic_year != ''">{{ document_to_search.academic_year }}</v-chip>
                    <v-chip :class="chip_style" v-if="document_to_search.subject != null && document_to_search.subject != ''">{{ document_to_search.subject }}</v-chip>
                    <v-chip :class="chip_style" v-if="document_to_search.title != null && document_to_search.title != ''">{{ document_to_search.title }}</v-chip>
                    <v-chip :class="chip_style" v-if="document_to_search.author != null && document_to_search.author != ''">{{ document_to_search.author }}</v-chip>
                    <v-chip :class="chip_style" v-if="document_to_search.edition != null">{{ document_to_search.edition }}</v-chip>
                    <v-chip :class="chip_style" v-if="document_to_search.owner_username != null && document_to_search.owner_username != ''">{{ document_to_search.owner_username }}</v-chip>
                    <v-chip :class="chip_style" v-if="document_to_search.availability != null && document_to_search.availability != ''">{{ document_to_search.availability }}</v-chip>
                </v-row>
            </v-card>
            <HeaderComponent :headers="kind == 'note' ? header_notes : header_books"/>
            <NoDataComponent v-if="documents.length == 0" :text="'Al momento non sono presenti ' + (this.kind == 'note' ? 'appunti' : 'libri') + ' sulla piattaforma'" />
            <NoDataComponent v-if="documents.length != 0 && shown_documents.length == 0" :text="'Non sono presenti ' + (this.kind == 'note' ? 'appunti' : 'libri') + ' che corrispondono alla tua ricerca'" />        
            <v-data-iterator no-data-text="" :items="shown_documents" :items-per-page.sync="shown_documents.length" :search="search" hide-default-footer>
                <template slot="no-results">
                    <NoDataComponent :text="'Non sono presenti ' + (this.kind == 'note' ? 'appunti' : 'libri') + ' che corrispondono alla tua ricerca'" />
                </template>
                <template v-slot:default="props">
                    <v-row no-gutters dense>
                        <v-col v-for="(item,i) in props.items" :key="i" cols="12" class="py-1">
                            <v-card :to="'/document-detail/' + item._id">
                                <v-card-title class="justify-center align-center text-center indigo--text py-4"><h5>{{ kind == "note" ? "Appunti di " + item.subject : item.title }}</h5></v-card-title>
                                <v-divider></v-divider>
                                <v-card-text class="d-md-flex">
                                    <v-row>
                                        <v-col v-if="kind == 'book'" cols="12" :md="header_books[0].col" :class="class_col">
                                            <span :class="[page_header_mobile, black]">{{ header_books[0].text }}</span>   
                                            <v-spacer :class="class_spacer"></v-spacer>   
                                            <span :class="kind_mix_content">{{ item.author }}</span>                  
                                        </v-col>
                                        <v-col cols="12" :md="kind == 'note' ? header_notes[0].col : header_books[1].col" :class="class_col">
                                            <span :class="[page_header_mobile, black]">{{ kind == 'note' ? header_notes[0].text : header_books[1].text }}</span>
                                            <v-spacer :class="class_spacer"></v-spacer>
                                            <span :class="kind_mix_content">{{ item.degree_course }}</span>
                                        </v-col>
                                        <v-col v-if="kind == 'book'" cols="12" :md="header_books[2].col" :class="class_col">
                                            <span :class="[page_header_mobile, black]">{{ header_books[2].text }}</span>
                                            <v-spacer :class="class_spacer"></v-spacer>
                                            <span :class="kind_mix_content">{{ item.subject }}</span>                                              
                                        </v-col> 
                                        <v-col v-if="kind == 'note'" cols="12" :md="header_notes[1].col" :class="class_col">
                                            <span :class="[page_header_mobile, black]">{{ header_notes[1].text }}</span>
                                            <v-spacer :class="class_spacer"></v-spacer>
                                            <span :class="kind_mix_content">{{ item.academic_year }}</span>                                  
                                        </v-col>
                                        <v-col cols="12" :md="kind == 'note' ? header_notes[2].col : header_books[3].col" :class="class_col">
                                            <span :class="[page_header_mobile, black]">{{ kind == 'note' ? header_notes[2].text : header_books[3].text }}</span>
                                            <v-spacer :class="class_spacer"></v-spacer>
                                            <span :class="kind_mix_content" :style="{color: check_color(item)}">{{ item.availability }}</span>                                          
                                        </v-col> 
                                        <v-col cols="12" :md="kind == 'note' ? header_notes[3].col : header_books[4].col" :class="class_col">
                                            <span :class="[page_header_mobile, black]">{{ kind == 'note' ? header_notes[3].text : header_books[4].text }}</span>
                                            <v-spacer :class="class_spacer"></v-spacer>
                                            <v-rating :class="kind_mix_content" :value="item.medium_review" readonly half-increments dense size="18" empty-icon="$vuetify.icons.ratingFull" background-color="grey darken-1" color="amber darken-1"></v-rating>
                                            <span v-if="item.number_review > 0" class="ml-1">{{ item.medium_review }} ({{ item.number_review }})</span>
                                        </v-col>
                                        <v-col cols="12" :md="kind == 'note' ? header_notes[4].col : header_books[5].col" :class="class_col">
                                            <span :class="[page_header_mobile, black]">{{ kind == 'note' ? header_notes[4].text : header_books[5].text }}</span>
                                            <v-spacer :class="class_spacer"></v-spacer>
                                            <router-link class="link" :to="'/student-detail/' + item.owner_username">
                                                <span :class="kind_mix_content">{{ item.owner_username }}</span>                     
                                            </router-link>                    
                                        </v-col>
                                    </v-row>
                                </v-card-text>
                            </v-card>
                        </v-col>
                    </v-row>
                </template>
            </v-data-iterator>
        </template>
    </v-container>
</template>

<script>
    import styleMixin from "@/mixins/styleMixin";
    import AdvancedSearchComponent from "@/components/AdvancedSearchComponent";
    import HeaderComponent from "@/components/HeaderComponent";
    import NoDataComponent from "@/components/NoDataComponent";
    import LoadingComponent from "@/components/LoadingComponent";

    export default {
        components: { AdvancedSearchComponent, HeaderComponent, NoDataComponent, LoadingComponent },
        mixins: [ styleMixin ],
        data: () => ({
            kind: null,
            documents: [],
            document_to_search: {},
            loading: true,
            search: "",
            sort: "",
            header_books: [
                { text: "Autore", value: "author", col: "2" },
                { text: "Corso di Laurea", value: "degree_course", col: "2" },
                { text: "Materia", value: "subject", col: "2" },
                { text: "Stato", value: "availability", col: "2" },
                { text: "Valutazione Media", value: "medium_review", col: "2" },
                { text: "Proprietario", value: "owner_username", col: "2" }
            ],
            header_notes: [
                { text: "Corso di Laurea", value: "degree_course", col: "3" },
                { text: "Anno Accademico", value: "academic_year", col: "2" },
                { text: "Stato", value: "availability", col: "3" },
                { text: "Valutazione Media", value: "medium_review", col: "2" },
                { text: "Proprietario", value: "owner_username", col: "2" }
            ],
            chip_style: "mb-1 mt-1 mr-1"
        }),
        computed: {
            keys_books() {
                var keys = JSON.parse(JSON.stringify(this.header_books));
                keys.unshift({ text: "Titolo", value: "title" });
                if (this.$vuetify.breakpoint.smAndDown) {
                    keys.map(k => k.text = k.text.replace(/ .*/,''));
                }
                return keys;
            },
            keys_notes() {
                var keys = JSON.parse(JSON.stringify(this.header_notes));
                keys.unshift({ text: "Materia", value: "subject" });
                if (this.$vuetify.breakpoint.smAndDown) {
                    keys.map(k => k.text = k.text.replace(/ .*/,''));
                }
                return keys;
            },
            shown_documents() {
                var dts = this.document_to_search;
                var returned_documents = [];
                if (this.kind == "note") {
                    returned_documents = this.documents.filter(doc => {
                        return (dts.degree_course == null || dts.degree_course == "" || doc.degree_course == dts.degree_course)
                            && (dts.academic_year == null || dts.academic_year == "" || doc.academic_year == dts.academic_year)                            
                            && (dts.subject == null || dts.subject == "" || doc.subject == dts.subject)
                            && (dts.owner_username == null || dts.owner_username == "" || doc.owner_username == dts.owner_username)
                            && (dts.availability == null || dts.availability == "" || this.check_availability(doc.availability, dts.availability));
                    });
                } else {
                    returned_documents = this.documents.filter(doc => {
                        return (dts.degree_course == null || dts.degree_course == "" || doc.degree_course == dts.degree_course)
                            && (dts.study_year == null || doc.study_year == dts.study_year)
                            && (dts.subject == null || dts.subject == "" || doc.subject == dts.subject)
                            && (dts.title == null || doc.title.toLowerCase().includes(dts.title.toLowerCase()))
                            && (dts.author == null || doc.author.toLowerCase().includes(dts.author.toLowerCase()))
                            && (dts.edition == null || doc.edition == dts.edition)
                            && (dts.owner_username == null || dts.owner_username == "" || doc.owner_username == dts.owner_username)
                            && (dts.availability == null || dts.availability == "" || this.check_availability(doc.availability, dts.availability));
                    });
                }
                return returned_documents.sort((a, b) => {
                    if (this.sort == "availability") {
                        var available_str = "Disponibile";
                        var available_str_period = "Disponibile dal ";
                        var available_str_verify = "Disponibilità da verificare";
                        if (a.availability == b.availability) {
                            return 0;
                        }
                        if (a.availability == available_str || (a.availability == available_str_verify && b.availability.includes(available_str_period))) {
                            return -1;
                        }
                        if (b.availability == available_str || (b.availability == available_str_verify && a.availability.includes(available_str_period))) {
                            return 1;
                        }
                        if (a.availability.includes(available_str_period) && b.availability.includes(available_str_period)) {
                            var date_info_a = a.availability.replace(available_str_period, "").split("/");
                            var date_info_b = b.availability.replace(available_str_period, "").split("/");
                            return parseInt(new Date(date_info_a[2] + "/" + date_info_a[1] + "/" + date_info_a[0]) - new Date(date_info_b[2] + "/" + date_info_b[1] + "/" + date_info_b[0]));
                        }
                        return 0;
                    }
                    if (this.sort == "medium_review") {
                        var medium_review_a = a.medium_review == null ? -1 : a.medium_review;
                        var medium_review_b = b.medium_review == null ? -1 : b.medium_review;
                        return medium_review_b - medium_review_a;
                    }
                    if (this.sort == "academic_year") {
                        var precedent_str = "Precedente al ";
                        var year_a = parseInt(a.academic_year.replace(precedent_str, "").split("/")[0]);
                        year_a = a.academic_year.includes(precedent_str) ? year_a - 0.5 : year_a;
                        var year_b = parseInt(b.academic_year.replace(precedent_str, "").split("/")[0]);
                        year_b = b.academic_year.includes(precedent_str) ? year_b - 0.5 : year_b;
                        return year_b - year_a;
                    }
                    return a[this.sort].localeCompare(b[this.sort]);
                });
            }
        },
        methods: {
            check_availability(current_availability, searched_availability) {
                var available_str = "Disponibile";
                var period_str_current = "Disponibile dal ";
                var period_str_searched_start = "Disponibile entro ";
                var period_str_searched_end = " giorni";
                var verify_str_current = "Disponibilità da verificare";
                var verify_str_searched = "Disponibile o da verificare";
                if (available_str == current_availability) {
                    return true;
                }
                if (current_availability.includes(period_str_current) && searched_availability.includes(period_str_searched_start) && searched_availability.includes(period_str_searched_end)) {
                    var current_date = new Date();
                    var date_info = current_availability.replace(period_str_current, "").split("/");
                    var availability_date = new Date(date_info[2] + "/" + date_info[1] + "/" + date_info[0]);
                    var searched_days = parseInt(searched_availability.replace(period_str_searched_start, "").replace(period_str_searched_end, ""));
                    return searched_days >= parseInt((availability_date - current_date) / (1000 * 60 * 60 * 24));
                }
                if (verify_str_current == current_availability && verify_str_searched == searched_availability) {
                    return true;
                }
                return false;
            },
            async get_documents(kind) {
                try {
                    var response = await this.axios.get(this.serverHost + "/" + kind);
                    return response.data;
                } catch(err) {
                    return [];
                }
            },
            check_color(document) {
                return document.availability_color == 'yellow' ? 'orange' : document.availability_color;
            }
        },
        async mounted() {
            this.kind = this.$route.params.kind == "note" ? "note" : "book";
            this.sort = this.kind == "note" ? this.keys_notes[3].value : this.keys_books[4].value;
            this.documents = await this.get_documents(this.kind);
            this.document_to_search = {};
            this.loading = false;
        },
        watch: {
            "$route.params.kind": async function() {
                if (this.kind != this.$route.params.kind) {
                    this.kind = this.$route.params.kind == "note" ? "note" : "book";
                    this.sort = this.kind == "note" ? this.keys_notes[3].value : this.keys_books[4].value;
                    this.documents = await this.get_documents(this.kind);
                    this.document_to_search = {};
                }
            }
        }
    }
</script>