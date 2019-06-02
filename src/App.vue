<style lang="scss">
    @import './assets/css/msf-code.scss';
</style>
<style lang="scss" scoped> 
</style>

<template>
    <v-app id="inspire" :dark="darkTheme">
        <!-- NAV DRAWER -->
        <v-navigation-drawer
            :mini-variant="mini"
            v-model="drawer"
            hide-overlay
            clipped
            fixed
            app
            :dark="darkTheme"
        >
            <v-list dense>
                <v-list-tile
                    v-for="item in toolBarNavItems"
                    :key="item.text"
                    :to="item.to"
                    :href="item.href"
                    :class="item.class"
                    exact
                    ripple
                    dense
                >
                    <v-list-tile-action>
                        <v-icon>{{ item.icon }}</v-icon>
                    </v-list-tile-action>
                    <v-list-tile-content>
                        <v-list-tile-title>{{ item.text }}</v-list-tile-title>
                    </v-list-tile-content>
                </v-list-tile>
                <v-subheader>Services</v-subheader>
                <v-list-group
                    v-for="item in services"
                    :key="item.title"
                    v-model="item.active"
                    :prepend-icon="item.action"
                    no-action
                >
                    <template v-slot:activator>
                        <v-list-tile>
                            <v-list-tile-content>
                            <v-list-tile-title>{{ item.title }}</v-list-tile-title>
                            </v-list-tile-content>
                        </v-list-tile>
                    </template>

                    <v-list-tile
                        v-for="subItem in item.items"
                        :key="subItem.title"
                        :to="subItem.to"
                    >
                    <v-list-tile-content>
                        <v-list-tile-title>{{ subItem.title }}</v-list-tile-title>
                    </v-list-tile-content>

                    <v-list-tile-action>
                        <v-icon>{{ subItem.action }}</v-icon>
                    </v-list-tile-action>
                    </v-list-tile>
                </v-list-group>
 
                <v-list-tile class="pointer" @click="$store.commit('setCredentialDialog', true)">
                    <v-list-tile-action>
                        <v-icon>new_releases</v-icon>
                    </v-list-tile-action>
                    <v-list-tile-content>
                        <v-list-tile-title>Credentials</v-list-tile-title>
                    </v-list-tile-content> 
                </v-list-tile>
            </v-list>
        </v-navigation-drawer>

        <!-- NAV BAR -->
        <v-toolbar color="blue darken-3" height="75" dark dense fixed clipped-left app>
            <v-toolbar-side-icon class="text--white" @click.stop="drawer = !drawer"></v-toolbar-side-icon>
            <v-toolbar-title class="headline text-uppercase mr-5 align-center">
                <router-link to="/home" tag="span" class="pointer">
                    <span>Fire Modeling Service</span>
                </router-link>
            </v-toolbar-title>
            <v-spacer></v-spacer>
            <v-toolbar-items class="hidden-sm-and-down">
                <v-btn href="https://fire-modeling-services-framework-documentation.readthedocs.io" flat target="_blank">Documentation</v-btn>
                <v-btn href="https://github.com/WFMRDA/Fire-Modeling-Service-Tutorials" target="_blank" flat><v-icon small class="mr-2">fab fa-github</v-icon>Github</v-btn>
            </v-toolbar-items>
        </v-toolbar>

        <!-- Page Content -->
        <v-content class="container">
            <v-container fluid fill-height pa-0>
                <v-layout  column> 
                    <v-breadcrumbs :items="breadcrumbs"/>
                    <router-view></router-view>
                </v-layout>
            </v-container>
        </v-content>

        <v-dialog v-model="credentialForm" persistent  max-width="600px"> 

            <v-form v-on:submit.prevent="saveCreds($v)">
                <v-card>
                    <v-card-title>
                        <span class="headline">User Credentials</span>
                    </v-card-title>
                    <v-card-text>
                        <v-text-field 
                            label="Username"
                            v-model.trim="$v.username.$model"
                            :error-messages="nameErrors" 
                            type="text"
                            :loading=loading
                            @input="$v.username.$touch()"
                            @blur="$v.username.$touch()"
                        /> 
                        <v-text-field
                            v-model.trim="$v.password.$model"
                            :append-icon="show1 ? 'visibility' : 'visibility_off'"
                            :type="show1 ? 'text' : 'password'" 
                            label="Password"
                            hint="You must already have an account for this to work"
                            counter
                            @click:append="show1 = !show1"
                            :error-messages="passwordErrors" 
                        />
                    </v-card-text>

                    <v-card-actions> 
                        <v-btn color="red darken-1" @click="clearCredentials" flat >Clear Credentials</v-btn>
                        <v-spacer />
                        <v-btn color="blue darken-1" flat @click="$store.commit('setCredentialDialog', false)">Close</v-btn>
                        <v-btn type="submit" color="blue darken-1" flat >Save</v-btn>
                    </v-card-actions>
                </v-card>
            </v-form>
        </v-dialog>
    </v-app>
