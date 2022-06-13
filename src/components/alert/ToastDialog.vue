<template>
    <v-snackbar v-model="show" :multi-line="true" color="primary" right bottom height="100px">        
        <v-container fluid class="pa-1">
            <v-row>
                <v-col class="cols=12">
                    <v-subheader class="white--text text-subtitle-1 font-weight-regular">{{content}}</v-subheader>
                </v-col>
            </v-row>
        </v-container>
        <template v-slot:action="{attrs}">
            <v-icon v-bind="attrs" large @click="$emit('confirm')">mdi-check</v-icon>
        </template>
    </v-snackbar>
</template>

<script>
export default {    
    props: ["show", "content"],

    data() {
        return {  
            timeout: 3000,
        }
    },

    created() {        
        setTimeout(() => {
            this.$emit('confirm');
        }, this.timeout);
    },
}
</script>