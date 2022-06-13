<template>
    <div :style="{display:displayMode, 'background-color':'rgba(128,128,128,0.25)', ...positionStyle}">
        <div style="color:#E64A19; font-size:30px; line-height:60px; text-align:center">{{text}}</div>
    </div>
</template>

<script>
export default {        
    props: ["show", "text", "positionStyle"],
    data() {
        return {
        }
    },
    computed: {
        displayMode() { return this.show ? "block" : "none"},
    }
}
</script>

<style lang="scss">
</style>