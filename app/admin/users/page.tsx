"use client";

import { useEffect, useState } from "react";
import { Spinner, Button, Input, Modal } from "@heroui/react";
import Card from "@/components/ui/card";
import { $protectedFetchClient } from "@/lib/client";

interface User {
  id: string;
  username: string;
  email: string;
  verified: number;
  role: string;
  currentAQI: number;
  createdAt?: string;
}

export default function UsersPage() {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [search, setSearch] = useState("");
  const [deletingId, setDeletingId] = useState<string | null>(null);

  useEffect(() => {
    fetchUsers();
  }, [search]);

  const fetchUsers = async () => {
    try {
      setLoading(true);
      const response = await $protectedFetchClient.GET("/api/admin/users", {
        params: { query: { search: search || undefined, limit: 100, offset: 0 } },
      });
      if (response.data) {
        setUsers(response.data.items);
      }
    } catch (err) {
      setError("Failed to fetch users");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteUser = async (id: string) => {
    try {
      setDeletingId(id);
      const response = await $protectedFetchClient.DELETE(`/api/admin/users/{id}`, {
        params: { path: { id } },
      });
      if (response.data) {
        setUsers((prev) => prev.filter((u) => u.id !== id));
      }
    } catch (err) {
      console.error(err);
    } finally {
      setDeletingId(null);
    }
  };

  return (
    <div className="flex-1 p-8 bg-gradient-to-br from-gray-50 to-gray-100">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-gray-900">Users Management</h1>
          <p className="text-gray-600 mt-2">Manage system users and their roles</p>
        </div>

        {/* Search */}
        <div className="mb-6">
          <Input
            placeholder="Search users by username or email..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="max-w-xs"
          />
        </div>

        {/* Users Table */}
        <Card className="bg-white shadow-md">
          <Card.Header className="bg-gray-50">
            <div className="flex flex-col">
              <Card.Title>Users List</Card.Title>
              <Card.Description>Total: {users.length}</Card.Description>
            </div>
          </Card.Header>
            {loading ? (
              <div className="flex justify-center py-8">
                <Spinner size="lg" />
              </div>
            ) : error ? (
              <p className="text-red-600 text-center py-8">{error}</p>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full border-separate border-spacing-0">
                  <thead>
                    <tr className="text-left text-sm text-gray-600">
                      <th className="px-4 py-3 border-b">Username</th>
                      <th className="px-4 py-3 border-b">Email</th>
                      <th className="px-4 py-3 border-b">Role</th>
                      <th className="px-4 py-3 border-b">Verified</th>
                      <th className="px-4 py-3 border-b">AQI</th>
                      <th className="px-4 py-3 border-b">Created</th>
                      <th className="px-4 py-3 border-b">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {users.length === 0 ? (
                      <tr>
                        <td colSpan={7} className="px-4 py-8 text-center text-gray-500">
                          No users found
                        </td>
                      </tr>
                    ) : (
                      users.map((user) => (
                        <tr key={user.id} className="text-sm hover:bg-gray-50">
                          <td className="px-4 py-3 font-medium text-gray-900">{user.username}</td>
                          <td className="px-4 py-3">{user.email}</td>
                          <td className="px-4 py-3">
                            <span className="inline-flex items-center rounded-md border px-2 py-0.5 text-xs text-gray-700">
                              {user.role}
                            </span>
                          </td>
                          <td className="px-4 py-3">
                            <span className={`inline-flex items-center rounded-md border px-2 py-0.5 text-xs ${user.verified ? "text-green-700 border-green-300" : "text-yellow-700 border-yellow-300"}`}>
                              {user.verified ? "Yes" : "No"}
                            </span>
                          </td>
                          <td className="px-4 py-3">{user.currentAQI}</td>
                          <td className="px-4 py-3 text-gray-600">
                            {user.createdAt ? new Date(user.createdAt).toLocaleDateString() : "N/A"}
                          </td>
                          <td className="px-4 py-3">
                            <Modal>
                              <Button size="sm" variant="danger">
                                Delete
                              </Button>
                              <Modal.Backdrop>
                                <Modal.Container>
                                  <Modal.Dialog className="sm:max-w-[380px]">
                                    <Modal.CloseTrigger />
                                    <Modal.Header>
                                      <Modal.Heading>Delete User</Modal.Heading>
                                    </Modal.Header>
                                    <Modal.Body>
                                      <p>
                                        Are you sure you want to delete user <strong>{user.username}</strong>?
                                      </p>
                                    </Modal.Body>
                                    <Modal.Footer>
                                      <Button slot="close" variant="tertiary">Cancel</Button>
                                      <Button
                                        variant="danger"
                                        onPress={() => handleDeleteUser(user.id)}
                                        isPending={deletingId === user.id}
                                        slot="close"
                                      >
                                        Delete
                                      </Button>
                                    </Modal.Footer>
                                  </Modal.Dialog>
                                </Modal.Container>
                              </Modal.Backdrop>
                            </Modal>
                          </td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>
            )}
        </Card>
      </div>
    </div>
  );
}
