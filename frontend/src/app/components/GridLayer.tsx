// components/GridLayer.tsx
import { GeoJSON, useMap } from "react-leaflet";
import { useEffect, useState } from "react";
import L, { LatLngBoundsExpression } from "leaflet";
import geoJsonData from "@/data/landsat_grid.geojson"; // Assume you have the geojson file locally or dynamically load it

interface GridLayerProps {
  minZoom: number;
}

const GridLayer = ({ minZoom }: GridLayerProps) => {
  const map = useMap();
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const handleZoom = () => {
      const zoomLevel = map.getZoom();
      setVisible(zoomLevel >= minZoom);
    };

    map.on("zoomend", handleZoom);
    handleZoom(); // Initial check

    return () => {
      map.off("zoomend", handleZoom);
    };
  }, [map, minZoom]);

  // Render the GeoJSON grid only if visible
  return visible ? (
    <GeoJSON
      data={geoJsonData as GeoJSON.FeatureCollection}
      style={() => ({
        color: "#ff7800",
        weight: 1,
        opacity: 0.65,
      })}
      onEachFeature={(feature, layer) => {
        layer.on({
          click: () => {
            // Handle subscription logic here
            console.log("Grid cell clicked:", feature.properties);
          },
        });
      }}
    />
  ) : null;
};

export default GridLayer;
