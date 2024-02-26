const routes = [
  {
    path: "/",
    component: () => import("layouts/MainLayout.vue"),
    children: [
      {
        name: "dashboard",
        path: "",
        component: () => import("pages/IndexPage.vue"),
      },
      {
        name: "order-taking",
        path: "order-taking",
        component: () => import("pages/OrderTakingPage.vue"),
      },
    ],
    meta: { requiresAuth: true },
  },
  {
    path: "/login",
    component: () => import("pages/Login.vue"),
  },
  // {
  //   path: '/point-of-sale',
  //   component: () => import('layouts/MainLayout.vue'),
  //   children: [
  //   ]
  // },

  // Always leave this as last one,
  // but you can also remove it
  {
    path: "/:catchAll(.*)*",
    component: () => import("pages/ErrorNotFound.vue"),
  },
];

export default routes;
