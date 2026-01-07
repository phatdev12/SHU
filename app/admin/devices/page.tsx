"use client";

import { useEffect, useState } from "react";
import { Spinner, Button, Modal } from "@heroui/react";
import Card from "@/components/ui/card";
import { $protectedFetchClient } from "@/lib/client";

// eslint-disable-next-line @typescript-eslint/no-explicit-any
type Device = Record<string, any> & { id?: string; deviceId?: string; createdAt?: string };

export default function DevicesPage() {
  const [devices, setDevices] = useState<Device[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [deletingId, setDeletingId] = useState<string | null>(null);

  useEffect(() => {
    fetchDevices();
  }, []);

  const fetchDevices = async () => {
    try {
      setLoading(true);
      const response = await $protectedFetchClient.GET("/api/admin/devices");
      if (response.data) setDevices(response.data.items as Device[]);
    } catch (err) {
      setError("Failed to fetch devices");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id?: string) => {
    if (!id) return;
    try {
      setDeletingId(id);
      const response = await $protectedFetchClient.DELETE("/api/admin/devices/{id}", {
        params: { path: { id } },
      });
      if (response.data) {
        setDevices((prev) => prev.filter((d) => (d.id || d.deviceId) !== id));
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
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-gray-900">Devices</h1>
          <p className="text-gray-600 mt-2">Manage registered devices</p>
        </div>

        <Card className="bg-white shadow-md">
          <Card.Header className="bg-gray-50">
            <div>
              <Card.Title>Devices List</Card.Title>
              <Card.Description>Total: {devices.length}</Card.Description>
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
                    <th className="px-4 py-3 border-b">ID</th>
                    <th className="px-4 py-3 border-b">Info</th>
                    <th className="px-4 py-3 border-b">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {devices.length === 0 ? (
                    <tr>
                      <td colSpan={3} className="px-4 py-8 text-center text-gray-500">No devices found</td>
                    </tr>
                  ) : (
                    devices.map((d) => {
                      const id = (d.id || d.deviceId || "").toString();
                      return (
                        <tr key={id} className="text-sm hover:bg-gray-50">
                          <td className="px-4 py-3 font-mono text-xs text-gray-700">{id ? id.slice(0, 10) + "..." : "(no id)"}</td>
                          <td className="px-4 py-3">
                            <pre className="text-xs whitespace-pre-wrap text-gray-700 max-w-xl overflow-hidden">{JSON.stringify(d, null, 2)}</pre>
                          </td>
                          <td className="px-4 py-3">
                            <Modal>
                              <Button size="sm" variant="danger" >Delete</Button>
                              <Modal.Backdrop>
                                <Modal.Container>
                                  <Modal.Dialog className="sm:max-w-[380px]">
                                    <Modal.CloseTrigger />
                                    <Modal.Header>
                                      <Modal.Heading>Delete Device</Modal.Heading>
                                    </Modal.Header>
                                    <Modal.Body>
                                      <p>Are you sure you want to delete this device?</p>
                                    </Modal.Body>
                                    <Modal.Footer>
                                      <Button slot="close" variant="tertiary">Cancel</Button>
                                      <Button variant="danger" onPress={() => handleDelete(id)} isPending={deletingId === id} slot="close">Delete</Button>
                                    </Modal.Footer>
                                  </Modal.Dialog>
                                </Modal.Container>
                              </Modal.Backdrop>
                            </Modal>
                          </td>
                        </tr>
                      );
                    })
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
