<template>
    <v-dialog v-model="dialog" :width="$vuetify.breakpoint.smAndDown ? '100%' : '65%'">
        <template v-slot:activator="{on}">
            <v-btn text small color="black" v-on="on">{{ number_searched_fields == 0 ? 'Ricerca Avanzata' : 'Modifica Ricerca' }}</v-btn>
            <v-btn v-show="$vuetify.breakpoint.mdAndUp && number_searched_fields > 0" text small color="black" @click="undo_search">{{ number_searched_fields == 0 ? '' : 'Annulla Ricerca' }}</v-btn>
        </template>  
        <v-card>
            <div class="sticky-top">
                <v-card-title class="py-1">
                    <v-row class="d-flex align-center" no-gutters>
                        <v-col cols="1"></v-col>
                        <v-col cols="10" class="d-flex justify-center">
                            <span :class="$vuetify.breakpoint.smAndDown ? 'title' : 'headline'" class="font-weight-bold indigo--text text-center">Ricerca Avanzata</span>
                        </v-col>
                        <v-col cols="1" class="text-right">
                            <v-btn icon dark @click="dialog=false">
                                <v-icon color="black">mdi-close</v-icon>
                            </v-btn>
                        </v-col>
                    </v-row>
                </v-card-title>
                <v-divider></v-divider>
            </div>
            <v-card-text class="py-2">
                <v-row v-if="kind=='book'" :no-gutters="$vuetify.breakpoint.smAndDown">
                    <v-col cols="12" md="9">
                        <v-autocomplete :dense="$vuetify.breakpoint.smAndDown" :items="available_degree_courses" v-model="book.degree_course" label="Corso di laurea" ></v-autocomplete>
                    </v-col>
                    <v-col cols="12" md="3">
                        <v-autocomplete :dense="$vuetify.breakpoint.smAndDown" :items="available_study_years_in_book" v-model="book.study_year" label="Anno di corso" :error-messages="book_study_year_errors" @input="$v.book.study_year.$touch()" @blur="$v.book.study_year.$touch()"></v-autocomplete>
                    </v-col>                
                    <v-col cols="12">
                        <v-autocomplete :dense="$vuetify.breakpoint.smAndDown" :items="available_subjects_in_book" v-model="book.subject" label="Materia" ></v-autocomplete>
                    </v-col>    
                    <v-col cols="12" md="5">
                        <v-text-field v-model="book.title" label="Titolo"></v-text-field>
                    </v-col>
                    <v-col cols="12" md="4">
                        <v-text-field v-model="book.author" label="Autore"></v-text-field>
                    </v-col>
                    <v-col cols="12" md="3">
                        <v-text-field v-model="book.edition" label="Edizione" :error-messages="book_edition_errors" @input="$v.book.edition.$touch()" @blur="$v.book.edition.$touch()"></v-text-field>
                    </v-col>
                    <v-col cols="12" md="6">
                        <v-text-field v-model="book.owner_username" label="Username proprietario" :error-messages="book_owner_username_errors" @input="$v.book.owner_username.$touch()" @blur="$v.book.owner_username.$touch()"></v-text-field>
                    </v-col>
                    <v-col cols="12" md="6">
                        <v-autocomplete :dense="$vuetify.breakpoint.smAndDown" :items="available_states" v-model="book.availability" label="Stato"></v-autocomplete>
                    </v-col>
                </v-row>
                <v-row v-if="kind=='note'" :no-gutters="$vuetify.breakpoint.smAndDown">
                    <v-col cols="12" md="8">
                        <v-autocomplete :dense="$vuetify.breakpoint.smAndDown" :items="available_degree_courses" v-model="note.degree_course" label="Corso di laurea"></v-autocomplete>
                    </v-col>
                    <v-col cols="12" md="4">
                        <v-autocomplete :dense="$vuetify.breakpoint.smAndDown" :items="available_academic_years_in_note" v-model="note.academic_year" label="Anno accademico"></v-autocomplete>
                    </v-col>
                    <v-col cols="12">
                        <v-autocomplete :dense="$vuetify.breakpoint.smAndDown" :items="available_subjects_in_note" v-model="note.subject" label="Materia"></v-autocomplete>
                    </v-col>
                    <v-col cols="12" md="6">
                        <v-text-field v-model="note.owner_username" label="Username proprietario" :error-messages="note_owner_username_errors" @input="$v.note.owner_username.$touch()" @blur="$v.note.owner_username.$touch()"></v-text-field>
                    </v-col>
                    <v-col cols="12" md="6">
                        <v-autocomplete :dense="$vuetify.breakpoint.smAndDown" :items="available_states" v-model="note.availability" label="Stato"></v-autocomplete>
                    </v-col>
                </v-row>
            </v-card-text>
            <v-card-actions class="d-flex justify-space-around pt-0">
                <v-btn dark :width="$vuetify.breakpoint.smAndDown ? '45%' : '33%'" class="mb-2 mx-2" color="green" @click="search_documents">Conferma</v-btn>
                <v-btn dark :width="$vuetify.breakpoint.smAndDown ? '45%' : '33%'" class="mb-2 mx-2" color="red lighten-1" @click="reset_search">Reset</v-btn>
            </v-card-actions>
        </v-card>
    </v-dialog>   
