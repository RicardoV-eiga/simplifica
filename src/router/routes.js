const routes = [
  {
    path: "/",
    component: () => import("layouts/MainLayout.vue"),
    children: [
      { path: "TIestoque", component: () => import("src/pages/t.i.vue") },
      { path: "geral", component: () => import("src/pages/geral.vue") },
      { path: "login", component: () => import("src/pages/login.vue") },
      { path: "relatorio", component: () => import("src/pages/relatorio.vue") },
    ],
  },

  // Always leave this as last one,
  // but you can also remove it
  {
    path: "/:catchAll(.*)*",
    component: () => import("pages/ErrorNotFound.vue"),
  },
];

export default routes;
