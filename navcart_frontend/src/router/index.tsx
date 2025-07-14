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
import Search from "../pages/Search";
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
const searchroute = createRoute({
	getParentRoute: () => rootRoute,
	path: "/search",
	component: Search,
});
// Store Locator route
const storeLocatorRoute = createRoute({
	getParentRoute: () => rootRoute,
	path: "/storelocator",
	component: StoreLocator,
});

// Add children to root route
const routeTree = rootRoute.addChildren([
	homeRoute,
	storeLocatorRoute,
	searchroute,
]);

// Create the router
export const router = createRouter({ routeTree });

// Provide the router
export const Router = () => <RouterProvider router={router} />;
