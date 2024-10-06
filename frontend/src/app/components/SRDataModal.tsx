// components/SRDataModal.tsx
import React from "react";
import Modal from "./Modal";
import { Pin } from "@/types/types";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

interface SRDataModalProps {
  pin: Pin;
  onClose: () => void;
}

const SRDataModal: React.FC<SRDataModalProps> = ({ pin, onClose }) => {
  if (pin.error != null) {
    return (
      <Modal title={pin.name.concat(" Reflectance Data")} onClose={onClose}>
        <p className="text-red-500">{pin.error}</p>
      </Modal>
    );
  }

  if (!pin.data) {
    return null; // You could also show a message like "Loading data..." or "No data available"
  }

  // Transform the pin data into a format that Recharts can use
  const chartData = Object.keys(pin.data).map((key) => ({
    name: key,
    value: pin.data[key],
  }));

  return (
    <Modal title={pin.name.concat(" Reflectance Data")} onClose={onClose}>
      <div style={{ width: "100%", height: 300 }}>
        <ResponsiveContainer width="100%" height="100%">
          <BarChart
            data={chartData}
            margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
          >
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="name" />
            <YAxis />
            <Tooltip />
            <Bar dataKey="value" fill="#8884d8" />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </Modal>
  );
};

export default SRDataModal;
