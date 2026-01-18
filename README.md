# Mini GIS Pro - Spatial Analysis

## Description
This is a web-based GIS application built using the **Esri ArcGIS JavaScript SDK (4.28)**.  
It allows users to:

- Create point, line, and polygon layers dynamically.
- Add custom attributes/fields to layers.
- Display an interactive **attribute table** for editing and highlighting features.
- Perform **basic spatial analysis**:
  - Measure distance between two points.
  - Create buffers around selected features.
  - Clip one layer using another polygon layer.
- Manage layers using a **Layer List** widget integrated into an expandable UI.

The interface is fully **responsive** and styled with a modern dark theme.

---

## Features

1. **Layer Management**
   - Add layers dynamically (Point, Line, Polygon)
   - Name and customize fields
   - View and edit features via a feature table
   - Expandable Layer List widget

2. **Spatial Analysis Tools**
   - **Distance Measurement**: Click two points to measure geodesic distance
   - **Buffer**: Create buffers around selected features
   - **Clip**: Clip a target layer using a polygon layer

3. **UI Enhancements**
   - Modern dark-themed interface
   - Interactive popups for messages instead of default alerts
   - Responsive design for different screen sizes

---

## Technologies Used

- **HTML5 / CSS3 / JavaScript**
- **Esri ArcGIS JavaScript API v4.28**
- **Esri Widgets**: Editor, FeatureTable, LayerList, Expand
- **Geometry Engine**: For geodesic calculations and spatial analysis

---

## How to Run

1. Open `index.html` in a modern web browser (Chrome, Firefox, Edge).
2. Use the **Layer Selector** to create a new layer.
3. Add fields using the **Attributes** section.
4. Open the **Attribute Table** to view or edit features.
5. Use **Analysis Tools** to measure distance, create buffers, or clip layers.

---

## Notes

- This project demonstrates integration with **Esri ArcGIS JS SDK**.
- The spatial analysis tools are **beginner-friendly implementations**, expandable for more complex GIS tasks.
- Popups are used for better user experience instead of default browser alerts.

---

## Author

Developed by **[Moamen Mohamed]**  
Worked extensively with **Esri ArcGIS JavaScript SDK** to implement dynamic GIS layers, attribute editing, and spatial analysis features.

---

