// components/SRDataModal.tsx
"use client";

import { useState, useEffect } from "react";
import Modal from "./Modal";
import { Pin } from "@/types/types";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";

interface SRDataModalProps {
  pin: Pin;
  onClose: () => void;
}

interface SRDataPoint {
  date: string;
  [key: string]: number; // For different frequency ranges
}

export default function SRDataModal({ pin, onClose }: SRDataModalProps) {
  const [srData, setSrData] = useState<SRDataPoint[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    // Fetch SR data for the pin's location
    const fetchData = async () => {
      try {
        setLoading(true);
        // Replace with your actual API endpoint and parameters
        const response = await fetch(`/api/sr-data?lat=${pin.lat}&lng=${pin.lng}`);
        if (!response.ok) {
          throw new Error("Failed to fetch SR data");
        }
        const data = await response.json();
        setSrData(data);
      } catch (err: Error) {
        setError(err.message || "An error occurred");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [pin.lat, pin.lng]);

  return (
    <Modal onClose={onClose} title={`SR Data for ${pin.name}`} size="large">
      {loading ? (
        <div>Loading data...</div>
      ) : error ? (
        <div className="text-red-500">{error}</div>
      ) : (
        <ResponsiveContainer width="100%" height={400}>
          <LineChart data={srData}>
            <XAxis dataKey="date" />
            <YAxis />
            <Tooltip />
            <Legend />
            {/* Assuming data includes SR values for different bands */}
            <Line type="monotone" dataKey="band1" stroke="#8884d8" />
            <Line type="monotone" dataKey="band2" stroke="#82ca9d" />
            {/* Add lines for other bands as needed */}
          </LineChart>
        </ResponsiveContainer>
      )}
    </Modal>
  );
}
