<template>
    <v-col cols="12" md="6" class="pa-3 d-flex flex-column align-center">
        <v-dialog v-model="dialog" :width="$vuetify.breakpoint.smAndDown ? '100%' : '65%'">
            <template v-slot:activator="{on}">
                <v-btn color="red lighten-1" dark v-on="on" width="60%">
                    <span v-if="kind=='book'">Carica libro</span>
                    <span v-else-if="kind=='note'">Carica appunti</span>
                </v-btn>
            </template>
            <v-card>
                <v-card-title class="d-flex flex-column align-center">
                    <span v-if="kind=='book'" class="headline font-weight-bold indigo--text">Carica un tuo libro</span>
                    <span v-else-if="kind=='note'" class="headline font-weight-bold indigo--text">Carica dei tuoi appunti</span>
                </v-card-title>
                <v-card-text>
                    <v-container>
                        <v-row v-if="kind=='book'" :no-gutters="$vuetify.breakpoint.smAndDown">
                            <v-col cols="12" md="8">
                                <v-autocomplete :dense="$vuetify.breakpoint.smAndDown" :items="available_degree_courses" v-model="new_book.degree_course" label="Corso di laurea" required :error-messages="book_degree_course_errors" @input="$v.new_book.degree_course.$touch()" @blur="$v.new_book.degree_course.$touch()"></v-autocomplete>
                            </v-col>
                            <v-col cols="12" md="4" v-if="available_study_years_in_book.length > 0">
                                <v-autocomplete :dense="$vuetify.breakpoint.smAndDown" :items="available_study_years_in_book" v-model="new_book.study_year" label="Anno di corso" required :error-messages="book_study_year_errors" @input="$v.new_book.study_year.$touch()" @blur="$v.new_book.study_year.$touch()"></v-autocomplete>
                            </v-col>
                            <v-col cols="12" v-if="available_subjects_in_book.length > 0">
                                <v-autocomplete :dense="$vuetify.breakpoint.smAndDown" :items="available_subjects_in_book" v-model="new_book.subject" label="Materia" required :error-messages="book_subject_errors" @input="$v.new_book.subject.$touch()" @blur="$v.new_book.subject.$touch()"></v-autocomplete>
                            </v-col>
                            <v-col cols="12">
                                <v-text-field :dense="$vuetify.breakpoint.smAndDown" v-model="new_book.title" label="Titolo" required :error-messages="book_title_errors" @input="$v.new_book.title.$touch()" @blur="$v.new_book.title.$touch()"></v-text-field>
                            </v-col>
                            <v-col cols="12" md="8">
                                <v-text-field :dense="$vuetify.breakpoint.smAndDown" v-model="new_book.author" label="Autore" required :error-messages="book_author_errors" @input="$v.new_book.author.$touch()" @blur="$v.new_book.author.$touch()"></v-text-field>
                            </v-col>
                            <v-col cols="12" md="4">
                                <v-text-field :dense="$vuetify.breakpoint.smAndDown" v-model="new_book.edition" label="Edizione" :error-messages="book_edition_errors" @input="$v.new_book.edition.$touch()" @blur="$v.new_book.edition.$touch()"></v-text-field>
                            </v-col>
                        </v-row>
                        <v-row v-if="kind=='note'" :no-gutters="$vuetify.breakpoint.smAndDown">
                            <v-col cols="12" md="8">
                                <v-autocomplete :dense="$vuetify.breakpoint.smAndDown" :items="available_degree_courses" v-model="new_note.degree_course" label="Corso di laurea" required :error-messages="note_degree_course_errors" @input="$v.new_note.degree_course.$touch()" @blur="$v.new_note.degree_course.$touch()"></v-autocomplete>
                            </v-col>
                            <v-col cols="12" md="4">
                                <v-autocomplete :dense="$vuetify.breakpoint.smAndDown" :items="available_academic_years_in_note" v-model="new_note.academic_year" label="Anno accademico" required :error-messages="note_academic_year_errors" @input="$v.new_note.academic_year.$touch()" @blur="$v.new_note.academic_year.$touch()"></v-autocomplete>
                            </v-col>
                            <v-col cols="12" v-if="available_subjects_in_note.length > 0">
                                <v-autocomplete :dense="$vuetify.breakpoint.smAndDown" :items="available_subjects_in_note" v-model="new_note.subject" label="Materia" required :error-messages="note_subject_errors" @input="$v.new_note.subject.$touch()" @blur="$v.new_note.subject.$touch()"></v-autocomplete>
                            </v-col>
                            <v-col cols="12">
                                <v-textarea v-model="new_note.description" label="Descrizione" outlined></v-textarea>
                            </v-col>
                        </v-row>
                    </v-container>
                </v-card-text>
                <v-card-actions class="d-flex justify-space-around pt-0">
                    <v-btn dark :width="$vuetify.breakpoint.smAndDown ? '45%' : '33%'" class="mb-2 mr-2" color="green" @click="add_document">Conferma</v-btn>
                    <v-btn dark :width="$vuetify.breakpoint.smAndDown ? '45%' : '33%'" class="mb-2 ml-2" color="red lighten-1" @click="reset_component">Annulla</v-btn>
                </v-card-actions>
            </v-card>
        </v-dialog>
    </v-col>
