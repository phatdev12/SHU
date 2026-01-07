"use client";

import { useEffect, useState } from "react";
import { Spinner, Button, Input, Modal } from "@heroui/react";
import Card from "@/components/ui/card";
import { $protectedFetchClient } from "@/lib/client";

interface Product {
  id: string;
  name: string;
  description: string;
  price: number;
  stock: number;
  imageUrl?: string;
}

export default function ProductsPage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [search, setSearch] = useState("");
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [createForm, setCreateForm] = useState({ name: "", description: "", price: "", stock: "" });
  const [createPending, setCreatePending] = useState(false);
  const [editForm, setEditForm] = useState<{ id: string | null; name: string; description: string; price: string; stock: string }>({ id: null, name: "", description: "", price: "", stock: "" });
  const [editPendingId, setEditPendingId] = useState<string | null>(null);
  const [createImageFile, setCreateImageFile] = useState<File | null>(null);
  const [createImagePreview, setCreateImagePreview] = useState<string | null>(null);
  const [editImageFile, setEditImageFile] = useState<File | null>(null);
  const [editImagePreview, setEditImagePreview] = useState<string | null>(null);

  useEffect(() => {
    fetchProducts();
  }, [search]);

  const fetchProducts = async () => {
    try {
      setLoading(true);
      const response = await $protectedFetchClient.GET("/api/admin/products", {
        params: { query: { search: search || undefined, limit: 100, offset: 0 } },
      });
      if (response.data) setProducts(response.data.items);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: string) => {
    try {
      setDeletingId(id);
      const response = await $protectedFetchClient.DELETE("/api/admin/products/{id}", {
        params: { path: { id } },
      });
      if (response.data) {
        setProducts((prev) => prev.filter((p) => p.id !== id));
      }
    } catch (err) {
      console.error(err);
    } finally {
      setDeletingId(null);
    }
  };

  const uploadImage = async (file: File): Promise<string | null> => {
    try {
      const ext = file.name.includes('.') ? file.name.split('.').pop() : undefined;
      const res = await $protectedFetchClient.POST('/api/posts/upload-url', {
        body: { contentType: file.type || 'application/octet-stream', extension: ext },
      });
      if (!res.data) return null;
      const { uploadUrl, url } = res.data;
      const putRes = await fetch(uploadUrl, {
        method: 'PUT',
        headers: { 'Content-Type': file.type || 'application/octet-stream' },
        body: file,
      });
      if (!putRes.ok) return null;
      return url;
    } catch (e) {
      console.error('Upload failed', e);
      return null;
    }
  };

  const handleCreate = async () => {
    try {
      setCreatePending(true);
      let imageUrl: string | null = null;
      if (createImageFile) {
        imageUrl = await uploadImage(createImageFile);
      }
      const body = {
        name: createForm.name.trim(),
        description: createForm.description.trim(),
        price: Number(createForm.price || 0),
        stock: Number(createForm.stock || 0),
        imageUrl: imageUrl || undefined,
      };
      const response = await $protectedFetchClient.POST("/api/admin/products", { body });
      if (response.data) {
        setProducts((prev) => [response.data, ...prev]);
        setCreateForm({ name: "", description: "", price: "", stock: "" });
        setCreateImageFile(null);
        if (createImagePreview) {
          URL.revokeObjectURL(createImagePreview);
          setCreateImagePreview(null);
        }
      }
    } catch (err) {
      console.error(err);
    } finally {
      setCreatePending(false);
    }
  };

  const openEdit = (p: Product) => {
    setEditForm({ id: p.id, name: p.name, description: p.description, price: String(p.price), stock: String(p.stock) });
  };

  const handleEditSave = async () => {
    if (!editForm.id) return;
    const id = editForm.id;
    try {
      setEditPendingId(id);
      let imageUrl: string | undefined = undefined;
      if (editImageFile) {
        const uploaded = await uploadImage(editImageFile);
        if (uploaded) imageUrl = uploaded;
      }
      const body = {
        name: editForm.name.trim() || undefined,
        description: editForm.description.trim() || undefined,
        price: editForm.price === "" ? undefined : Number(editForm.price),
        stock: editForm.stock === "" ? undefined : Number(editForm.stock),
        imageUrl,
      };
      const response = await $protectedFetchClient.PATCH("/api/admin/products/{id}", {
        params: { path: { id } },
        body,
      });
      if (response.data) {
        setProducts((prev) => prev.map((p) => (p.id === id ? response.data! : p)));
        setEditImageFile(null);
        if (editImagePreview) {
          URL.revokeObjectURL(editImagePreview);
          setEditImagePreview(null);
        }
      }
    } catch (err) {
      console.error(err);
    } finally {
      setEditPendingId(null);
    }
  };

  return (
    <div className="flex-1 p-8 bg-gradient-to-br from-gray-50 to-gray-100">
      <div className="max-w-7xl mx-auto">
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-gray-900">Products</h1>
          <p className="text-gray-600 mt-2">Manage store products</p>
        </div>

        <div className="mb-6 flex items-center gap-3">
          <Input
            placeholder="Search products by name..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="max-w-xs"
          />
          <Modal>
            <Button variant="secondary">New Product</Button>
            <Modal.Backdrop>
              <Modal.Container>
                <Modal.Dialog className="sm:max-w-[480px]">
                  <Modal.CloseTrigger />
                  <Modal.Header>
                    <Modal.Heading>Create Product</Modal.Heading>
                  </Modal.Header>
                  <Modal.Body>
                    <div className="space-y-4">
                      <Input
                        value={createForm.name}
                        onChange={(e) => setCreateForm((f) => ({ ...f, name: e.target.value }))}
                        placeholder="Product name"
                      />
                      <div>
                        <label className="text-sm text-gray-600">Description</label>
                        <textarea
                          className="mt-1 w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-gray-200"
                          rows={4}
                          value={createForm.description}
                          onChange={(e) => setCreateForm((f) => ({ ...f, description: e.target.value }))}
                          placeholder="Short description"
                        />
                      </div>
                      <div className="grid grid-cols-2 gap-4">
                        <div className="flex flex-col">
                          <label className="text-sm text-gray-600">Price (VND)</label>
                          <Input
                            type="number"
                            value={createForm.price}
                            onChange={(e) => setCreateForm((f) => ({ ...f, price: e.target.value }))}
                            placeholder="0"
                          />
                        </div>
                        <div className="flex flex-col">
                          <label className="text-sm text-gray-600">Stock</label>
                          <Input
                            type="number"
                            value={createForm.stock}
                            onChange={(e) => setCreateForm((f) => ({ ...f, stock: e.target.value }))}
                            placeholder="0"
                          />
                        </div>
                      </div>
                      <div>
                        <label className="text-sm text-gray-600">Image (optional)</label>
                        <input
                          type="file"
                          accept="image/*"
                          onChange={(e) => {
                            const file = e.target.files?.[0] || null;
                            setCreateImageFile(file);
                            if (createImagePreview) {
                              URL.revokeObjectURL(createImagePreview);
                            }
                            setCreateImagePreview(file ? URL.createObjectURL(file) : null);
                          }}
                          className="mt-1 block w-full text-sm"
                        />
                        {createImagePreview && (
                          <img src={createImagePreview} alt="Preview" className="mt-2 h-20 w-20 object-cover rounded" />
                        )}
                      </div>
                    </div>
                  </Modal.Body>
                  <Modal.Footer>
                    <Button slot="close" variant="tertiary">Cancel</Button>
                    <Button variant="secondary" onPress={handleCreate} isPending={createPending} slot="close">Create</Button>
                  </Modal.Footer>
                </Modal.Dialog>
              </Modal.Container>
            </Modal.Backdrop>
          </Modal>
        </div>

        <Card className="bg-white shadow-md">
          <Card.Header className="bg-gray-50">
            <div className="flex items-center justify-between">
              <div>
                <Card.Title>Products List</Card.Title>
                <Card.Description>Total: {products.length}</Card.Description>
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
                    <th className="px-4 py-3 border-b">Image</th>
                    <th className="px-4 py-3 border-b">Name</th>
                    <th className="px-4 py-3 border-b">Description</th>
                    <th className="px-4 py-3 border-b">Price</th>
                    <th className="px-4 py-3 border-b">Stock</th>
                    <th className="px-4 py-3 border-b">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {products.length === 0 ? (
                    <tr>
                      <td colSpan={5} className="px-4 py-8 text-center text-gray-500">No products found</td>
                    </tr>
                  ) : (
                    products.map((p) => (
                      <tr key={p.id} className="text-sm hover:bg-gray-50">
                        <td className="px-4 py-3">
                          {p.imageUrl ? (
                            <img src={p.imageUrl} alt={p.name} className="h-12 w-12 object-cover rounded" />
                          ) : (
                            <span className="text-gray-400">—</span>
                          )}
                        </td>
                        <td className="px-4 py-3 font-medium text-gray-900">{p.name}</td>
                        <td className="px-4 py-3 max-w-md truncate text-gray-700">{p.description}</td>
                        <td className="px-4 py-3">${p.price.toFixed(2)}</td>
                        <td className="px-4 py-3">
                          <span className={`inline-flex items-center rounded-md border px-2 py-0.5 text-xs ${p.stock > 0 ? "text-green-700 border-green-300" : "text-red-700 border-red-300"}`}>
                            {p.stock}
                          </span>
                        </td>
                        <td className="px-4 py-3 space-x-2">
                          <Modal>
                            <Button size="sm" variant="secondary" onPress={() => openEdit(p)}>Edit</Button>
                            <Modal.Backdrop>
                              <Modal.Container>
                                <Modal.Dialog className="sm:max-w-[480px]">
                                  <Modal.CloseTrigger />
                                  <Modal.Header>
                                    <Modal.Heading>Edit Product</Modal.Heading>
                                  </Modal.Header>
                                  <Modal.Body>
                                    <div className="space-y-4">
                                      <Input
                                        value={editForm.id === p.id ? editForm.name : p.name}
                                        onChange={(e) => setEditForm((f) => ({ ...f, id: p.id, name: e.target.value }))}
                                      />
                                      <div>
                                        <label className="text-sm text-gray-600">Description</label>
                                        <textarea
                                          className="mt-1 w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-gray-200"
                                          rows={4}
                                          value={editForm.id === p.id ? editForm.description : p.description}
                                          onChange={(e) => setEditForm((f) => ({ ...f, id: p.id, description: e.target.value }))}
                                        />
                                      </div>
                                      <div className="grid grid-cols-2 gap-4">
                                        <Input
                                          type="number"
                                          value={editForm.id === p.id ? editForm.price : String(p.price)}
                                          onChange={(e) => setEditForm((f) => ({ ...f, id: p.id, price: e.target.value }))}
                                        />
                                        <Input
                                          type="number"
                                          value={editForm.id === p.id ? editForm.stock : String(p.stock)}
                                          onChange={(e) => setEditForm((f) => ({ ...f, id: p.id, stock: e.target.value }))}
                                        />
                                      </div>
                                      <div>
                                        <label className="text-sm text-gray-600">Image (optional)</label>
                                        <input
                                          type="file"
                                          accept="image/*"
                                          onChange={(e) => {
                                            const file = e.target.files?.[0] || null;
                                            setEditImageFile(file);
                                            if (editImagePreview) {
                                              URL.revokeObjectURL(editImagePreview);
                                            }
                                            setEditImagePreview(file ? URL.createObjectURL(file) : null);
                                            // ensure editing the correct product
                                            setEditForm((f) => ({ ...f, id: p.id }));
                                          }}
                                          className="mt-1 block w-full text-sm"
                                        />
                                        <div className="mt-2 flex items-center gap-3">
                                          {editImagePreview ? (
                                            <img src={editImagePreview} alt="Preview" className="h-20 w-20 object-cover rounded" />
                                          ) : p.imageUrl ? (
                                            <img src={p.imageUrl} alt={p.name} className="h-20 w-20 object-cover rounded" />
                                          ) : null}
                                        </div>
                                      </div>
                                    </div>
                                  </Modal.Body>
                                  <Modal.Footer>
                                    <Button slot="close" variant="tertiary">Cancel</Button>
                                    <Button variant="secondary" onPress={handleEditSave} isPending={editPendingId === p.id} slot="close">Save</Button>
                                  </Modal.Footer>
                                </Modal.Dialog>
                              </Modal.Container>
                            </Modal.Backdrop>
                          </Modal>
                          <Modal>
                            <Button size="sm" variant="danger">Delete</Button>
                            <Modal.Backdrop>
                              <Modal.Container>
                                <Modal.Dialog className="sm:max-w-[380px]">
                                  <Modal.CloseTrigger />
                                  <Modal.Header>
                                    <Modal.Heading>Delete Product</Modal.Heading>
                                  </Modal.Header>
                                  <Modal.Body>
                                    <p>Are you sure you want to delete product <strong>{p.name}</strong>?</p>
                                  </Modal.Body>
                                  <Modal.Footer>
                                    <Button slot="close" variant="tertiary">Cancel</Button>
                                    <Button variant="danger" onPress={() => handleDelete(p.id)} isPending={deletingId === p.id} slot="close">Delete</Button>
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
