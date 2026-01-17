require([
  "esri/Map", "esri/views/MapView", "esri/layers/FeatureLayer",
  "esri/widgets/Editor", "esri/widgets/FeatureTable",
  "esri/widgets/LayerList", "esri/widgets/Expand",
  "esri/geometry/geometryEngine", "esri/geometry/support/geodesicUtils",
  "esri/geometry/projection", "esri/Graphic"
], function (Map, MapView, FeatureLayer, Editor, FeatureTable, LayerList, Expand, geometryEngine, geodesicUtils, projection, Graphic) {

  const map = new Map({ basemap: "dark-gray-vector" });
  const view = new MapView({
    container: "mapView",
    map: map,
    center: [31.2357, 30.0444],
    zoom: 12
  });

  let editor, featureTable, currentLayer;
  let layerCounter = 0;

  let fields = [
    { name: "ObjectID", type: "oid" },
    { name: "Name", type: "string", editable: true }
  ];

  const layerList = new LayerList({
    view: view,
    listItemCreatedFunction: function (event) {
      const item = event.item;
      item.actionsSections = [[
        {
          title: "Open Attribute Table",
          className: "esri-icon-table",
          id: "open-table"
        }
      ]];
    }
  });

  layerList.on("trigger-action", function (event) {
    if (event.action && event.action.id === "open-table") {
      updateFeatureTable(event.item.layer);
    }
  });

  view.ui.add(new Expand({
    view: view,
    content: layerList,
    expandIconClass: "esri-icon-layers"
  }), "top-left");

  // Refresh dropdowns for Target & Clipper
  function updateDropdowns() {
    const layers = map.layers.items.filter(l => l.type === "feature");

    const targetSelect = document.getElementById("targetLayer");
    const clipperSelect = document.getElementById("clipperLayer");

    targetSelect.innerHTML = '<option value="">Target Layer</option>';
    clipperSelect.innerHTML = '<option value="">Clipper (Polygon)</option>';

    layers.forEach(layer => {
      targetSelect.innerHTML += `<option value="${layer.id}">${layer.title}</option>`;
      if (layer.geometryType === "polygon") {
        clipperSelect.innerHTML += `<option value="${layer.id}">${layer.title}</option>`;
      }
    });
  }

  function updateFeatureTable(layer) {
    document.getElementById("tableContainer").style.display = "flex";
    document.getElementById("activeLayerTitle").innerText = layer.title.toUpperCase();

    if (!featureTable) {
      featureTable = new FeatureTable({
        view: view,
        layer: layer,
        container: "tableDiv",
        editingEnabled: true,
        highlightEnabled: true
      });
    } else {
      featureTable.layer = layer;
    }
  }

  document.getElementById("toggleTableBtn").onclick = function () {
    const container = document.getElementById("tableContainer");
    container.style.display = (container.style.display === "none") ? "flex" : "none";
  };

  document.getElementById("selectValue").onchange = function (e) {
    const geometryType = e.target.value;
    if (!geometryType) return;

    currentLayer = new FeatureLayer({
      source: [],
      title: geometryType.toUpperCase() + " Collection " + (++layerCounter),
      objectIdField: "ObjectID",
      fields: [...fields],
      geometryType: geometryType,
      spatialReference: { wkid: 3857 },
      renderer: getRenderer(geometryType),
      editingEnabled: true
    });

    map.add(currentLayer);
    updateFeatureTable(currentLayer);
    updateDropdowns(); // Refresh dropdowns after adding layer

    if (!editor) {
      editor = new Editor({ view: view });
      view.ui.add(editor, "top-right");
    }

    currentLayer.on("edits", (event) => {
      if (featureTable && featureTable.layer === currentLayer) {
        featureTable.refresh();

        setTimeout(() => {
          const rowCount = featureTable.rows.length;
          if (rowCount > 0) {
            featureTable.scrollToRow(rowCount - 1); // Scroll to newest row
          }
        }, 300);
      }
    });
  };

  function getRenderer(type) {
    let symbol;
    if (type === "point")
      symbol = { type: "simple-marker", color: "#6366f1", outline: { color: "white", width: 1 } };
    if (type === "polyline")
      symbol = { type: "simple-line", color: "#a855f7", width: 3 };
    if (type === "polygon")
      symbol = { type: "simple-fill", color: [168, 85, 247, 0.3], outline: { color: "white", width: 1 } };

    return { type: "simple", symbol: symbol };
  }

  // ============================================================================
  // Analysis Tools (now fully working)
  // ============================================================================

  document.getElementById("distanceBtn").onclick = function() {
    alert("Click two points on the map");

    let points = [];

    const handler = view.on("click", function(ev) {
      points.push(ev.mapPoint);

      if (points.length === 2) {
        const distance = geometryEngine.distance(points[0], points[1], "meters");
        alert("Distance: " + distance.toFixed(2) + " meters");
        handler.remove();
      }
    });
  };

  document.getElementById("bufferBtn").onclick = async function() {
    if (!currentLayer || !featureTable) {
      alert("Create layer and open table first");
      return;
    }

    const dist = Number(document.getElementById("bufferDistance").value);
    if (!dist || dist <= 0) {
      alert("Enter valid buffer distance");
      return;
    }

    const selectedIds = featureTable.highlightIds || [];
    if (selectedIds.length === 0) {
      alert("Select features in table first (click rows to highlight)");
      return;
    }

    try {
      const query = currentLayer.createQuery();
      query.objectIds = selectedIds;
      query.returnGeometry = true;

      const result = await currentLayer.queryFeatures(query);
      const features = result.features;

      const bufferGraphics = [];

      features.forEach(f => {
        if (f.geometry) {
          const bufferGeom = geometryEngine.buffer(f.geometry, dist, "meters");
          if (bufferGeom) {
            bufferGraphics.push(new Graphic({
              geometry: bufferGeom,
              attributes: { Name: `Buffer ${dist}m` }
            }));
          }
        }
      });

      if (bufferGraphics.length === 0) {
        alert("No valid geometry to buffer");
        return;
      }

      const bufferLayer = new FeatureLayer({
        title: `Buffer ${dist}m`,
        source: bufferGraphics,
        objectIdField: "ObjectID",
        fields: [{ name: "ObjectID", type: "oid" }, { name: "Name", type: "string" }],
        geometryType: "polygon",
        spatialReference: { wkid: 3857 },
        renderer: { type: "simple", symbol: { type: "simple-fill", color: [255, 99, 71, 0.4] } },
        editingEnabled: true
      });

      map.add(bufferLayer);
      updateDropdowns(); // Refresh dropdowns after buffer
      alert(`Buffer created (${bufferGraphics.length} features)`);

    } catch (err) {
      alert("Buffer failed - check console");
      console.error(err);
    }
  };

  document.getElementById("clipBtn").onclick = async function() {
    const targetId = document.getElementById("targetLayer").value;
    const clipperId = document.getElementById("clipperLayer").value;

    if (!targetId || !clipperId) {
      alert("Please select both Target Layer and Clipper Layer");
      return;
    }

    const target = map.findLayerById(targetId);
    const clipper = map.findLayerById(clipperId);

    if (!target || !clipper) {
      alert("One or both layers not found");
      return;
    }

    try {
      // Get clipper geometry (union all)
      const clipQ = clipper.createQuery();
      clipQ.where = "1=1";
      clipQ.returnGeometry = true;
      const clipResult = await clipper.queryFeatures(clipQ);

      if (clipResult.features.length === 0) {
        alert("Clipper layer is empty");
        return;
      }

      let clipGeom = clipResult.features[0].geometry;
      for (let i = 1; i < clipResult.features.length; i++) {
        clipGeom = geometryEngine.union(clipGeom, clipResult.features[i].geometry);
      }

      // Get target features
      const targetQ = target.createQuery();
      targetQ.where = "1=1";
      targetQ.returnGeometry = true;
      const targetResult = await target.queryFeatures(targetQ);

      const clippedGraphics = [];

      targetResult.features.forEach(f => {
        if (f.geometry) {
          const clipped = geometryEngine.intersect(f.geometry, clipGeom);
          if (clipped) {
            clippedGraphics.push(new Graphic({
              geometry: clipped,
              attributes: { Name: "Clipped Feature" }
            }));
          }
        }
      });

      if (clippedGraphics.length === 0) {
        alert("No features were clipped");
        return;
      }

      const clipLayer = new FeatureLayer({
        title: "Clip Result",
        source: clippedGraphics,
        objectIdField: "ObjectID",
        fields: [{ name: "ObjectID", type: "oid" }, { name: "Name", type: "string" }],
        geometryType: "polygon",
        spatialReference: { wkid: 3857 },
        renderer: { type: "simple", symbol: { type: "simple-fill", color: [100, 255, 100, 0.4] } },
        editingEnabled: true
      });

      map.add(clipLayer);
      updateDropdowns(); // Refresh dropdowns after clip
      alert(`Clip completed (${clippedGraphics.length} features)`);

    } catch (err) {
      alert("Clip failed - check console");
      console.error(err);
    }
  };

  // Auto-update dropdowns when layers change
  map.layers.on("change", updateDropdowns);
  updateDropdowns(); // Initial call

});