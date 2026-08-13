import { Outlet, createFileRoute } from "@tanstack/react-router";

import { RoleProvider } from "@/components/admin/role";

export const Route = createFileRoute("/admin")({
  component: AdminLayout,
});

function AdminLayout() {
  return (
    <RoleProvider>
      <Outlet />
    </RoleProvider>
  );
}