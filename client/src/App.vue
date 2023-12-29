<template>
    <v-app>
        <NavbarComponent />
        <v-content class="bg">
            <router-view class="full"></router-view> 
        </v-content>
    </v-app>
</template>

<script>
    import NavbarComponent from "@/components/NavbarComponent";

    export default {
        components: { NavbarComponent }
    }
</script>

<style>
    .bg {
        background-image: url("./assets/background.jpg");
        background-repeat: no-repeat;
        background-position: center;
        background-size: cover;
        background-attachment: fixed;
    }
    .full {
        height: 100%;
    }
    .inline {
        display: inline-flex;
    }
    .link {
        text-decoration: none;
    }
</style>
