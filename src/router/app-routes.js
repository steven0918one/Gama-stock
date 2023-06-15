import {
  Profile,
  AdminComponentsPanel,
  AdminEditComponentsPanel,
  Logs,
  AdminSettings
} from "../pages";
export const appRoutes = [
  {
    path: "/",
    component: <AdminComponentsPanel />,
    protected: true,
    layout: true,
    type: "SUPER_ADMIN",
  },
  {
    path: "/admin/components/:id",
    component: <AdminEditComponentsPanel />,
    protected: true,
    layout: true,
    type: "SUPER_ADMIN",
  },

  {
    path: "/profile",
    component: <Profile />,
    protected: true,
    layout: true,
    type: "SUPER_ADMIN",
  },
  {
    path: "/logs",
    component: <Logs />,
    protected: true,
    layout: true,
    type: "SUPER_ADMIN",
  },
  {
    path: "/settings",
    component: <AdminSettings />,
    protected: true,
    layout: true,
    type: "SUPER_ADMIN",
  }
];
