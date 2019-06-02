/* eslint-disable no-console */
import Vue from "vue";
import Vuex from "vuex";
Vue.use(Vuex);

export default new Vuex.Store({
	state: {
		maploadScriptPromise: null, 
        credentials:{
            dialog:false,
            isNew:true,
            id:undefined,
			username:null,
			password: null,
        },
	},
	mutations: {
		mapLoadScriptPromise(state, obj) {
			state.maploadScriptPromise = obj;
			console.log(state);
		}, 
        setCredentialDialog(state,status){
            state.credentials.dialog  = status;
		}
	},
	actions: {},
	getters: { 
        getCredentialForm: function(state){
            return state.credentials.dialog;
		}
	}
});
