import AdminSidebar from "@/components/ui/sidebar";

export default function AdminLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <div className="flex w-full h-screen">
      <AdminSidebar />
      {children}
    </div>
  );
}