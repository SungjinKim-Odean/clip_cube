<template>
    <v-tooltip bottom>
        <template v-slot:activator="{ on, attrs }">
            <v-icon v-bind="{...attrs, ...styleAttr}" :color="pushed ? 'green accent-4' : styleAttr.color" v-on="on" :disabled="disabled" @click="$emit('click')">{{icon}}</v-icon>
        </template>
        <span>{{tooltip}}</span>
    </v-tooltip>      
</template>

<script>
export default {
    name: 'TooltipedMenuIcon',
    props: {
        styleAttr: Object,
        icon: String,
        disabled: {
            type: Boolean,
            default: false,
        },
        tooltip: String,
        pushed: {
            type: Boolean,
            default: false,
        },
    },

    data() {
        return {
        }
    },
    methods: {       
    }
}
</script>