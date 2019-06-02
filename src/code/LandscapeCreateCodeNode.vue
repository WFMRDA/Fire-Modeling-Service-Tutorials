<style lang="scss" scoped>
#in{
    display: none;
}
</style>
<template>
    <div>  
        <pre ref="input" id="in">
var axios = require('axios');
var querystring = require('querystring');
var payload = {{ mapPayload }}
axios({ 
    baseURL: "{{ serviceUrl }}",
    auth:{
        username: "<em>&lt;username&gt;</em>"
        password: "<em>&lt;password&gt;</em>"
    },
    method: 'POST',
    url: '/create',  
    data: querystring.stringify(payload),
    config: { 
        headers: {
            "Content-Type": "application/x-www-form-urlencoded", 
            "cache-control": "no-cache",
        }
    }
});
        </pre>
        <pre class="prettyprint" v-html="codeOutput"></pre>
    </div>

</template>
<script>
const prettyPrint = require('code-prettify'); 
export default {
    name: 'landscape-create-code-node',
    props: {
        mapPayload: {
            type: Object, 
        },
        serviceUrl:{
            type:String,
            required:true
        }
    },
    data() {
        return {
            codeOutput : "",
        };
    },
    mounted: function () {
        var vm = this;
        this.$nextTick(function () {
            var html = this.$refs.input.innerHTML;
            this.codeOutput = prettyPrint.prettyPrintOne(html, 'js');
        })
    },
    updated: function () {
        this.$nextTick(function () {
            var html = this.$refs.input.innerHTML;
            this.codeOutput = prettyPrint.prettyPrintOne(html, 'js');
        })
    },
    watch:{
        mapPayload(data,oldVal){
            var html = this.$refs.input.innerHTML;
        }
    },
    methods:{
       
    }
}
</script>