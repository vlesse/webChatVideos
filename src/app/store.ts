import { configureStore } from "@reduxjs/toolkit";
import { authSlice } from "./Slices/AuthSlice";
import { meetingsSlice } from "./Slices/MeetingSlice";


export const store = configureStore({
    reducer: {
        auth: authSlice.reducer,
        meetings: meetingsSlice.reducer,
    },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;