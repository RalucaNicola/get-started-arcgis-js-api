var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
define(["require", "exports", "esri/Map", "esri/views/SceneView", "esri/layers/FeatureLayer", "esri/layers/VectorTileLayer", "esri/geometry", "esri/renderers/UniqueValueRenderer", "esri/symbols", "esri/Basemap", "esri/request"], function (require, exports, Map_1, SceneView_1, FeatureLayer_1, VectorTileLayer_1, geometry_1, UniqueValueRenderer_1, symbols_1, Basemap_1, esriRequest) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    Map_1 = __importDefault(Map_1);
    SceneView_1 = __importDefault(SceneView_1);
    FeatureLayer_1 = __importDefault(FeatureLayer_1);
    VectorTileLayer_1 = __importDefault(VectorTileLayer_1);
    UniqueValueRenderer_1 = __importDefault(UniqueValueRenderer_1);
    Basemap_1 = __importDefault(Basemap_1);
    var dataUrl = "./data/locations.json";
    var map = new Map_1.default({
        ground: {
            surfaceColor: "#fff"
        }
    });
    function getBaseLayer() {
        var baseLayer = new VectorTileLayer_1.default({
            url: "https://basemaps.arcgis.com/arcgis/rest/services/World_Basemap_v2/VectorTileServer"
        });
        return esriRequest("./data/basemap-style.json")
            .then(function (result) {
            baseLayer.loadStyle(result.data);
            return baseLayer;
        });
    }
    getBaseLayer()
        .then(function (baseLayer) {
        map.basemap = new Basemap_1.default({
            baseLayers: [baseLayer]
        });
    });
    var view = new SceneView_1.default({
        map: map,
        container: "viewDiv"
    });
    // Step 3: Add location points as GeoJSON
    getData()
        .then(getGraphics)
        .then(getLayer)
        .then(function (layer) {
        map.add(layer);
    });
    function getData() {
        return esriRequest(dataUrl, {
            responseType: "json"
        });
    }
    function getGraphics(response) {
        var geoJson = response.data;
        return geoJson.features.map(function (feature, i) {
            return {
                geometry: new geometry_1.Point({
                    x: feature.geometry.coordinates[0],
                    y: feature.geometry.coordinates[1]
                }),
                attributes: {
                    ObjectID: i,
                    location: feature.properties.city
                }
            };
        });
    }
    var fields = [{
            name: "ObjectID",
            alias: "ObjectID",
            type: "oid"
        },
        {
            name: "location",
            alias: "location",
            type: "string"
        }];
    var colorPalette = ["#FFFFFF", "#F78D99", "#ffc700", "#27004D", "#005892", "#E5211D", "#198E2B", "#f4a142", "#fc8879", "#fcec78", "#8de8b1", "#8dcfe8", "#8d8ee8", "#c88de8"];
    var uniqueValueInfos = colorPalette.map(function (color, index) {
        return {
            value: index,
            symbol: new symbols_1.PointSymbol3D({
                symbolLayers: [new symbols_1.ObjectSymbol3DLayer({
                        material: {
                            color: color
                        },
                        height: 150000,
                        width: 150000,
                        resource: { primitive: "sphere" }
                    })],
                verticalOffset: {
                    screenLength: 40,
                    maxWorldLength: 10000000,
                    minWorldLength: 10000
                },
                callout: {
                    type: "line",
                    size: 1.5,
                    color: "#555"
                }
            })
        };
    });
    var renderer = new UniqueValueRenderer_1.default({
        valueExpression: "$feature.ObjectID % " + colorPalette.length,
        uniqueValueInfos: uniqueValueInfos
    });
    function getLayer(source) {
        var layer = new FeatureLayer_1.default({
            source: source,
            fields: fields,
            renderer: renderer,
            objectIdField: "ObjectID"
        });
        return layer;
    }
});
//# sourceMappingURL=main.js.map