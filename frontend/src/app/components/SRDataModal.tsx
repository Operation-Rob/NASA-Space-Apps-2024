// components/SRDataModal.tsx
import React from "react";
import Modal from "./Modal";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import { Pin } from "@/types/types";

interface SRDataModalProps {
  pin: Pin;
  onClose: () => void;
}

// eslint-disable-next-line @typescript-eslint/no-unused-vars
const SRDataModal: React.FC<SRDataModalProps> = ({ pin, onClose }) => {
  // Define the chart data with random values between 0 and 1
  const chartData = [
    { name: "Coastal/Aerosol", value: pin.data[0] },
    { name: "Blue", value: pin.data[1] },
    { name: "Green", value: pin.data[2] },
    { name: "Red", value: pin.data[3] },
    { name: "NIR", value: pin.data[4] },
    { name: "SWIR 1", value: pin.data[5] },
    { name: "SWIR 2", value: pin.data[6] },
  ];

  return (
    <Modal title={"Reflectance Data"} onClose={onClose}>
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
