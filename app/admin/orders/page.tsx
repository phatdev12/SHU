"use client";

import { useEffect, useState } from "react";
import { Spinner, Button, Modal } from "@heroui/react";
import Card from "@/components/ui/card";
import { $protectedFetchClient } from "@/lib/client";

interface OrderItem {
  id: string;
  userId?: string;
  productId: string;
  quantity: number;
  totalPrice: number;
  orderStatus: string;
  customerName?: string;
  customerEmail?: string;
  customerPhone?: string;
  shippingAddress?: string;
  orderDate: string;
}

export default function OrdersPage() {
  const [orders, setOrders] = useState<OrderItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [deletingId, setDeletingId] = useState<string | null>(null);

  useEffect(() => {
    fetchOrders();
  }, []);

  const fetchOrders = async () => {
    try {
      setLoading(true);
      const response = await $protectedFetchClient.GET("/api/admin/orders");
      if (response.data) {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const mappedOrders = response.data.items.map((item: any) => ({
          ...item,
          totalPrice: item.totalPrice || 0,
          orderStatus: item.orderStatus || "pending",
        }));
        setOrders(mappedOrders);
      }
    } catch (err) {
      setError("Failed to fetch orders");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };
  
  const handleDelete = async (id: string) => {
    try {
      setDeletingId(id);
      const response = await $protectedFetchClient.DELETE("/api/admin/orders/{id}", {
        params: { path: { id } },
      });
      if (response.data) {
        setOrders((prev) => prev.filter((o) => o.id !== id));
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
          <h1 className="text-4xl font-bold text-gray-900">Orders</h1>
          <p className="text-gray-600 mt-2">Manage customer orders</p>
        </div>

        <Card className="bg-white shadow-md">
          <Card.Header className="bg-gray-50">
            <div className="flex items-center justify-between">
              <div>
                <Card.Title>Orders List</Card.Title>
                <Card.Description>Total: {orders.length}</Card.Description>
              </div>
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
                    <th className="px-4 py-3 border-b">Order</th>
                    <th className="px-4 py-3 border-b">Product</th>
                    <th className="px-4 py-3 border-b">Qty</th>
                    <th className="px-4 py-3 border-b">Total</th>
                    <th className="px-4 py-3 border-b">Status</th>
                    <th className="px-4 py-3 border-b">Date</th>
                    <th className="px-4 py-3 border-b">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {orders.length === 0 ? (
                    <tr>
                      <td colSpan={7} className="px-4 py-8 text-center text-gray-500">No orders found</td>
                    </tr>
                  ) : (
                    orders.map((o) => (
                      <tr key={o.id} className="text-sm hover:bg-gray-50">
                        <td className="px-4 py-3 font-mono text-xs text-gray-700">{o.id.slice(0, 10)}...</td>
                        <td className="px-4 py-3 font-mono text-xs text-gray-700">{o.productId.slice(0, 10)}...</td>
                        <td className="px-4 py-3">{o.quantity}</td>
                        <td className="px-4 py-3">${o.totalPrice.toFixed(2)}</td>
                        <td className="px-4 py-3">
                          <span className={`inline-flex items-center rounded-md border px-2 py-0.5 text-xs ${o.orderStatus === "completed" ? "text-green-700 border-green-300" : o.orderStatus === "cancelled" ? "text-red-700 border-red-300" : "text-yellow-700 border-yellow-300"}`}>
                            {o.orderStatus}
                          </span>
                        </td>
                        <td className="px-4 py-3 text-gray-600">{new Date(o.orderDate).toLocaleDateString()}</td>
                        <td className="px-4 py-3">
                          <Modal>
                            <Button size="sm" variant="danger">Delete</Button>
                            <Modal.Backdrop>
                              <Modal.Container>
                                <Modal.Dialog className="sm:max-w-[380px]">
                                  <Modal.CloseTrigger />
                                  <Modal.Header>
                                    <Modal.Heading>Delete Order</Modal.Heading>
                                  </Modal.Header>
                                  <Modal.Body>
                                    <p>Are you sure you want to delete order <strong>{o.id}</strong>?</p>
                                  </Modal.Body>
                                  <Modal.Footer>
                                    <Button slot="close" variant="tertiary">Cancel</Button>
                                    <Button variant="danger" onPress={() => handleDelete(o.id)} isPending={deletingId === o.id} slot="close">Delete</Button>
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
