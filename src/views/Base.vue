<style lang="scss" scoped>

</style>
<template>
    <v-container fill-height>
        <v-layout justify-center align-center>
            <v-flex shrink>
                <h1 class="text-uppercase">{{ $options.name }} </h1>
            </v-flex>
        </v-layout>
    </v-container>
</template>
<script>

export default {
    name: '',
    data() {
        return {
        };
    },
    mounted: function () {
        var vm = this;
        this.$nextTick(function () {
        })
    },
    methods:{
       
    }
}
</script>