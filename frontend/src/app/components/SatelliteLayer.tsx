"use client";

import { useEffect, useState } from "react";
import { LatLngTuple } from "leaflet";
import { Marker, Polyline } from "react-leaflet";
import { Icon, IconOptions, DivIcon } from "leaflet";

interface SatelliteLayerProps {
  satellites: { id: string; customIcon: Icon<IconOptions> | DivIcon | undefined }[];
}

interface SatelliteData {
  position: LatLngTuple | null;
  trajectory: LatLngTuple[];
  forecastTrajectory: LatLngTuple[];
}

export default function SatelliteLayer({ satellites }: SatelliteLayerProps) {
  // State for the satellites' positions and trajectories
  const [satelliteData, setSatelliteData] = useState<{ [key: string]: SatelliteData }>({});

  // Fetch the current position of each satellite periodically
  useEffect(() => {
    const fetchSatellitePosition = async (satelliteId: string) => {
      try {
        const response = await fetch(`/api/satellite/${satelliteId}`);
        const data = await response.json();
        if (data.latitude && data.longitude) {
          const currentPosition: LatLngTuple = [data.latitude, data.longitude];

          setSatelliteData((prevData) => {
            const updatedData = { ...prevData };
            const currentData = updatedData[satelliteId] || {
              position: null,
              trajectory: [],
              forecastTrajectory: []
            };

            // Update position and trajectory
            const updatedTrajectory = [...currentData.trajectory, currentPosition];
            if (updatedTrajectory.length > 100) updatedTrajectory.shift(); // Limit trajectory length

            updatedData[satelliteId] = {
              ...currentData,
              position: currentPosition,
              trajectory: updatedTrajectory
            };
            return updatedData;
          });
        }
      } catch (error) {
        console.error(`Error fetching position for satellite ${satelliteId}:`, error);
      }
    };

	satellites.map((satellite) => fetchSatellitePosition(satellite.id));

    const intervals = satellites.map((satellite) =>
      setInterval(() => fetchSatellitePosition(satellite.id), 10000) // Fetch position every 10 seconds
    );

    return () => intervals.forEach(clearInterval);
  }, [satellites]);

  // Fetch the forecasted trajectory for each satellite
  useEffect(() => {
    const fetchForecastTrajectory = async (satelliteId: string) => {
      try {
        const response = await fetch(`/api/satellite/${satelliteId}/forecast`);
        const data = await response.json();
        if (data.forecast && Array.isArray(data.forecast)) {
          const forecastPositions: LatLngTuple[] = data.forecast.map(
            (point: { longitude: number; latitude: number }) => [point.latitude, point.longitude]
          );

          setSatelliteData((prevData) => {
            const updatedData = { ...prevData };
            const currentData = updatedData[satelliteId] || {
              position: null,
              trajectory: [],
              forecastTrajectory: []
            };

            updatedData[satelliteId] = {
              ...currentData,
              forecastTrajectory: forecastPositions
            };

            return updatedData;
          });
        }
      } catch (error) {
        console.error(`Error fetching forecast for satellite ${satelliteId}:`, error);
      }
    };

	satellites.map((satellite) => fetchForecastTrajectory(satellite.id));

    const intervals = satellites.map((satellite) =>
      setInterval(() => fetchForecastTrajectory(satellite.id), 3600000) // Refresh forecast every hour
    );

    return () => intervals.forEach(clearInterval);
  }, [satellites]);

  return (
    <>
      {satellites.map((satellite) => {
        const data = satelliteData[satellite.id];
        return (
          <div key={satellite.id}>
            {/* Render satellite position */}
            {data?.position && <Marker position={data.position} icon={satellite.customIcon} />}

            {/* Render satellite trajectory */}
            {data?.trajectory.length > 1 && (
              <Polyline positions={data.trajectory} color="red" />
            )}

            {/* Render forecasted trajectory */}
            {data?.forecastTrajectory.length > 1 && (
              <Polyline positions={data.forecastTrajectory} color="blue" />
            )}
          </div>
        );
      })}
    </>
  );
}
