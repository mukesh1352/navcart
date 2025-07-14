import {
	createRootRoute,
	createRoute,
	createRouter,
	RouterProvider,
} from "@tanstack/react-router";
import { Outlet } from "@tanstack/react-router";
import Home from "../pages/Home";
import StoreLocator from "../pages/storelocator";
import Header from "../components/Header";

// Root layout with Header + Outlet
const rootRoute = createRootRoute({
	component: () => (
		<>
			<Header />
			<Outlet />
		</>
	),
});

// Home route
const homeRoute = createRoute({
	getParentRoute: () => rootRoute,
	path: "/",
	component: Home,
});

// Store Locator route
const storeLocatorRoute = createRoute({
	getParentRoute: () => rootRoute,
	path: "/storelocator",
	component: StoreLocator,
});

// Add children to root route
const routeTree = rootRoute.addChildren([homeRoute, storeLocatorRoute]);

// Create the router
export const router = createRouter({ routeTree });

// Provide the router
export const Router = () => <RouterProvider router={router} />;
