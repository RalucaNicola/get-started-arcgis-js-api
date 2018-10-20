import Map from "esri/Map";
import SceneView from "esri/views/SceneView";

import FeatureLayer from "esri/layers/FeatureLayer";
import { Point } from "esri/geometry";
import UniqueValueRenderer from "esri/renderers/UniqueValueRenderer";
import { PointSymbol3D, ObjectSymbol3DLayer } from "esri/symbols";

import esriRequest = require("esri/request");
import esri = __esri;

const dataUrl = "./data/locations.json";

const map = new Map({
  basemap: "topo"
});

const view = new SceneView({
  map,
  container: "viewDiv"
});


// Step 3: Add location points as GeoJSON

getData()
  .then(getGraphics)
  .then(getLayer)
  .then((layer) => {
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
        location: feature.properties.city
      }
    };
  });
}


const fields = [{
  name: "ObjectID",
  alias: "ObjectID",
  type: "oid"
},
{
  name: "location",
  alias: "location",
  type: "string"
}];

const colorPalette = ["#FFFFFF", "#F78D99", "#ffc700", "#27004D", "#005892", "#E5211D", "#198E2B", "#f4a142", "#fc8879", "#fcec78", "#8de8b1", "#8dcfe8", "#8d8ee8", "#c88de8"];

const uniqueValueInfos = colorPalette.map((color: string, index: number) => {
  return {
    value: index,
    symbol: new PointSymbol3D({
      symbolLayers: [new ObjectSymbol3DLayer({
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

function getLayer(source: esri.Collection<esri.Graphic>) {

  const layer = new FeatureLayer({
    source,
    fields,
    renderer: renderer,
    objectIdField: "ObjectID"
  });

  return layer;
}
