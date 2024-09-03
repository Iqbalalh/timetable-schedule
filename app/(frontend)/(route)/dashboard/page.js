"use client";
import React, { useEffect, useState } from "react";
import { BarChart } from "@mui/x-charts/BarChart";
import { Table, message, Layout } from "antd";
import DashboardCard from "../../(component)/DashboardCard";

const { Content } = Layout;

const Dashboard = () => {
  return (
    <Layout style={{ padding: "24px" }}>
      <Content>
        <div className="flex justify-between w-full gap-8">
          <div className="w-1/3">
            <DashboardCard title={"tet"} icon={"test"} content={"test"} bgColor={"bg-red-400"} />
          </div>
          <div className="w-1/3">
            <DashboardCard title={"tet"} icon={"test"} content={"test"} bgColor={"bg-gray-600"} />
          </div>
          <div className="w-1/3">
            <DashboardCard title={"tet"} icon={"test"} content={"test"} bgColor={"bg-red-500"} />
          </div>
        </div>

        <BarChart
          series={[
            { data: [35, 44, 24, 34] },
            { data: [51, 6, 49, 30] },
            { data: [15, 25, 30, 50] },
            { data: [60, 50, 15, 25] },
          ]}
          height={290}
          xAxis={[{ data: ["Q1", "Q2", "Q3", "Q4"], scaleType: "band" }]}
          margin={{ top: 10, bottom: 30, left: 40, right: 10 }}
        />
      </Content>
    </Layout>
  );
};

export default Dashboard;