</template>

<script>
import { Auth } from "aws-amplify";
import { getValue } from "./utils/helpers.js";
import empty from "locutus/php/var/empty";
import { mapGetters } from "vuex";
import { loadCss } from 'esri-loader';
loadCss('https://js.arcgis.com/4.10/esri/css/main.css');
import { loadScript, loadModules } from 'esri-loader';
import { required  } from 'vuelidate/lib/validators'


export default {
    validations: function(){
        return {
            username: { required },
            password: { required },
        };
    },
    data: () => ({
        loading: false,
        show1: false,
        menu: false,
        drawer: true,
        mini: false,
        darkTheme: false,
        username: '',
        password:'',
        toolBarNavItems: [
            {
                icon: "account_balance",
                text: "Dashboard",
                to: { name: "home" }
            }
        ],
        services:[
            {
                action: '',
                title: "Landscape",
                active: true,
                items:[
                    {
                        title:"Summary",
                        to: "/landscape/summary",
                    },
                    {
                        title:"Create",
                        to: "/landscape/create",
                    },
                    {
                        title:"Edit",
                        to: "/landscape/edit",
                    },
                    {
                        title:"Upload",
                        to: "/landscape/upload",
                    },
                    {
                        title:"Retrieve",
                        to: "/landscape/retrieve",
                    },

                ]
            }
        ]
    }),
    created: function(){
        this.$store.commit('mapLoadScriptPromise',loadScript({
            url: 'https://js.arcgis.com/4.10/'
        }));
        this.refreshCreds();
    },
    mounted: function() {
        var vm = this;
        this.$nextTick(function() { 
        });
    },
    computed: {
        ...mapGetters({ 
            credentialForm: 'getCredentialForm', 
        }),
        nameErrors () {
            const errors = []
            if (!this.$v.username.$dirty) {
                return errors;
            }
            if (!this.$v.username.required) {  
                errors.push('Username required');
            }     
            return errors;
        },
        passwordErrors () {
            const errors = []
            if (!this.$v.password.$dirty) {
                return errors;
            }
            if (!this.$v.password.required) {  
                errors.push('Password required');
            }    
            return errors;
        },
        breadcrumbs() {
            // console.log('next',this.routeMeta);
            if (this.$route.name == "home") {
                return [];
            }
            var crumbList = [
                {
                    text: "Dashboard",
                    to: "/home"
                }
            ];
            var list = this.$route.matched;
            var l = list.length;
            for (let i = 0; i < l; i++) {
                var el = list[i];
                var meta = el.meta;
                var breadcrumb = getValue(meta, "breadcrumb");
                if (!empty(breadcrumb)) {
                    crumbList.push(breadcrumb);
                }
            }
            return crumbList;
        }
    },
    watch: {},
    methods: {
        refreshCreds(){
            this.username = localStorage.getItem('username');
            this.password = localStorage.getItem('password'); 
        },
        clearCredentials(){ 
			localStorage.removeItem('username');
			localStorage.removeItem('password'); 
            this.$store.commit('setCredentialDialog', false);
            this.refreshCreds();
        },
        saveCreds($v){ 
            var vm = this;
            this.loading = true;
            $v.$touch();
            if(!$v.$error){ 
                console.log('authentication passed'); 
                localStorage.setItem('username',this.username);
                localStorage.setItem('password',this.password);  
                this.$store.commit('setCredentialDialog', false);
                this.refreshCreds();
                this.loading = false;
            }else{ 
                console.log('authentication failed');
                this.loading = false;
            }
        }
    }
};
</script>