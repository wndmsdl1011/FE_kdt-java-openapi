import { configureStore } from "@reduxjs/toolkit";
import newsReducer from "./slice/newsSlice";
import disasterReducer from "./slice/disasterSlice";

const store = configureStore({
  reducer: {
    news: newsReducer,
    disaster: disasterReducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({ serializableCheck: false }), // ✅ 비동기 액션 허용
  devTools: process.env.NODE_ENV !== "production", // ✅ 개발 모드에서만 Redux DevTools 활성화
});

// ✅ 개발 중 Redux Store를 브라우저에서 접근할 수 있도록 등록
if (window) {
  window.store = store;
}

export default store;
