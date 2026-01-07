// ...existing code...
"use client";

import { useEffect, useState } from "react";
import { Spinner } from "@heroui/react";
import Card from "@/components/ui/card";
import { $protectedFetchClient } from "@/lib/client";

interface Stats {
  totalUsers: number;
  totalProducts: number;
  totalOrders: number;
  totalDevices: number;
  totalPosts: number;
  activeDevices: number;
}

export default function AdminDashboardPage() {
  const [stats, setStats] = useState<Stats | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const response = await $protectedFetchClient.GET("/api/admin/stats");
        if (response.data) {
          setStats(response.data);
        } else {
          setError("Failed to load statistics");
        }
      } catch (err) {
        setError("Error fetching statistics");
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchStats();
  }, []);

  if (loading) {
    return (
      <div className="flex-1 p-8 bg-gradient-to-br from-gray-50 to-gray-100 flex items-center justify-center">
        <Spinner size="lg" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex-1 p-8 bg-gradient-to-br from-gray-50 to-gray-100">
        <Card className="bg-red-50 border border-red-200">
          <Card.Header>
            <Card.Title className="text-red-700">Error</Card.Title>
            <Card.Description className="text-red-700">{error}</Card.Description>
          </Card.Header>
        </Card>
      </div>
    );
  }

  const statCards = [
    { label: "Total Users", value: stats?.totalUsers, color: "bg-blue-100", textColor: "text-blue-600" },
    { label: "Total Posts", value: stats?.totalPosts, color: "bg-green-100", textColor: "text-green-600" },
    { label: "Total Products", value: stats?.totalProducts, color: "bg-purple-100", textColor: "text-purple-600" },
    { label: "Total Orders", value: stats?.totalOrders, color: "bg-orange-100", textColor: "text-orange-600" },
    { label: "Total Devices", value: stats?.totalDevices, color: "bg-indigo-100", textColor: "text-indigo-600" },
    { label: "Active Devices", value: stats?.activeDevices, color: "bg-pink-100", textColor: "text-pink-600" },
  ];

  return (
    <div className="flex-1 p-8 bg-gradient-to-br from-gray-50 to-gray-100">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-gray-900">Dashboard</h1>
          <p className="text-gray-600 mt-2">Welcome to the admin panel</p>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {statCards.map((card) => (
            <Card key={card.label} className="bg-white shadow-md hover:shadow-lg transition-shadow">
              <Card.Header>
                <Card.Description className="text-gray-600 text-sm font-medium">{card.label}</Card.Description>
                <Card.Title className={`text-4xl font-bold mt-2 ${card.textColor}`}>{card.value}</Card.Title>
              </Card.Header>
            </Card>
          ))}
        </div>

        {/* Recent Activity */}
        <div className="mt-8">
          <Card className="bg-white shadow-md">
            <Card.Header className="bg-gray-50">
              <Card.Title className="text-lg font-semibold text-gray-900">Recent Activity</Card.Title>
              <Card.Description className="text-sm text-gray-600">System overview</Card.Description>
            </Card.Header>
            <p className="text-gray-600 px-6 py-4">
              System is running normally. All services operational.
            </p>
          </Card>
        </div>
      </div>
    </div>
  );
}
// ...existing code...