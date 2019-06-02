import Vue from "vue";
import Router from "vue-router";
import Dashboard from "./views/Dashboard.vue";

Vue.use(Router);

export default new Router({
	mode: "history",
	base: process.env.BASE_URL,
	routes: [
		{
			path: "*",
			redirect: "/home"
		},
		{
			path: "/",
			redirect: "/home"
		},
		{
			path: "/home",
			name: "home",
			component: Dashboard
		},
		{
			path: "/about",
			name: "about",
			// route level code-splitting
			// this generates a separate chunk (about.[hash].js) for this route
			// which is lazy-loaded when the route is visited.
			component: () =>
				import(/* webpackChunkName: "about" */ "./views/About.vue")
		},
		{
			path: "/landscape/summary",
			name: "landscape-summary",
			component: () =>
				import(/* webpackChunkName: "landscape-summary" */ "./views/landscape/Summary.vue"),
			meta: {
				breadcrumb: {
					text: "Landscape Summary",
					to: "/landscape/summary"
				}
			}
		},
		{
			path: "/landscape/create",
			name: "landscape-create",
			component: () =>
				import(/* webpackChunkName: "landscape-create" */ "./views/landscape/Create.vue"),
			meta: {
				breadcrumb: {
					text: "Landscape Create",
					to: "/landscape/create"
				}
			}
		},
		{
			path: "/landscape/edit/:runId?",
			name: "landscape-edit",
			component: () =>
				import(/* webpackChunkName: "landscape-edit" */ "./views/landscape/Edit.vue"),
			meta: {
				breadcrumb: {
					text: "Landscape Edit",
					to: "/landscape/edit"
				}
			}
		},
		{
			path: "/landscape/upload",
			name: "landscape-upload",
			component: () =>
				import(/* webpackChunkName: "landscape-upload" */ "./views/landscape/Upload.vue"),
			meta: {
				breadcrumb: {
					text: "Landscape Upload",
					to: "/landscape/upload"
				}
			}
		},
		{
			path: "/landscape/retrieve",
			name: "landscape-retrieve",
			component: () =>
				import(/* webpackChunkName: "landscape-retrieve" */ "./views/landscape/Retrieve.vue"),
			meta: {
				breadcrumb: {
					text: "Landscape Retrieve",
					to: "/landscape/retrieve"
				}
			}
		}
	]
});
