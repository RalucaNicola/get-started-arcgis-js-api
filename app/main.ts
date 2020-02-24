import Map from "esri/Map";
import SceneView from "esri/views/SceneView";

import FeatureLayer from "esri/layers/FeatureLayer";
import VectorTileLayer from "esri/layers/VectorTileLayer";
import { Point } from "esri/geometry";
import UniqueValueRenderer from "esri/renderers/UniqueValueRenderer";
import { PointSymbol3D, ObjectSymbol3DLayer, LabelSymbol3D, TextSymbol3DLayer } from "esri/symbols";
import LabelClass = require("esri/layers/support/LabelClass");
import Basemap from "esri/Basemap";

import esriRequest = require("esri/request");
import esri = __esri;

const dataUrl = "./data/locations.json";

const map = new Map({
  ground: {
    surfaceColor: "#fff"
  }
});

function getBaseLayer() {
  const baseLayer = new VectorTileLayer({
    url: "https://basemaps.arcgis.com/arcgis/rest/services/World_Basemap_v2/VectorTileServer"
  });

  return esriRequest("./data/basemap-style.json").then(result => {
    baseLayer.loadStyle(result.data);
    return baseLayer;
  });
}

getBaseLayer().then(baseLayer => {
  map.basemap = new Basemap({
    baseLayers: [baseLayer]
  });
});

const view = new SceneView({
  map,
  container: "viewDiv",
  alphaCompositingEnabled: true,
  qualityProfile: "high",
  camera: {
    position: {
      spatialReference: {
        wkid: 4326
      },
      x: 94.28248677690586,
      y: 21.553684553226123,
      z: 25000000
    },
    heading: 0,
    tilt: 0.12089379039103153
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

getData()
  .then(getGraphics)
  .then(getLayer)
  .then(layer => {
    map.add(layer);
  });

function getData() {
  return esriRequest(dataUrl, {
    responseType: "json"
  });
}

function getGraphics(response: esri.RequestResponse) {
  const geoJson = response.data;
  return geoJson.features.map((feature: any, i: number) => {
    return {
      geometry: new Point({
        x: feature.geometry.coordinates[0],
        y: feature.geometry.coordinates[1]
      }),
      attributes: {
        ObjectID: i,
        location: feature.properties.location
      }
    };
  });
}

const fields = [
  {
    name: "ObjectID",
    alias: "ObjectID",
    type: "oid"
  },
  {
    name: "location",
    alias: "location",
    type: "string"
  }
];

const colorPalette = [
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

const uniqueValueInfos = colorPalette.map((color: string, index: number) => {
  return {
    value: index,
    symbol: new PointSymbol3D({
      symbolLayers: [
        new ObjectSymbol3DLayer({
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
        type: "line", // autocasts as new LineCallout3D()
        size: 1.5,
        color: "#555"
      }
    })
  };
});

const renderer = new UniqueValueRenderer({
  valueExpression: `$feature.ObjectID % ${colorPalette.length}`,
  uniqueValueInfos: uniqueValueInfos
});

const labelingInfo = [
  new LabelClass({
    labelExpressionInfo: { expression: "$feature.location" },
    symbol: new LabelSymbol3D({
      symbolLayers: [
        new TextSymbol3DLayer({
          material: { color: "#333" },
          size: 10,
          font: {
            weight: "bold"
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

function getLayer(source: esri.Collection<esri.Graphic>) {
  const layer = new FeatureLayer({
    source,
    fields,
    renderer: renderer,
    objectIdField: "ObjectID",
    labelingInfo
  });

  return layer;
}
