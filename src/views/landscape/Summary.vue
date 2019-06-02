<style lang="scss" scoped>
</style>
<template>
    <v-container fill-height>
        <v-layout justify-center>
            <v-flex xs12>
                <h1 class="text-uppercase">{{ $options.name }}</h1>

                <v-btn :to="{path:'/landscape/create'}">Create </v-btn>


                 <v-data-table
                        :headers="headers"
                        :items="tableData"
                        class="elevation-1" >
                    <template v-slot:items="props">
                        <td>{{ props.item.entityId }}</td> 
                        <td>{{ props.item.status }}</td> 
                        <td>{{ props.item.queued }}</td> 
                        <td>{{ props.item.expiration }}</td>  
                        <td>
                            <div>
                                <v-tooltip top>
                                    <template v-slot:activator="{ on }">
                                        <v-btn v-show="props.item.status != 'comp' && props.item.status != 'fail'"  :loading="refreshLoader[props.item.entityId]" v-on="on" color="primary" @click="refresh(props.item.entityId)" fab small dark>
                                            <v-icon>cached</v-icon>
                                        </v-btn>
                                    </template>
                                    <span>Refresh</span>
                                </v-tooltip> 
                                <v-tooltip top >
                                    <template v-slot:activator="{ on }">
                                        <v-btn v-show="props.item.status == 'comp'"  v-on="on" color="primary" @click="download(props.item.entityId)" fab small dark>
                                            <v-icon>save_alt</v-icon> 
                                        </v-btn>
                                    </template>
                                    <span>Download</span>
                                </v-tooltip> 
                                <v-tooltip top>
                                    <template v-slot:activator="{ on }">
                                        <v-btn  v-on="on" color="primary" @click="deleteLandscape(props.item.entityId)" fab small dark>
                                            <v-icon>delete_forever</v-icon> 
                                        </v-btn>
                                    </template>
                                    <span>Delete</span>
                                </v-tooltip> 
                            </div>
                            
                        </td> 
                    </template>
                </v-data-table>
                <!-- <pre>{{ landscapes }}</pre> -->
            </v-flex>
        </v-layout>
    </v-container>
</template>
<script>
import { API } from 'aws-amplify'
import { landscapeStorage } from '../../utils/storageHelpers.js'

export default {
    name: "landscape-summary",
    data() {
        return {
            landscapes:{},
            headers: [
                { text: 'Landscape Id',value: 'entityId'},
                { text: 'Status', value: 'status' },
                { text: 'Queued', value: 'queued' },
                { text: 'Expiration Date', value: 'expiration' },
                { text: 'Actions', value: 'actions',sortable:false,align:'right' },
            ],
            refreshLoader: {}, 
        };
    },
    created: function(){
        this.refreshLandscapes();
    },
    mounted: function() {
        var vm = this;
        this.$nextTick(function() {
            // vm.getStatus(5110); 
        });
    }, 
    computed:{ 
        tableData(){
            var list = [];
            for (const entityId in this.landscapes) {
                if (this.landscapes.hasOwnProperty(entityId)) {
                    this.refreshLoader[entityId] = false; 
                    const element = this.landscapes[entityId];
                    
                    var data = Object.assign(element,{
                        status: (element.hasOwnProperty('status')) ? element.status : 'Not Set',
                        expiration : (element.hasOwnProperty('expiration')) ? element.expiration : 'Not Set'
                    });

                    list.push(data);
                }
            }
            return list;
        }
    },
    methods: {
        refreshLandscapes(){
            this.landscapes = landscapeStorage.getLandscapes();
        },
        refresh(id){
            var vm = this;
            this.refreshLoader[id] = true;
            let apiName = 'fireModelingServiceTut';
            let path = '/landscape'; 
            let myInit = { // OPTIONAL
                headers: {}, // OPTIONAL
                response: false, // OPTIONAL (return the entire Axios response object instead of only response.data)
                queryStringParameters: {  // OPTIONAL
                    id: id,
                    username: localStorage.username,
                    password: localStorage.password
                }
            }
            API.get(apiName, path, myInit)
            .then(response => { 
                // Get Current Landscape Lists   
                if(landscapeStorage.updateLandscape(response)){
                    vm.refreshLandscapes();
                }
                console.log('Amplify',response); 
                vm.refreshLoader[id] = false;
            })
            .catch(error => {
                console.log(error);
                vm.refreshLoader[id] = false;
            })
        },
        download(id){ 
            var vm = this; 
            console.log('downloading file ..'+id); 
            let apiName = 'fireModelingServiceTut';
            let path = '/landscape/download'; 
            let myInit = { // OPTIONAL
                headers: {}, // OPTIONAL
                response: false, // OPTIONAL (return the entire Axios response object instead of only response.data)
                queryStringParameters: {  // OPTIONAL
                    id: id,
                    type: 'lcp',
                    username: localStorage.username,
                    password: localStorage.password
                }
            }
            API.get(apiName, path, myInit)
            .then(response => {  
                console.log('Amplify',response.Location);  
                this.downloadZip(response.Location,id);
                this.$nextTick(function() { 
 
                });
            })
            .catch(error => {
                console.log(error); 
            })
        },
        deleteLandscape(id){
            landscapeStorage.delete(id);
            this.refreshLandscapes();
        },
        downloadZip(url,id){
            var vm = this;
            this.$http.get(url,{
                responseType: 'arraybuffer'
            }).then(function(response) {  
                var filename = url.substring(url.lastIndexOf('/')+1);
                let blob = new Blob([response.data], { type: 'application/zip' });
                let link = document.createElement('a');
                link.href = window.URL.createObjectURL(blob);
                link.download = filename; 
                link.click();
            })

        }
    }
};
</script>