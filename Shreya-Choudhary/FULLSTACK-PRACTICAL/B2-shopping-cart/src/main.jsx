import React from "react";
import { createRoot } from "react-dom/client";
import Cart from "./Cart.jsx";
import "./style.css";

const products = [
  { id: 1, name: "Notebook", price: 170 },
  { id: 2, name: "Pen", price: 30 },
  { id: 3, name: "Backpack", price: 850 },
];

createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <Cart products={products} />
  </React.StrictMode>
);
