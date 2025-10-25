import { configureStore } from "@reduxjs/toolkit";
import authtication from "./Slicer/AuthSlicer";

export const store = configureStore({
    reducer: {
        auth: authtication
    }
})

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;