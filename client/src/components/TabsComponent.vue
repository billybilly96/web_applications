<template>
    <v-row no-gutters>
        <v-col>
            <v-tabs v-model="currentSection" slider-color="red lighten-1" grow>
                <v-tab class="text-center mx-0" v-for="(item,i) in sections" :key="i" :href="'#' + item" color="white" dense> 
                    <span :class="$vuetify.breakpoint.smAndDown ? 'caption font-weight-bold' : ''" class="black--text">{{ item }}</span>
                </v-tab>
            </v-tabs>
        </v-col>
    </v-row>
</template>

<script>
    export default {
        props: {
            current_section: { required: true },
            sections: { required: true }
        },
        computed: {
            currentSection: {
                get() {
                    return this.current_section;
                },
                set(value) {
                    this.$emit("update:current_section", value);
                }
            }
        }
    }
</script>