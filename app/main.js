var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
define(["require", "exports", "esri/Map", "esri/views/SceneView"], function (require, exports, Map_1, SceneView_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    Map_1 = __importDefault(Map_1);
    SceneView_1 = __importDefault(SceneView_1);
    var map = new Map_1.default({
        basemap: "topo"
    });
    var view = new SceneView_1.default({
        map: map,
        container: "viewDiv"
    });
});
//# sourceMappingURL=main.js.map