</template>

<script>
    import { validationMixin } from "vuelidate";
    import { integer, minLength } from "vuelidate/lib/validators";
    import universityMixin from "@/mixins/universityMixin";
    import styleMixin from "@/mixins/styleMixin";

    export default {
        mixins: [ universityMixin, validationMixin, styleMixin ],
        props: {
            kind: { required: true },
            document_to_search: { required: true }
        },
        validations: {
            book: {
                study_year: { integer },
                edition: { integer },
                owner_username: { minLength: minLength(4), validUsername: function(username) {
                    var username_regex = /(^$|^([a-zA-Z0-9])+$)/;
                    return username_regex.test(username);
                } }
            },
            note: {
                owner_username: { minLength: minLength(4), validUsername: function(username) {
                    var username_regex = /(^$|^([a-zA-Z0-9])+$)/;
                    return username_regex.test(username);
                } }
            }
        },
        computed: {
            available_degree_courses() {
                return this.get_degree_courses();
            },
            available_study_years_in_book() {
                var course_duration = this.get_degree_course_duration(this.book.degree_course);
                return (course_duration == null) ? [] : [...Array(course_duration).keys()].map(i => i + 1);
            },
            available_subjects_in_book() {
                var subjects;
                if (this.book.degree_course == "") {
                    subjects = this.get_subjects();
                    return (subjects == null) ? [] : subjects;
                } else if (this.book.study_year == null || !this.available_study_years_in_book.includes(this.book.study_year)) {
                    subjects = this.get_course_subjects(this.book.degree_course);
                    return (subjects == null) ? [] : subjects;
                } else {
                    subjects = this.get_year_course_subjects(this.book.degree_course, "" + this.book.study_year);
                    return (subjects == null) ? [] : subjects;
                }
            },
            available_subjects_in_note() {
                var subjects;
                if(this.note.degree_course == "") {
                    subjects = this.get_subjects();
                    return (subjects == null) ? [] : subjects;
                } else {
                    subjects = this.get_course_subjects(this.note.degree_course);
                    return (subjects == null) ? [] : subjects;
                }
            },
            available_academic_years_in_note() {
                var academic_years = [];
                var year = (this.current_date.getMonth() > 7) ? this.current_date.getFullYear() + 1 : this.current_date.getFullYear();
                for (var i = 0; i < 4; i++) {    
                    academic_years.push((year - 1 - i) + "/" + (year - i));
                }
                academic_years.push("Precedente al " + (year - 4) + "/" + (year - 3));
                return academic_years;
            },
            book_study_year_errors() {
                var errors = [];
                if (!this.$v.book.study_year.$dirty) {
                    return errors;
                }
                !this.$v.book.study_year.integer && errors.push("L'anno di corso deve essere espresso con un numero.");
                return errors;
            },
            book_edition_errors() {
                var errors = [];
                if (!this.$v.book.edition.$dirty) {
                    return errors;
                }
                !this.$v.book.edition.integer && errors.push("L'edizione deve essere espressa con un numero.");
                return errors;
            },
            book_owner_username_errors() {
                var errors = [];
                if (!this.$v.book.owner_username.$dirty) {
                    return errors;
                }
                !this.$v.book.owner_username.minLength && errors.push("L'username del proprietario deve contenere almeno 4 caratteri.");
                !this.$v.book.owner_username.validUsername && errors.push("L'username del proprietario deve contenere solo lettere e/o numeri e non sono ammessi spazi.");
                return errors;
            },
            note_owner_username_errors() {
                var errors = [];
                if (!this.$v.note.owner_username.$dirty) {
                    return errors;
                }
                !this.$v.note.owner_username.minLength && errors.push("L'username del proprietario deve contenere almeno 4 caratteri.");
                !this.$v.note.owner_username.validUsername && errors.push("L'username del proprietario deve contenere solo lettere e/o numeri e non sono ammessi spazi.");
                return errors;
            },
            number_searched_fields() {
                return Object.values(this.document_to_search).filter(field => field != null && field != "").length;
            }
        },
        data: () => ({
            dialog: false,
            current_date: new Date(),
            available_states: [
                "Disponibile",
                "Disponibile entro 10 giorni",
                "Disponibile entro 20 giorni",
                "Disponibile entro 30 giorni",
                "Disponibile o da verificare"
            ],
            book: {
                degree_course: "",
                study_year: null,
                subject: "",
                title: "",
                author: "",
                edition: null,
                owner_username: "",
                availability : ""
            },
            note: {
                degree_course: "",
                academic_year: "",
                subject: "",
                owner_username: "",
                availability : ""
            }
        }),
        methods: {
            search_documents() {
                this.$v.$touch();
                var sy, sub;
                if (this.kind == "book" && !this.$v.book.$invalid) {
                    sy = this.book.study_year;
                    sub = this.book.subject;
                    this.book.study_year = (sy == null || !this.available_study_years_in_book.includes(sy)) ? null : sy;
                    this.book.subject = (sub == null || !this.available_subjects_in_book.includes(sub)) ? "" : sub;
                    this.$emit("update:document_to_search", JSON.parse(JSON.stringify(this.book)));
                    this.dialog = false;
                } else if (this.kind == "note" && !this.$v.note.$invalid) {
                    sub = this.note.subject;
                    this.note.subject = (sub == null || !this.available_subjects_in_note.includes(sub)) ? "" : sub;
                    this.$emit("update:document_to_search", JSON.parse(JSON.stringify(this.note)));
                    this.dialog = false;
                }
            },
            reset_search() {
                this.book.degree_course = "";
                this.book.study_year =  null;
                this.book.subject = "";
                this.book.title = "";
                this.book.author = "";    
                this.book.edition = null;
                this.book.owner_username = "";
                this.book.availability = "";
                this.note.degree_course = "";
                this.note.academic_year = "";
                this.note.subject = "";
                this.note.owner_username = "";
                this.note.availability = "";
            },
            undo_search() {
                this.$emit("update:document_to_search", {});
            }
        },
        watch: {
            "dialog": function() {
                var dts = JSON.parse(JSON.stringify(this.document_to_search));
                if (this.dialog && this.kind == "note") {
                    this.note.degree_course = dts.degree_course == null ? "" : dts.degree_course;
                    this.note.academic_year = dts.academic_year == null ? "" : dts.academic_year;
                    this.note.subject = dts.subject == null ? "" : dts.subject;
                    this.note.owner_username = dts.owner_username == null ? "" : dts.owner_username;
                    this.note.availability = dts.availability == null ? "" : dts.availability;
                } else if (this.dialog && this.kind == "book") {
                    this.book.degree_course = dts.degree_course == null ? "" : dts.degree_course;
                    this.book.study_year = dts.study_year == null ? null : dts.study_year;
                    this.book.subject = dts.subject == null ? "" : dts.subject;
                    this.book.title = dts.title == null ? "" : dts.title;
                    this.book.author = dts.author == null ? "" : dts.author;
                    this.book.edition = dts.edition == null ? null : dts.edition;
                    this.book.owner_username = dts.owner_username == null ? "" : dts.owner_username;
                    this.book.availability = dts.availability == null ? "" : dts.availability;
                }
            }
        }
    }
</script>

<style scoped>
    .sticky-top {
        position: sticky;
        top: 0px;
        z-index: 1;
        background: white;
    }
</style>