<template>
    <v-dialog :value="show" persistent width="480px" max-width="480px" @keydown.esc ="$emit('confirm')" @click:outside="$emit('confirm')">
        <v-card>
            <v-card-title>
                <span class="headline">{{error.title}}</span>
            </v-card-title>
            <v-card-text>                      
                <v-container fluid>
                    <v-row>
                        <v-col class="cols=12">
                            <div :style="{'overflow-y':'auto', 'min-height':'50px', 'max-height':'600px'}">                                
                                <div v-for="line in lines" :key="line">                                    
                                    <span>{{line}}</span>
                                    <br>
                                </div>
                            </div>
                        </v-col>
                    </v-row>
                </v-container>
            </v-card-text>
            <v-card-actions>                
                <v-spacer/>
                <v-btn class="primary white--text" @click="$emit('confirm')">OK</v-btn>
            </v-card-actions>
        </v-card>
    </v-dialog>
</template>

<script>
export default {
    props: ["show", "error"],

    data() {
        return {  
        }
    },

    computed: {
        lines() {
            return this.error.reason.split(/\r\n|\r|\n/);
        }
    },

}
</script>
