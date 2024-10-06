"use client";

import { useEffect, useState } from "react";
import { LatLngTuple } from "leaflet";
import { Marker, Polyline } from "react-leaflet";
import { Icon, IconOptions, DivIcon } from "leaflet";

interface SatelliteLayerProps {
  customIcon: Icon<IconOptions> | DivIcon | undefined;
}

export default function SatelliteLayer({ customIcon }: SatelliteLayerProps) {
  // State for the Landsat 8 satellite position and trajectory
  const [satellitePosition, setSatellitePosition] = useState<LatLngTuple | null>(null);
  const [satelliteTrajectory, setSatelliteTrajectory] = useState<LatLngTuple[]>([]);
  const [forecastTrajectory, setForecastTrajectory] = useState<LatLngTuple[]>([]); // New state for forecast

  // Fetch the current position of Landsat 8 periodically
  useEffect(() => {
    const fetchSatellitePosition = async () => {
      try {
        const response = await fetch("/api/satellite/landsat_8");
        const data = await response.json();
        if (data.latitude && data.longitude) {
          const currentPosition: LatLngTuple = [data.latitude, data.longitude];
          setSatellitePosition(currentPosition);

          // Append current position to trajectory for visualization
          setSatelliteTrajectory((prevTrajectory) => {
            // Limit the length of the trajectory for performance
            const updatedTrajectory = [...prevTrajectory, currentPosition];
            return updatedTrajectory.length > 100 ? updatedTrajectory.slice(1) : updatedTrajectory;
          });
        }
      } catch (error) {
        console.error("Error fetching satellite position:", error);
      }
    };

    // Fetch position every 10 seconds
    fetchSatellitePosition();
    const interval = setInterval(fetchSatellitePosition, 10000);

    return () => clearInterval(interval);
  }, []);

  // Fetch the forecasted trajectory
  useEffect(() => {
    const fetchForecastTrajectory = async () => {
      try {
        const response = await fetch("/api/satellite/landsat_8/forecast");
        const data = await response.json();
        if (data.forecast && Array.isArray(data.forecast)) {
          const forecastPositions: LatLngTuple[] = data.forecast.map((point: { longitude: number, latitude: number }) => [point.latitude, point.longitude]);
          setForecastTrajectory(forecastPositions);
        }
      } catch (error) {
        console.error("Error fetching satellite forecast trajectory:", error);
      }
    };

    fetchForecastTrajectory();

    // Optionally, refresh the forecast periodically
    const interval = setInterval(fetchForecastTrajectory, 3600000); // Refresh every hour

    return () => clearInterval(interval);
  }, []);

  return (
    <>
      {/* Render the Landsat 8 satellite position */}
      {satellitePosition && <Marker position={satellitePosition} icon={customIcon} />}

      {/* Render the Landsat 8 satellite trajectory */}
      {satelliteTrajectory.length > 1 && (
        <Polyline positions={satelliteTrajectory} color="red" />
      )}

      {/* Render the forecasted trajectory */}
      {forecastTrajectory.length > 1 && (
        <Polyline positions={forecastTrajectory} color="blue" />
      )}
    </>
  );
}
