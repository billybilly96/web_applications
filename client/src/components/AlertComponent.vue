<template>
    <v-container>
        <v-alert :type="type" class="text-center">{{ text }}</v-alert>
    </v-container>
</template>

<script>
    export default {
        props: {
            type: { required: true },
            text: { required: true }
        }
    }
</script>