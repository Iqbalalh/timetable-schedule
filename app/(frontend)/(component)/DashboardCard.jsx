import React from "react";
import { Card } from "antd";
const DashboardCard = ({ title, content, icon, bgColor }) => (
  <Card className={`${bgColor} text-white`}>
    <div className={`flex`}>
      <div>{icon}</div>
      <h1>{title}</h1>
    </div>
    <div>{content}</div>
  </Card>
);
export default DashboardCard;
