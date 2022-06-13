<template>
    <v-app>
        <router-view/>
        <AlertComponent/>
    </v-app>
</template>

<script>
import AlertComponent from './components/alert/AlertComponent.vue';
export default {
    name: 'App',
    components: {
        AlertComponent
    },

    data: () => ({
    }),

    methods: {        
    },

    created() {
    },    
};
</script>
