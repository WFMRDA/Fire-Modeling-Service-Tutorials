<style lang="scss" scoped>
</style>
<template>
    <v-container fill-height>
        <v-layout justify-center align-center>
            <v-flex shrink>
                <h1 class="text-uppercase">{{ $options.name }}</h1>
            </v-flex>
        </v-layout>
    </v-container>
</template>
<script>
// import { Landscape } from "../../lib/msf";

export default {
    name: "dashboard",
    data() {
        return {};
    },
    created: function() {
        // console.log(Landscape);
    },
    mounted: function() {
        var vm = this;
        this.$nextTick(function() {});
    },
    methods: {}
};
</script>