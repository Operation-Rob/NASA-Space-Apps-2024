"use client"

// components/VectorTileLayer.tsx
import { useEffect } from 'react';
import { useMap } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet.vectorgrid'; // Important: Import the plugin

const VectorTileLayer = () => {
    const map = useMap();
  
    useEffect(() => {
      const vectorTileOptions = {
        rendererFactory: L.canvas.tile,
        maxNativeZoom: 14,
        attribution: '&copy; Tileserver - Landsat Data',
        vectorTileLayerStyles: {
          // Adjust 'layerName' to match the actual layer in your tileset
          layerName: {
            weight: 1,
            color: '#000000',
            opacity: 1,
            fill: true,
            fillColor: '#ffffff',
            fillOpacity: 0.4,
          },
        },
      };
  
      const vectorTileLayer = L.vectorGrid.protobuf(
        'https://satsync.org/tileserver/data/landsat_grid/{z}/{x}/{y}.pbf',
        vectorTileOptions
      );
  
      vectorTileLayer.addTo(map);
  
      // Clean up on unmount
      return () => {
        map.removeLayer(vectorTileLayer);
      };
    }, [map]);
  
    return null;
  };
  
  export default VectorTileLayer;
  