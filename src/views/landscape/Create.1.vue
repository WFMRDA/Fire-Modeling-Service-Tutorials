<style lang="scss" scoped>

.landscape-create{
    flex-direction: column;
    // height: 100%;
    min-height: 450px;
}
.info-box{
    position: absolute;
    left: 0;
    bottom: 0;
    height: 500px;
    width: 400px;
    background-color:lightblue;
}
</style>
<style>

</style>
<template>      
    <v-layout column>   
        <v-flex xs12 d-flex class="landscape-create">  
            <landscape-map  @update="updateMapParams"></landscape-map> 
        </v-flex>
        <v-flex xs12 pb-3>
            <v-card class="elevation-10">
                <v-toolbar card>
                    <v-toolbar-title>Landscape Service</v-toolbar-title>
                    <v-spacer></v-spacer> 
                        <v-tooltip top>
                            <template v-slot:activator="{ on }">
                                 <v-btn icon v-on="on" @click="show = !show">
                                    <v-icon>code</v-icon>
                                </v-btn>
                            </template>
                            <span>Code Snippets</span>
                        </v-tooltip>
                </v-toolbar>
                <v-divider></v-divider>
                <v-expand-transition>
                    <v-card-text> 
                        <v-card v-show="show" color="#2d2d2d"> 
                            <v-toolbar card color="#2d2d2d">
                                <v-btn :flat="codePanel != 'nodejs'" round color="white" class="active" @click="codePanel = 'nodejs'">
                                    Node Js
                                </v-btn>
                                <v-btn :flat="codePanel != 'java'" round color="white"  @click="codePanel = 'java'">
                                    Java
                                </v-btn>
                                <v-btn :flat="codePanel != 'python'" round color="white"  @click="codePanel = 'python'">
                                    Python
                                </v-btn>
                            </v-toolbar>
                            <v-divider dark/>
                            <v-card-text class='mt-2'>
                                <v-expand-transition>
                                    <pre class="prettyprint lang-js" v-show="codePanel == 'nodejs'">
                                        // Code Goes Here
                                        console.log('hello world');
                                    </pre>
                                </v-expand-transition>
                                <v-expand-transition>
                                    <pre class="prettyprint lang-java" v-show="codePanel == 'java'">
                                        // Code Goes Here
                                        public class HelloWorld { 
                                            public static void main(String[] args) {
                                                // Prints "Hello, World" to the terminal window.
                                                System.out.println("Hello, World");
                                            }
                                        }
                                    </pre>
                                </v-expand-transition>
                                <v-expand-transition>
                                    <pre class="prettyprint lang-py" v-show="codePanel == 'python'">
                                        // Code Goes Here
                                        print("Hello World.")
                                    </pre>
                                </v-expand-transition>
                            </v-card-text>
                        </v-card>
                    </v-card-text>
                </v-expand-transition>
                <v-card-text class="text-xs-center">
                    <p class='mb-0'>Draw Extent Above</p>
                </v-card-text>
                <v-card-text>  
                    <v-form ref="form" v-on:submit.prevent="onSubmit($v)"> 
                        <v-container grid-list-xl text-xs-center>
                            <v-layout row wrap>
                                <v-flex xs12  class="py-0"> 
                                    <v-alert
                                        :value="acresError"
                                        color="error"
                                    >
                                        This extent is too big for this demo. Please reduce size to below {{ maxSizeLimit | formatNumber  }} acres
                                    </v-alert>
                                    <h1 v-show="acres>0" class="font-weight-light">Extent {{ acres | formatNumber }} ac</h1>
                                </v-flex>
                                <v-flex xs12 sm8 offset-sm2 md4 offset-md4 class="py-0"> 
                                    <v-text-field 
                                        outline
                                        readonly
                                        label="North Latitude"
                                        v-model.trim="$v.northLatitude.$model"
                                        :error-messages="northLatitudeErrors"
                                        @input="$v.northLatitude.$touch()"
                                        @blur="$v.northLatitude.$touch()"
                                        :loading="loading"
                                    /> 
                                </v-flex>
                                <v-flex xs12 sm6 md4 offset-md2 class="py-0"> 
                                    <v-text-field
                                        height=10
                                        outline
                                        readonly
                                        label="West Longitude"
                                        v-model.trim="$v.westLongitude.$model"
                                        :error-messages="westLongitudeErrors"
                                        @input="$v.westLongitude.$touch()"
                                        @blur="$v.westLongitude.$touch()"
                                        :loading="loading"
                                    /> 
                                </v-flex>
                                <v-flex xs12 sm6 md4 class="py-0"> 
                                    <v-text-field 
                                        outline
                                        readonly
                                        label="East Longitude"
                                        v-model="$v.eastLongitude.$model"
                                        :error-messages="eastLongitudeErrors"
                                        @input="$v.eastLongitude.$touch()"
                                        @blur="$v.eastLongitude.$touch()"
                                        :loading="loading"
                                    /> 
                                </v-flex>
                                <v-flex xs12 sm8 offset-sm2 md4 offset-md4 class="py-0"> 
                                    <v-text-field 
                                        outline
                                        readonly
                                        label="South Latitude"
                                        v-model.trim="$v.southLatitude.$model"
                                        :error-messages="southLatitudeErrors"
                                        @input="$v.southLatitude.$touch()"
                                        @blur="$v.southLatitude.$touch()"
                                        :loading="loading"
                                    /> 
                                </v-flex>
                                <v-flex xs12>
                                    <v-select
                                        :items="landfireYears"
                                        label="Landfire Year"
                                        outline
                                        :error-messages="landfireYearErrors"
                                        v-model="$v.landfireYear.$model"
                                        :loading="loading"
                                    >
                                    </v-select>
                                </v-flex>
                                <v-flex xs12>
                                    <v-text-field
                                        label="Resolution"
                                        v-model.number="$v.resolution.$model"
                                        :error-messages="resolutionErrors"
                                        :loading="loading"
                                    /> 
                                </v-flex>
                                <v-flex xs12> 
                                    <v-select
                                        :items="fuelModelSets"
                                        label="Fuel Model"
                                        outline
                                        :error-messages="fuelModelErrors"
                                        v-model.number="$v.fuelModelType.$model"
                                        :loading="loading"
                                    >
                                    </v-select>
                                </v-flex>
                                <v-flex xs12>
                                    <v-text-field
                                        label="Edit Rules"
                                        v-model.trim="$v.editRules.$model"
                                        :error-messages="editRulesErrors"
                                        :loading="loading"
                                    /> 
                                </v-flex>
                                <v-flex xs12> 
                                    <v-switch 
                                        :label="`Generate Geotiff: ${generateGeotiff.toString()}`"
                                        v-model.trim="$v.generateGeotiff.$model"
                                        :error-messages="geotiffErrors"
                                        :loading="loading"
                                    ></v-switch>
                                </v-flex>
                                <v-flex xs12>
                                    <v-btn :loading="loading" type="submit" block class="primary" dark>Create Landscape</v-btn>
                                </v-flex>
                            </v-layout>
                        </v-container>
                    </v-form>
                </v-card-text> 
            </v-card>
        </v-flex>
    </v-layout>
