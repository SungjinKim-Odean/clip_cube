<template>
    <div>
        <WarningDialog v-if="showWarning" :show="showWarning" :error="error" @confirm="showWarning=false"/>
        <ToastDialog v-if="showToast" :show="showToast" :content="toastContent" @confirm="showToast=false"/>
        <ConfirmDialog v-if="showConfirm" :show="showConfirm" :query="query" @cancel="onQueryCancel" @confirm="onQueryConfirm"/>
    </div>
</template>

<script>
import WarningDialog from './WarningDialog';
import ToastDialog from './ToastDialog';
import ConfirmDialog from './ConfirmDialog';

export default {
    props: [],
    components: {
        WarningDialog,
        ToastDialog,
        ConfirmDialog,
    },

    data() {
        return {            
            showWarning: false,
            showConfirm: false,
            showToast: false,
            error: {title:"", reason:""},            
            toastContent: "",            
            query: {title:"", query:"", yes_action:null, yes_param:null, no_action:null, no_param:null},
        }
    },

    computed: {            
    },

    methods: {
        onQueryConfirm() {      
            this.showConfirm = false;
            if(this.query.yes_action != null) {        
                this.query.yes_action(this.query.yes_param);
            }
        },

        onQueryCancel() {      
            this.showConfirm = false;
            if(this.query.no_action != null) {        
                this.query.no_action(this.query.no_param);
            }
        },
    },

    created() {
        this.$eventBus.$on('warn', (err) => {
            this.error = err;
            this.showWarning = true;
        });

        this.$eventBus.$on('info', (content) => {
            this.toastContent = content;
            this.showToast = true;
        });

        this.$eventBus.$on('confirm', (query) => {
            this.query = query;
            this.showConfirm = true;
        });       
    },
}
</script>

<style lang="scss">
</style>
