import { configureStore } from "@reduxjs/toolkit";
import { useReducer } from "react";
import cartReducer from "./cartSlice";
import userReducer from "./userSlice";


export default configureStore({
    reducer: {
      cart: cartReducer,
      user: userReducer,
    },
  });