import Link from "next/link";

const ADMIN_ROUTES = [
  { name: "Dashboard", path: "/admin" },
  { name: "Users", path: "/admin/users" },
  { name: "Posts", path: "/admin/posts" },
  { name: "Devices", path: "/admin/devices" },
  { name: "Products", path: "/admin/products" },
  { name: "Orders", path: "/admin/orders" },
  { name: "Settings", path: "/admin/settings" },
];

export default function AdminSidebar() {
  return (
    <aside className="w-64 bg-gray-900 text-white h-full p-6 border-r border-gray-800">
      <nav className="space-y-4">
        {ADMIN_ROUTES.map((route) => (
          <Link
            key={route.path}
            href={route.path}
            className="block px-4 py-2 rounded hover:bg-gray-800 transition-colors"
          >
            {route.name}
          </Link>
        ))}
      </nav>
    </aside>
  );
}