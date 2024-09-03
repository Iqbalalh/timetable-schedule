import React from "react";
import { Card } from "antd";

const DashboardCard = ({ title, content, icon, bgColor }) => (
  <Card className={`${bgColor} text-white shadow-xl`}>
    <div className="flex justify-between items-center">
      <div className="text-4xl">{icon}</div>
      <div className="text-right">
        <h1 className="text-2xl font-bold">{title}</h1>
        <div className="text-lg font-semibold">{content}</div>
      </div>
    </div>
  </Card>
);

export default DashboardCard;
