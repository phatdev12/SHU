"use client";

import { useEffect, useState } from "react";
import { Spinner, Button, Input, Modal } from "@heroui/react";
import Card from "@/components/ui/card";
import { $protectedFetchClient } from "@/lib/client";

interface Post {
  id: string;
  userId: string;
  title: string;
  aqiIndex: number;
  upVotes: number;
  downVotes: number;
  createdAt: string;
}

export default function PostsPage() {
  const [posts, setPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [search, setSearch] = useState("");
  const [deletingId, setDeletingId] = useState<string | null>(null);

  useEffect(() => {
    fetchPosts();
  }, [search]);

  const fetchPosts = async () => {
    try {
      setLoading(true);
      const response = await $protectedFetchClient.GET("/api/admin/posts", {
        params: { query: { search: search || undefined, limit: 100, offset: 0 } },
      });
      if (response.data) {
        setPosts(response.data.items);
      }
    } catch (err) {
      setError("Failed to fetch posts");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleDeletePost = async (id: string) => {
    try {
      setDeletingId(id);
      const response = await $protectedFetchClient.DELETE(`/api/admin/posts/{id}`, {
        params: { path: { id } },
      });
      if (response.data) {
        setPosts((prev) => prev.filter((p) => p.id !== id));
      }
    } catch (err) {
      console.error(err);
    } finally {
      setDeletingId(null);
    }
  };

  const getAQIColor = (aqi: number) => {
    if (aqi <= 50) return "success";
    if (aqi <= 100) return "primary";
    if (aqi <= 150) return "warning";
    return "danger";
  };

  const getAQILabel = (aqi: number) => {
    if (aqi <= 50) return "Good";
    if (aqi <= 100) return "Moderate";
    if (aqi <= 150) return "Unhealthy for SG";
    if (aqi <= 200) return "Unhealthy";
    if (aqi <= 300) return "Very Unhealthy";
    return "Hazardous";
  };

  return (
    <div className="flex-1 p-8 bg-gradient-to-br from-gray-50 to-gray-100">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-gray-900">Posts Management</h1>
          <p className="text-gray-600 mt-2">Moderate and manage community posts</p>
        </div>

        {/* Search */}
        <div className="mb-6">
          <Input
            placeholder="Search posts by title..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="max-w-xs"
          />
        </div>

        {/* Posts Table */}
        <Card className="bg-white shadow-md">
          <Card.Header className="bg-gray-50">
            <div className="flex flex-col">
              <Card.Title>Posts List</Card.Title>
              <Card.Description>Total: {posts.length}</Card.Description>
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
                      <th className="px-4 py-3 border-b">Title</th>
                      <th className="px-4 py-3 border-b">User ID</th>
                      <th className="px-4 py-3 border-b">AQI</th>
                      <th className="px-4 py-3 border-b">Votes</th>
                      <th className="px-4 py-3 border-b">Created</th>
                      <th className="px-4 py-3 border-b">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {posts.length === 0 ? (
                      <tr>
                        <td colSpan={6} className="px-4 py-8 text-center text-gray-500">
                          No posts found
                        </td>
                      </tr>
                    ) : (
                      posts.map((post) => (
                        <tr key={post.id} className="text-sm hover:bg-gray-50">
                          <td className="px-4 py-3 max-w-xs truncate font-medium text-gray-900">{post.title}</td>
                          <td className="px-4 py-3 font-mono text-xs text-gray-700">{post.userId.slice(0, 10)}...</td>
                          <td className="px-4 py-3">
                            <span className="inline-flex items-center rounded-md border px-2 py-0.5 text-xs text-gray-700">
                              {post.aqiIndex} ({getAQILabel(post.aqiIndex)})
                            </span>
                          </td>
                          <td className="px-4 py-3">
                            <div className="flex gap-3 items-center text-xs text-gray-700">
                              <span>👍 {post.upVotes}</span>
                              <span>👎 {post.downVotes}</span>
                            </div>
                          </td>
                          <td className="px-4 py-3 text-gray-600">{new Date(post.createdAt).toLocaleDateString()}</td>
                          <td className="px-4 py-3">
                            <Modal>
                              <Button size="sm" variant="danger">Delete</Button>
                              <Modal.Backdrop>
                                <Modal.Container>
                                  <Modal.Dialog className="sm:max-w-[380px]">
                                    <Modal.CloseTrigger />
                                    <Modal.Header>
                                      <Modal.Heading>Delete Post</Modal.Heading>
                                    </Modal.Header>
                                    <Modal.Body>
                                      <p>Are you sure you want to delete post <strong>{post.title}</strong>?</p>
                                    </Modal.Body>
                                    <Modal.Footer>
                                      <Button slot="close" variant="tertiary">Cancel</Button>
                                      <Button
                                        variant="danger"
                                        onPress={() => handleDeletePost(post.id)}
                                        isPending={deletingId === post.id}
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
