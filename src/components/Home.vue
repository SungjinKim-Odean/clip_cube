<template>
    <v-app>
        <!--v-system-bar :height="$styleConfig.systemBar.height">                                  
        </v-system-bar>
        <v-divider color="grey" class="my-0"/-->    
        <v-main class="ma-0 pa-0" id="main-view">
            <ThreeRenderView ref="threeRenderView" @object-picked="onObjectPicked" @map-clicked="onMapClicked"/>
        </v-main>
        <v-footer inset class="grey" ma-0 padless :height="$styleConfig.statusBar.height">
            <v-row no-gutters>      
                <v-col class="d-flex justify-start px-2" cols="6"><span class="white--text">{{statusBarMessage}}</span></v-col>
                <v-col class="d-flex justify-end px-2" cols="6"><span class="white--text"></span></v-col>
            </v-row>
        </v-footer>        
    </v-app>
</template>

<script>
import ThreeRenderView from "./panels/ThreeRenderView";
import TooltipedMenuIcon from "./commonControl/TooltipedMenuIcon";
import moment from 'moment';

export default {
    name: "Home",
    components: {
        ThreeRenderView,
        TooltipedMenuIcon,
    },
    data() {    
        return {
            statusBarMessage: '',
            lastStatusMessageUpdated: moment(),
            statusResetTimerId: null,            
        };
    },
    computed: {
    },

    watch: {            
    },

    methods: {
        setStatusMessage(msg) {
            this.statusBarMessage = msg;
            this.lastStatusMessageUpdated = moment();
        },

        onObjectPicked(payload) {
            
        },

        onMapClicked(payload) {
            
        },  
        
        onStatusResetTimerWork() {
            if(this.statusBarMessage !== '') {
                const diff = moment().diff(this.lastStatusMessageUpdated, 's');
                if(diff > 5) {
                    this.statusBarMessage = '';
                }
            }
        },
    },

    created() {         
    },

    mounted() {
        this.statusResetTimerId = setInterval(this.onStatusResetTimerWork, 1000);        
    },
    
    destroyed() {        
    }
};
</script>

<style lang="scss">
    // 버튼의 텍스트가 자동으로 대문자로 변경되는 것을 막는다.
    .v-btn {
        text-transform: none !important;  
    }
</style>
