import type { RouteObject } from "react-router-dom";

import About from "../pages/About";
import Cart from "../pages/Cart";
import Checkout from "../pages/Checkout";
import Contact from "../pages/Contact";
import Index from "../pages/Index";
import ProductDetail from "../pages/ProductDetail";
import Products from "../pages/Products";

export const publicRoutes: RouteObject[] = [
  {
    index: true,
    element: <Index />,
  },
  {
    path: "products",
    element: <Products />,
  },
  {
    path: "products/:id",
    element: <ProductDetail />,
  },
  {
    path: "cart",
    element: <Cart />,
  },
  {
    path: "checkout",
    element: <Checkout />,
  },
  {
    path: "about",
    element: <About />,
  },
  {
    path: "contact",
    element: <Contact />,
  },
];
