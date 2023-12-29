<template>
    <v-container>
        <v-row class="fill-height align-content-center justify-center text-center">
            <v-col class="title font-weight-bold" cols="12">Caricamento in corso</v-col>
            <v-col cols="10" sm="6">
                <v-progress-circular :size="80" :width="8" color="indigo" indeterminate></v-progress-circular>
            </v-col>
        </v-row>
    </v-container>
</template>