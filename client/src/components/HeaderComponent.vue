<template>
    <v-card class="d-none d-md-flex sticky" dark flat tile color="grey darken-2">
        <v-row class="ma-0 pa-0">
            <v-col v-for="(header,i) in headers" :key="i" class="d-flex align-center justify-center" :cols="header.col">
                <span class="title text-uppercase text-center">{{ header.text }}</span>
            </v-col>
        </v-row>
    </v-card>
</template>

<script>
    export default {
        props: {
            headers: { required: true }
        }
    }
</script>

<style scoped>
    .sticky {
        position: sticky;
        top: 64px;
        z-index: 1;
    }
</style>