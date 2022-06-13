<template>
    <v-dialog :value="show" persistent width="480px" max-width="480px" @click:outside="$emit('cancel')" @keydown.esc="$emit('cancel')">
        <v-card>
            <v-card-title>
                <span class="headline">{{query.title}}</span>
            </v-card-title>
            <v-card-text>                      
                <v-container fluid>
                    <v-row>
                        <v-col cols="12">
                            <v-subheader>{{query.query}}</v-subheader>
                        </v-col>
                    </v-row>
                </v-container>
            </v-card-text>
            <v-card-actions>                
                <v-spacer/>
                <v-btn class="white primary--text" @click="$emit('cancel')">No</v-btn>
                <v-btn class="primary white--text" @click="$emit('confirm')">Yes</v-btn>
            </v-card-actions>
        </v-card>
    </v-dialog>
</template>

<script>
export default {
    props: ["show", "query"],

    data() {
        return {  
        }
    },

    computed: {
    }
}
</script>