</template>

<script>
    import { validationMixin } from "vuelidate";
    import { required, integer } from "vuelidate/lib/validators";
    import universityMixin from "@/mixins/universityMixin";
    import styleMixin from "@/mixins/styleMixin";

    export default {
        mixins: [ universityMixin, validationMixin, styleMixin ],
        validations: {
            new_book: {
                degree_course: { required },
                study_year: { required, integer },
                subject: { required },
                title: { required },
                author: { required },
                edition: { integer }
            },
            new_note: {
                degree_course: { required },
                academic_year: { required },
                subject: { required }
            }
        },
        props: {
            kind: { required: true },
            alert: { required: true },
            alert_type: { required: true },
            alert_text: { required: true }
        },
        computed: {
            available_degree_courses() {
                return this.get_degree_courses();
            },
            available_study_years_in_book() {
                var course_duration = this.get_degree_course_duration(this.new_book.degree_course);
                return (course_duration == null) ? [] : [...Array(course_duration).keys()].map(i => i + 1);
            },
            available_subjects_in_book() {
                var subjects = this.get_year_course_subjects(this.new_book.degree_course, "" + this.new_book.study_year);
                return (subjects == null) ? [] : subjects;
            },
            available_subjects_in_note() {
                var subjects = this.get_course_subjects(this.new_note.degree_course);
                return (subjects == null) ? [] : subjects;
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
            book_degree_course_errors() {
                var errors = [];
                if (!this.$v.new_book.degree_course.$dirty) {
                    return errors;
                }
                !this.$v.new_book.degree_course.required && errors.push("Il campo corso di laurea è obbligatorio.");
                return errors;
            },
            book_study_year_errors() {
                var errors = [];
                if (!this.$v.new_book.study_year.$dirty) {
                    return errors;
                }
                !this.$v.new_book.study_year.required && errors.push("Il campo anno di corso è obbligatorio.");
                !this.$v.new_book.study_year.integer && errors.push("L'anno di corso deve essere espresso con un numero.");
                return errors;
            },
            book_subject_errors() {
                var errors = [];
                if (!this.$v.new_book.subject.$dirty) {
                    return errors;
                }
                !this.$v.new_book.subject.required && errors.push("Il campo materia è obbligatorio.");
                return errors;
            },
            book_title_errors() {
                var errors = [];
                if (!this.$v.new_book.title.$dirty) {
                    return errors;
                }
                !this.$v.new_book.title.required && errors.push("Il campo titolo è obbligatorio.");
                return errors;
            },
            book_author_errors() {
                var errors = [];
                if (!this.$v.new_book.author.$dirty) {
                    return errors;
                }
                !this.$v.new_book.author.required && errors.push("Il campo autore è obbligatorio.");
                return errors;
            },
            book_edition_errors() {
                var errors = [];
                if (!this.$v.new_book.edition.$dirty) {
                    return errors;
                }
                !this.$v.new_book.edition.integer && errors.push("L'edizione deve essere espressa con un numero.");
                return errors;
            },
            note_degree_course_errors() {
                var errors = [];
                if (!this.$v.new_note.degree_course.$dirty) {
                    return errors;
                }
                !this.$v.new_note.degree_course.required && errors.push("Il campo corso di laurea è obbligatorio.");
                return errors;
            },
            note_academic_year_errors() {
                var errors = [];
                if (!this.$v.new_note.academic_year.$dirty) {
                    return errors;
                }
                !this.$v.new_note.academic_year.required && errors.push("Il campo anno accademico è obbligatorio.");
                return errors;
            },
            note_subject_errors() {
                var errors = [];
                if (!this.$v.new_note.subject.$dirty) {
                    return errors;
                }
                !this.$v.new_note.subject.required && errors.push("Il campo materia è obbligatorio.");
                return errors;
            }
        },
        data: () => ({
            current_date: new Date(),
            dialog: false,
            new_book: {
                degree_course: "",
                study_year: null,
                subject: "",
                title: "",
                author: "",
                edition: null
            },
            new_note: {
                degree_course: "",
                academic_year: "",
                subject: "",
                description: ""
            }
        }),
        methods: {
            async add_document() {
                try {
                    var sy = this.new_book.study_year;
                    var sub_b = this.new_book.subject;
                    var sub_n = this.new_note.subject;
                    this.new_book.study_year = (sy == null || !this.available_study_years_in_book.includes(sy)) ? null : sy;
                    this.new_book.subject = (sub_b == null || !this.available_subjects_in_book.includes(sub_b)) ? "" : sub_b;
                    this.new_note.subject = (sub_n == null || !this.available_subjects_in_note.includes(sub_n)) ? "" : sub_n;
                    this.$v.$touch();
                    if (this.kind == "book" && !this.$v.new_book.$invalid) {
                        await this.add_book();
                    } else if (this.kind == "note" && !this.$v.new_note.$invalid) {
                        await this.add_note();
                    }
                } catch (err) {
                    this.$emit("update:alert", true);
                    this.$emit("update:alert_type", "error");
                    this.$emit("update:alert_text", err.response.data.description);
                    this.dialog = false;
                    await new Promise(res => setTimeout(res, 4000));
                    this.$emit("update:alert", false);
                }
            },
            async add_book() {
                await this.axios.post(this.serverHost + "/book", this.new_book);
                this.$emit("update:alert", true);
                this.$emit("update:alert_type", "success");
                this.$emit("update:alert_text", "Il libro è stato caricato correttamente.");
                this.$emit("loaded");
                this.reset_component();
                await new Promise(res => setTimeout(res, 4000));
                this.$emit("update:alert", false);
            },
            async add_note() {
                await this.axios.post(this.serverHost + "/note", this.new_note);
                this.$emit("update:alert", true);
                this.$emit("update:alert_type", "success");
                this.$emit("update:alert_text", "Gli appunti sono stati caricati correttamente.");
                this.$emit("loaded");
                this.reset_component();
                await new Promise(res => setTimeout(res, 4000));
                this.$emit("update:alert", false);
            },
            reset_component() {
                this.$v.$reset();
                this.dialog = false;
                this.new_book.degree_course = "";
                this.new_book.study_year = null;
                this.new_book.subject = "";
                this.new_book.title = "";
                this.new_book.author = "";
                this.new_book.edition = null;
                this.new_note.degree_course = "";
                this.new_note.academic_year = "";
                this.new_note.subject = "";
                this.new_note.description = "";
            }
        }
    }
</script>