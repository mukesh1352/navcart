import {
  createRootRoute,
  createRoute,
  createRouter,
} from "@tanstack/react-router";
import { Outlet } from "@tanstack/react-router";
import Login from "../pages/login";
import Signup from "../pages/signup";
import Header from "../components/Header";
import Map1 from "../pages/map1";
import Home from "../pages/Home";
import Finder from "../pages/Finder";
import MultiItemFinder from "../pages/MultiFinder";
import StoreLocator from "../pages/storelocator";
import InventoryDashboard from "../pages/inventorydashboard";

// Layout Route (Root)
const rootRoute = createRootRoute({
  component: () => (
    <>
      <Header />
      <Outlet />
    </>
  ),
});

const inventoryroute = createRoute({
  getParentRoute:()=>rootRoute,
  path:"/inventory",
  component:InventoryDashboard
})

//Home page
const storelocatorroute = createRoute({
  getParentRoute :()=>rootRoute,
  path:"/storelocator",
  component:StoreLocator
})
const Multifinderroute = createRoute({
  getParentRoute:()=>rootRoute,
  path:"/multifinder",
  component:MultiItemFinder
})

const Homeroute = createRoute({
  getParentRoute:()=>rootRoute,
  path:"/",
  component: Home,
})

const FinderRoute = createRoute({
  getParentRoute:()=>rootRoute,
  path:"/finder",
  component:Finder
})

// /login
const loginRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/login",
  component: Login,
});

// /signup
const signupRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/signup",
  component: Signup,
});

const maproute = createRoute({
  getParentRoute:()=>rootRoute,
  path:"/map",
  component:Map1
})
// Route tree
const routeTree = rootRoute.addChildren([loginRoute, signupRoute,maproute,Homeroute,FinderRoute,Multifinderroute,storelocatorroute,inventoryroute]);

export const router = createRouter({ routeTree });
