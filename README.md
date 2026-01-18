# Mini GIS  - Spatial Analysis
A simple, beautiful web-based GIS (Geographic Information System) tool  
Built with ArcGIS JavaScript API 4.28

## What is this app?
This is a **mini GIS application** that runs directly in your browser (no installation needed).  
You can:
- Create different types of map layers (points, lines, polygons)
- Draw shapes on the satellite map
- Edit and see attributes in a table
- Use basic analysis tools (measure distance, buffer, clip)

It's perfect for beginners who want to learn GIS or make quick maps.

## Features (What you can do)
- **Create Layers**  
  Choose Point, Line, or Polygon → a new editable layer appears on the map

- **Draw & Edit**  
  Use the Editor tool (top-right) to draw shapes  
  Click shapes to edit/move/delete them

- **Attributes Table**  
  Click "Table" button → see and edit feature information  
  Table appears at the bottom of the screen

- **Analysis Tools** (in the top bar):
  - **Distance**: Click two points → see distance in meters
  - **Buffer**: Enter distance → (placeholder - select features in table first)
  - **Clip**: Select two layers → (placeholder - real clip can be added later)

## How to Use (Step by Step for Beginners)
1. Open the file in any web browser (Chrome, Firefox, Edge...)
2. On the top bar:
   - Choose layer type (Point / Line / Polygon) from the first dropdown
3. A new layer appears on the map
4. Click the pencil icon (top-right) to start drawing
5. Draw your shapes on the map
6. Click "Table" button → see your drawn features in a nice table
7. Click rows in table to select/highlight features
8. Try the tools:
   - Distance: Click two places
   - Buffer & Clip: Select layers/features first (tools show messages for now)

## Technologies Used (Simple Explanation)
- **HTML + CSS**: Makes the beautiful dark interface
- **ArcGIS JavaScript API 4.28**: The magic that creates the map, layers, drawing, and analysis
- **Google Fonts & Material Symbols**: Nice text and icons

## How to Run
Just double-click the HTML file — it works offline!  
(No server needed)

## Future Ideas (Easy Improvements)
- Make Buffer actually create buffer shapes around selected features
- Make Clip really cut one layer using another

Enjoy mapping! 🗺️✨
