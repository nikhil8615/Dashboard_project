import React, { useState, useEffect } from "react";

import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  Legend,
} from "recharts";
import { FaChartBar, FaUsers, FaDollarSign } from "react-icons/fa";

const activityData = [
  {
    time: "2025-05-13 09:12",
    user: "User#1325",
    activity: "Logged in",
  },
  {
    time: "2025-05-13 09:14",
    user: "User#1325",
    activity: "Updated profile photo",
  },
  {
    time: "2025-05-13 09:16",
    user: "Admin#01",
    activity: "Banned User#1409",
  },
  {
    time: "2025-05-13 09:18",
    user: "User#1433",
    activity: "Reported User#1409 for spam",
  },
  {
    time: "2025-05-13 09:20",
    user: "System",
    activity: "AI Chatbot generated 3 matches",
  },
];

const signupData = [
  { name: "Mon", signups: 30 },
  { name: "Tue", signups: 45 },
  { name: "Wed", signups: 20 },
  { name: "Thu", signups: 50 },
  { name: "Fri", signups: 75 },
  { name: "Sat", signups: 60 },
  { name: "Sun", signups: 90 },
];

const flagData = [
  { day: "Mon", flags: 3 },
  { day: "Tue", flags: 6 },
  { day: "Wed", flags: 2 },
  { day: "Thu", flags: 8 },
  { day: "Fri", flags: 4 },
  { day: "Sat", flags: 5 },
  { day: "Sun", flags: 7 },
];

const genderData = [
  { name: "Male", value: 500 },
  { name: "Female", value: 300 },
  { name: "Other", value: 100 },
];
const COLORS = ["#0088FE", "#00C49F", "#FFBB28"];
const DashboardStats = () => {
  const [userId, setUserId] = useState("");

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const token = localStorage.getItem("token");
        if (!token) {
          console.error("No authentication token found");
          return;
        }

        const response = await fetch("http://localhost:4000/api/user/current", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        const data = await response.json();
        if (data.success) {
          setUserId(data.user.UserID);
        } else {
          console.error("Failed to fetch user data:", data.message);
        }
      } catch (error) {
        console.error("Error fetching user data:", error);
      }
    };

    fetchUserData();
  }, []);

  const stats = [
    {
      title: "Total User",
      value: "1278",
      icon: <FaChartBar className="text-white" />,
      bgColor: "bg-blue-600",
      textColor: "text-white",
    },
    {
      title: "Active Today",
      value: "1278",
      icon: <FaUsers className="text-white" />,
      bgColor: "bg-green-600",
      textColor: "text-white",
      extra: <span className="text-white text-xs ml-2">This Month ▼</span>,
    },
    {
      title: "Revenue",
      value: "1278",
      icon: <FaDollarSign className="text-white" />,
      bgColor: "bg-purple-600",
      textColor: "text-white",
    },
  ];

  return (
    <>
      <div className="min-h-screen">
        <div className="flex justify-between items-center mb-10">
          <p className="text-orange-600 text-5xl font-bold">Dashboard</p>
          {userId && (
            <p className="text-gray-600 text-xl">
              Welcome, <span className="font-semibold">{userId}</span>
            </p>
          )}
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 px-4">
          {stats.map((stat, index) => (
            <div
              key={index}
              className={`flex flex-col p-4 rounded-md shadow-md w-full max-w-sm mx-auto hover:shadow-lg transition-shadow duration-300 ${stat.bgColor}`}
            >
              <div className="flex items-center justify-between mb-2">
                <h2
                  className={`text-sm font-medium ${stat.textColor} flex items-center gap-1`}
                >
                  {stat.title}
                  <span className="text-base">{stat.icon}</span>
                </h2>
                {stat.extra && <div>{stat.extra}</div>}
              </div>
              <div className={`text-2xl font-bold ${stat.textColor}`}>
                {stat.value}
              </div>
            </div>
          ))}
        </div>

        <div className="flex flex-col lg:flex-row p-4 gap-4">
          <div className="flex flex-col w-full lg:w-2/3 gap-4">
            <div className="bg-white p-4 rounded-2xl shadow-md">
              <h2 className="text-lg font-semibold mb-2">Weekly Signups</h2>
              <ResponsiveContainer width="100%" height={200}>
                <LineChart data={signupData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="name" />
                  <YAxis />
                  <Tooltip />
                  <Line
                    type="monotone"
                    dataKey="signups"
                    stroke="#8884d8"
                    strokeWidth={3}
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>

            <div className="bg-white p-4 rounded-2xl shadow-md">
              <h2 className="text-lg font-semibold mb-2">Flags Per Day</h2>
              <ResponsiveContainer width="100%" height={200}>
                <BarChart data={flagData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="day" />
                  <YAxis />
                  <Tooltip />
                  <Bar dataKey="flags" fill="#82ca9d" />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>

          <div className="w-full lg:w-1/3 bg-white p-4 rounded-2xl shadow-md">
            <h2 className="text-lg font-semibold mb-2">Gender Ratio</h2>
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={genderData}
                  cx="50%"
                  cy="50%"
                  outerRadius={100}
                  fill="#8884d8"
                  dataKey="value"
                  label
                >
                  {genderData.map((entry, index) => (
                    <Cell
                      key={`cell-${index}`}
                      fill={COLORS[index % COLORS.length]}
                    />
                  ))}
                </Pie>
                <Tooltip />
                <Legend />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>
        <div className="mt-20 max-w-6xl mx-auto p-4  rounded-lg shadow-lg">
          <h2 className="text-lg font-semibold mb-4">Recent Activity Log</h2>
          <div className="overflow-x-auto">
            <table className="w-full table-auto border-collapse">
              <thead>
                <tr className=" text-left text-sm">
                  <th className="py-2 px-4 border-b border-gray-700">Time</th>
                  <th className="py-2 px-4 border-b border-gray-700">
                    User/Admin
                  </th>
                  <th className="py-2 px-4 border-b border-gray-700">
                    Activity
                  </th>
                </tr>
              </thead>
              <tbody>
                {activityData.map((entry, index) => (
                  <tr key={index}>
                    <td className="py-2 px-4 border-b border-gray-700 text-sm">
                      {entry.time}
                    </td>
                    <td className="py-2 px-4 border-b border-gray-700 text-sm">
                      {entry.user}
                    </td>
                    <td className="py-2 px-4 border-b border-gray-700 text-sm">
                      {entry.activity}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </>
  );
};

export default DashboardStats;