</template>
<script>
import { API } from 'aws-amplify'
import LandscapeMap from "../../components/LandscapeMap";
// import  { LandscapeService }  from '../../../lib/msf'; 
const prettyPrint = require('code-prettify'); 
import { required, between} from 'vuelidate/lib/validators'
import { getValue } from '../../utils/helpers.js'
import empty from 'locutus/php/var/empty';

export default {
    name: "landscape-create",
    validations: function(){
        return { 
            westLongitude: { 
                required,
                between: between(-180, 180)
            },
            eastLongitude: { 
                required,
                between: between(-180, 180)
            },
            northLatitude: { 
                required,
                between: between(-90, 90)
            },
            southLatitude: { 
                required,
                between: between(-90, 90)
            },
            landfireYear: { 
                required
            },
            resolution: { 
                required
            },
            fuelModelType: { 
                required
            },
            editRules: { 
                required
            },
            generateGeotiff: { 
                required
            }
        };
    },
    components: {
        LandscapeMap
    },
    data() {
        return {
            loading: false,
            mapParams:{},
            show:false, 
            westLongitude: undefined,
            eastLongitude: undefined,
            northLatitude: undefined,
            southLatitude: undefined,
            landfireYears:[2014,2012],
            landfireYear:2014,
            resolution: 30,
            fuelModelSets:[13,40],
            fuelModelType: 40,
            editRules: "JSON",
            generateGeotiff: true,
            acres:undefined,
            maxSizeLimit:10000,
            codePanel:'nodejs',
        };
    },
    filters:{
        formatNumber(val){
            if(!isNaN(val)){
                return val.toLocaleString(undefined, {maximumFractionDigits:2});
            }
        },
        
    },
    mounted: function() {
        var vm = this;
        this.$nextTick(function() {
            prettyPrint.prettyPrint();
 
        });
    },
    watch:{
        mapParams(data,oldVal){
            console.log(data,oldVal);
            this.eastLongitude = this.reduceDecimal(getValue(data.extent,'xmax'));
            this.westLongitude = this.reduceDecimal(getValue(data.extent,'xmin'));
            this.northLatitude = this.reduceDecimal(getValue(data.extent,'ymax'));
            this.southLatitude = this.reduceDecimal(getValue(data.extent,'ymin'));
            this.acres = Math.round(getValue(data,'acres',0));  
        }
    },
    computed:{ 
        acresError(){
            return (this.acres > this.maxSizeLimit);
        },
        westLongitudeErrors () {
            const errors = []
            if (!this.$v.westLongitude.$dirty) {
                return errors;
            }
            if (!this.$v.westLongitude.required) {  
                errors.push('West Longitude is required');
            } 
            if (!this.$v.westLongitude.between) {  
                errors.push('West Longitude has to be between -180 and 180');
            }
            return errors
        },
        eastLongitudeErrors () {
            const errors = []
            if (!this.$v.eastLongitude.$dirty) {
                return errors;
            }
            if (!this.$v.eastLongitude.required) {  
                errors.push('East Longitude is required');
            } 
            if (!this.$v.eastLongitude.between) {  
                errors.push('East Longitude has to be between -180 and 180');
            }
            return errors
        },
        northLatitudeErrors () {
            const errors = []
            if (!this.$v.northLatitude.$dirty) {
                return errors;
            }
            if (!this.$v.northLatitude.required) {  
                errors.push('North Latitude is required');
            } 
            if (!this.$v.northLatitude.between) {  
                errors.push('North Latitude has to be between -90 and 90');
            }
            return errors
        },
        southLatitudeErrors () {
            const errors = []
            if (!this.$v.southLatitude.$dirty) {
                return errors;
            }
            if (!this.$v.southLatitude.required) {  
                errors.push('South Latitude is required');
            } 
            if (!this.$v.southLatitude.between) {  
                errors.push('South Latitude has to be between -90 and 90');
            }
            return errors
        },
        landfireYearErrors () {
            const errors = []
            if (!this.$v.landfireYear.$dirty) {
                return errors;
            }
            if (!this.$v.landfireYear.required) {  
                errors.push('Landfire year is required');
            }  
            return errors
        },
        resolutionErrors () {
            const errors = []
            if (!this.$v.resolution.$dirty) {
                return errors;
            }
            if (!this.$v.resolution.required) {  
                errors.push('Resolution is required');
            }  
            return errors
        },
        fuelModelErrors () {
            const errors = []
            if (!this.$v.fuelModelType.$dirty) {
                return errors;
            }
            if (!this.$v.fuelModelType.required) {  
                errors.push('Landfire year is required');
            }  
            return errors
        },
        editRulesErrors () {
            const errors = []
            if (!this.$v.editRules.$dirty) {
                return errors;
            }
            if (!this.$v.editRules.required) {  
                errors.push('Edit Rules are required');
            }  
            return errors
        },
        geotiffErrors () {
            const errors = []
            if (!this.$v.generateGeotiff.$dirty) {
                return errors;
            }
            if (!this.$v.generateGeotiff.required) {  
                errors.push('Geotiff Boolean is required');
            }  
            return errors
        },

    },
    methods: {
        reduceDecimal(val,places){
            if(!isNaN(val)){
                places = places == undefined ? 4 : places;
                return Number.parseFloat(val).toFixed(places); 
            }
        },
        updateMapParams(data){
            this.mapParams = data;
        },
        clear () {
            this.$v.$reset() 
        }, 
        onSubmit($v){
            var vm = this;
            $v.$touch();
            if(!$v.$error && !this.acresError){
                if(empty(localStorage.getItem('username')) || empty(localStorage.getItem('password'))){
                    this.$store.commit('setCredentialDialog', true);
                    console.log('No Credentials');
                    return false;
                }
                this.loading = true; 
                var creds = { 
                    username : localStorage.getItem('username'),
                    password : localStorage.getItem('password')
                }
                console.log(creds);
                var landscapePayload = { 
                    westLongitude: this.westLongitude,
                    eastLongitude: this.eastLongitude,
                    northLatitude: this.northLatitude,
                    southLatitude: this.southLatitude,
                    landfireYear: this.landfireYear,
                    resolution: this.resolution,
                    fuelModelType: this.fuelModelType,
                    editRules: this.editRules,
                    generateGeotiff: this.generateGeotiff
                };

                let apiName = 'fireModelingServiceTut';
                let path = '/landscape/create'; 
                let myInit = { // OPTIONAL
                    headers: {}, // OPTIONAL
                    response: false, // OPTIONAL (return the entire Axios response object instead of only response.data)
                    body:landscapePayload,
                    queryStringParameters: creds
                }
                console.log(myInit);
                API.post(apiName, path, myInit)
                .then(response => {
                    // Add your code here
                    console.log('Amplify',response, response.status); 
                    // if(resposne.status == )
                    /* 
                        entityId: 5300
                        includesWarningOrInfo: false
                        msgCollector: null
                        multipleResponseMsgs: false
                        queued: false
                        responseMessage: "Request to create landscape with ID 5300 has been submitted"
                        success: true
                    */
                    vm.loading = false;
                })
                .catch(error => {
                    console.log(error.response);
                    vm.loading = false;
                })


                // LandscapeService.create(landscapePayload)
                // .then(response => console.log(response))
                // .catch(errors => console.log(errors));


                // this.loading = false;
                console.log('submit successfull');
            }else{ 
                this.loading = false;
                 console.log('submit unsuccessfull');
            }
        }
    }
};
</script>