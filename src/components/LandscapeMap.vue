<style lang="scss" scoped>
#viewDiv {
    height: 100%;
    width: 100%;
    background: lightblue;
    .esri-widget--button{
        border: 1px solid grey;
    }
}
</style> 
<template>
    <div id="viewDiv">
        <v-flex id="toolbar" class="d-flex">
            <div
                id="line-button"
                class="esri-widget esri-widget--button esri-interactive"
                title="Draw polygon"
            >
                <span class="esri-icon-polygon"></span>
            </div>

            <div
                id="clear-button"
                class="esri-widget esri-widget--button esri-interactive"
                title="Clear polygon"
            >
                <span class="esri-icon-trash"></span>
            </div>
        </v-flex>
    </div>
</template>
<script>
import { loadModules } from "esri-loader";

export default {
    name: "landscape-map",
    props: {
        areaType: {
            type: String,
            default:'acres'
        }
    },
    data() {
        return {
            polyExtent: {},
            polyArea: undefined
        };
    },
    created() {},
    mounted: function() {
        var vm = this;
        this.$nextTick(function() {
            vm.$store.state.maploadScriptPromise
                .then(() => {
                    // you can now load the map modules and create the map
                    // by using loadModules()
                    console.log("Arc Map Ready");
                    vm.loadMap();
                })
                .catch(err => {
                    // handle any script loading errors
                    console.error(err);
                });
        });
    },
    watch:{
        mapData(newVal,oldVal){
            this.$emit('update',newVal);
        }
    },
    computed: {
        mapData(){
            return {
                extent: this.polyExtent,
                acres: this.polyArea
            };
        }
    },
    methods: {
        resetParams() {
            this.polyExtent = undefined;
            this.polyArea = undefined;
        },
        loadMap() {
            var vm = this;
            // first, we use Dojo's loader to require the map class
            loadModules([
                "esri/Map",
                "esri/views/MapView",
                "esri/widgets/Locate",
                "esri/layers/GraphicsLayer",
                "esri/widgets/Sketch",
                "esri/geometry/support/webMercatorUtils",
                "esri/views/2d/draw/Draw",
                "esri/Graphic",
                "esri/geometry/Polygon",
                "esri/geometry/geometryEngine"
            ])
                .then(
                    ([
                        Map,
                        MapView,
                        Locate,
                        GraphicsLayer,
                        Sketch,
                        webMercatorUtils,
                        Draw,
                        Graphic,
                        Polygon,
                        geometryEngine
                    ]) => {
                        console.log("loading Map.....");
                        const layer = new GraphicsLayer();
                        var map = new Map({
                            basemap: "streets",
                            layers: [layer]
                        });
                        var view = new MapView({
                            container: "viewDiv",
                            map: map,
                            zoom: 6,
                            center: [-84.32, 32.23]
                        });
                        var locateBtn = new Locate({
                            view: view
                        });

                        // Add the locate widget to the top left corner of the view
                        view.ui.add(locateBtn, {
                            position: "top-left"
                        });
                        view.ui.add("toolbar", "top-right");
                        
                        const sketch = new Sketch({
                            layer: layer,
                            view: view
                        });

                        document.getElementById(
                            "clear-button"
                        ).onclick = function() {
                            sketch.viewModel.layer.removeAll();
                            vm.resetParams();
                        }
                        // draw polyline button
                        // https://codepen.io/anon/pen/YRBXOo?editors=1000
                        document.getElementById(
                            "line-button"
                        ).onclick = function() {
                            sketch.viewModel.layer.removeAll();
                            vm.resetParams();
                            sketch.create("rectangle");
                            sketch.on("create", function(event) {
                                if (event.state == "complete") {
                                    setExtent(event.graphic.geometry);
                                }
                            });
                            sketch.on("update", function(event) {
                                if (event.state == "complete") {
                                    setExtent(  event.graphics[0].geometry);
                                }
                            });
                        };
                        function setExtent(geometry) {
                            // console.log(geometry);
                            vm.polyExtent = webMercatorUtils
                                .webMercatorToGeographic(geometry.extent)
                                .toJSON();
                            vm.polyArea = geometryEngine.geodesicArea(
                                geometry,
                                vm.areaType
                            );
                            if (vm.polyArea < 0) {
                                // simplify the polygon if needed and calculate the area again
                                var simplifiedPolygon = geometryEngine.simplify(
                                    geometry
                                );
                                if (simplifiedPolygon) {
                                    vm.polyArea = geometryEngine.geodesicArea(
                                        simplifiedPolygon,
                                        vm.areaType
                                    );
                                }
                            }
                            // console.log(vm.polyExtent, vm.polyAcres);
                        }
                    }
                )
                .catch(err => {
                    // handle any errors
                    console.error(err);
                });
        }
    }
};
</script>