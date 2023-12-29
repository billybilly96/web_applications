<template>
    <v-row class="d-flex justify-center">
        <v-col cols="12" sm="6">
            <v-card>
                <v-img class="white--text" src="@/assets/nodata.png" />  
                <v-card-text class="title text-center black--text font-weight-light">{{ text }}</v-card-text>
            </v-card>
        </v-col>
    </v-row>
</template>

<script>
    export default {
        props: {
            text: { required: true }
        }
    }
</script>