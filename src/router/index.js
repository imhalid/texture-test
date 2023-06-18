import { createRouter, createWebHistory } from "vue-router";
import World from "../components/World.vue";

const routes = createRouter({
  history: createWebHistory(),
  routes: [
    {
      path: "/",
      name: "World",
      component: World
    }
  ]
})

export default routes