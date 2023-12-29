export default {
    data: () => ({
        black: "black--text",
        class_spacer: "d-flex d-md-none",
        class_col: "d-flex align-center justify-center",
        class_desktop: "body-1 text-center",
        dialog_header_mobile: "body-2 black--text text-left d-flex d-md-none font-weight-bold",
        dialog_content_mobile: "body-2 text-right d-flex d-md-none",
        dialog_header_desktop: "body-1 mx-2 px-2 text-left d-none d-md-flex font-weight-bold black--text",
        dialog_content_desktop: "body-1 mx-2 px-2 text-center d-none d-md-flex",
        page_header_desktop: "title text-left mx-12 px-12 d-none d-md-flex font-weight-bold",
        page_header_mobile: "body-2 text-left d-flex d-md-none font-weight-bold",      
        page_content_desktop: "title text-right mx-12 px-12 d-none d-md-flex font-weight-bold",
        page_content_mobile: "body-2 text-right d-flex d-md-none",
    }),
    computed: {
        kind_page_header() {
            return this.$vuetify.breakpoint.smAndDown ? this.page_header_mobile : this.page_header_desktop;
        },
        kind_page_content() {
            return this.$vuetify.breakpoint.smAndDown ? this.page_content_mobile : this.page_content_desktop;
        },
        kind_dialog_header() {
            return this.$vuetify.breakpoint.smAndDown ? this.dialog_header_mobile : this.dialog_header_desktop;
        },
        kind_dialog_content() {
            return this.$vuetify.breakpoint.smAndDown ? this.dialog_content_mobile : this.dialog_content_desktop;
        },
        kind_mix_content() {
            return this.$vuetify.breakpoint.smAndDown ? this.page_content_mobile : this.class_desktop;
        }
    }
}