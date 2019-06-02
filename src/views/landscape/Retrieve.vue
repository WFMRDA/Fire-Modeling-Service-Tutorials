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
var axios = require('axios');
export default {
    name: "landscape-retrieve",
    data() {
        return {};
    },
    mounted: function() {
        var vm = this;
        this.$nextTick(function() {
            // axios({
            //     auth:{
            //         username:  'pyronerd62',
            //         password:  'paladin62'
            //     },
            //     url: 'http://192.255.42.9/landscapeREST/landscape/lcp/5110',
            //     method: 'GET',
            //     responseType: 'blob', // important
            //     }).then((response) => {
            //         const url = window.URL.createObjectURL(new Blob([response.data]));
            //         const link = document.createElement('a');
            //         link.href = url;
            //         link.setAttribute('download', 'file.zip');
            //         document.body.appendChild(link);
            //         link.click();
            // });
        });
    },
    methods: {}
};
</script>