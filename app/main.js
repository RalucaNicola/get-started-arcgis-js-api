var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
define(["require", "exports", "esri/Map", "esri/views/SceneView", "esri/layers/VectorTileLayer", "esri/renderers/UniqueValueRenderer", "esri/symbols", "esri/layers/support/LabelClass", "esri/Basemap", "esri/request", "esri/layers/GeoJSONLayer"], function (require, exports, Map_1, SceneView_1, VectorTileLayer_1, UniqueValueRenderer_1, symbols_1, LabelClass, Basemap_1, esriRequest, GeoJSONLayer_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    Map_1 = __importDefault(Map_1);
    SceneView_1 = __importDefault(SceneView_1);
    VectorTileLayer_1 = __importDefault(VectorTileLayer_1);
    UniqueValueRenderer_1 = __importDefault(UniqueValueRenderer_1);
    Basemap_1 = __importDefault(Basemap_1);
    GeoJSONLayer_1 = __importDefault(GeoJSONLayer_1);
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
        return esriRequest("./data/basemap-style.json").then(function (result) {
            baseLayer.loadStyle(result.data);
            return baseLayer;
        });
    }
    getBaseLayer().then(function (baseLayer) {
        map.basemap = new Basemap_1.default({
            baseLayers: [baseLayer]
        });
    });
    var view = new SceneView_1.default({
        map: map,
        container: "viewDiv",
        alphaCompositingEnabled: true,
        qualityProfile: "high",
        camera: {
            position: {
                x: 86.66458348,
                y: 27.28839772,
                z: 20135210.66583
            },
            heading: 359.98,
            tilt: 0.15
        },
        environment: {
            background: {
                type: "color",
                color: [0, 0, 0, 0]
            },
            lighting: {
                date: "Sun Jul 15 2018 15:30:00 GMT+0900 (W. Europe Daylight Time)"
            },
            starsEnabled: false,
            atmosphereEnabled: false
        }
    });
    view.ui.empty("top-left");
    // Step 3: Add location points as GeoJSON
    var colorPalette = [
        "#FFFFFF",
        "#F78D99",
        "#ffc700",
        "#27004D",
        "#005892",
        "#E5211D",
        "#198E2B",
        "#f4a142",
        "#fc8879",
        "#fcec78",
        "#8de8b1",
        "#8dcfe8",
        "#8d8ee8",
        "#c88de8"
    ];
    var uniqueValueInfos = colorPalette.map(function (color, index) {
        return {
            value: index,
            symbol: new symbols_1.PointSymbol3D({
                symbolLayers: [
                    new symbols_1.ObjectSymbol3DLayer({
                        material: {
                            color: color
                        },
                        height: 150000,
                        width: 150000,
                        resource: { primitive: "sphere" }
                    })
                ],
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
    var labelingInfo = [
        new LabelClass({
            labelExpressionInfo: { expression: "$feature.location" },
            symbol: new symbols_1.LabelSymbol3D({
                symbolLayers: [
                    new symbols_1.TextSymbol3DLayer({
                        material: { color: "#333" },
                        size: 10,
                        font: {
                            family: "Permanent Marker"
                        },
                        halo: {
                            color: "white",
                            size: 1
                        }
                    })
                ]
            })
        })
    ];
    var locationsLayer = new GeoJSONLayer_1.default({
        url: dataUrl,
        renderer: renderer,
        labelingInfo: labelingInfo
    });
    map.add(locationsLayer);
});
//# sourceMappingURL=main.js.map