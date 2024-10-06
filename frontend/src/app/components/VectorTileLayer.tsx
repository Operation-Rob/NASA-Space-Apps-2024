"use client"

// components/VectorTileLayer.tsx
import { useEffect } from 'react';
import { useMap } from 'react-leaflet';
import L, { VectorGrid } from 'leaflet';
import 'leaflet.vectorgrid';

// Temporary polyfill for fakeStop to resolve compatibility issues

declare module 'leaflet' {
  // eslint-disable-next-line @typescript-eslint/no-namespace
  namespace DomEvent {
    function fakeStop(e: L.LeafletMouseEvent): void;
  }
}

const VectorTileLayer = () => {
    const map = useMap();
  
    useEffect(() => {
      const vectorTileOptions: VectorGrid.ProtobufOptions = {
        rendererFactory: L.canvas.tile,
        maxNativeZoom: 14,
        tolerance: 1,
        attribution: '&copy; Tileserver - Landsat Data',
        vectorTileLayerStyles: {
          // Adjust 'layerName' to match the actual layer in your tileset
          'landsat_grid': {
            weight: 2,
            color: '#0000ff',
            opacity: 1,
            fill: true,
            fillColor: '#ffffff',
            fillOpacity: 0.2,
          },
        },
      };

      const vectorTileLayer = L.vectorGrid.protobuf(
        'https://satsync.org/tileserver/data/landsat_grid/{z}/{x}/{y}.pbf',
        vectorTileOptions
      );

      // Attach click event listener to the VectorGrid layer
      vectorTileLayer.on('click', function (e: L.LeafletMouseEvent) {
        const clickedFeature = e.layer.properties; // Access feature properties
        console.log('Feature clicked:', clickedFeature);

        // Example: Display a popup with some property
        if (clickedFeature) {
          const popupContent = `
            <div>
              <strong>Feature ID:</strong> ${clickedFeature.id || 'N/A'}<br/>
              <!-- Add more properties as needed -->
            </div>
          `;
          L.popup()
            .setLatLng(e.latlng)
            .setContent(popupContent)
            .openOn(map);
        }
      });

  
      vectorTileLayer.addTo(map);
  
      // Clean up on unmount
      return () => {
        map.removeLayer(vectorTileLayer);
      };
    }, [map]);
  
    return null;
  };
  
  export default VectorTileLayer;
  