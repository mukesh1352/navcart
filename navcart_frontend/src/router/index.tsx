import {
  createRootRoute,
  createRoute,
  createRouter,
  RouterProvider,
} from "@tanstack/react-router";
import { Outlet } from "@tanstack/react-router";
import Home from "../pages/Home";
import StoreLocator from "../pages/storelocator"

// Root Route with layout using <Outlet />
const rootRoute = createRootRoute({
  component: () => <Outlet />,
});

// Define Home route
const homeRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/",
  component: Home,
});

// Define StoreLocator route
const storeLocatorRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/storelocator",
  component: StoreLocator,
});

// Add children to root route
const routeTree = rootRoute.addChildren([homeRoute, storeLocatorRoute]);

// Create the router
export const router = createRouter({ routeTree });

// Optionally, export RouterProvider to be used in main App
export const Router = () => <RouterProvider router={router} />;
