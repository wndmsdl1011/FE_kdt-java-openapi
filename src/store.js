import { configureStore } from "@reduxjs/toolkit";
import newsReducer from "./slice/newsSlice";
import disasterReducer from "./slice/disasterSlice";

const store = configureStore({
  reducer: {
    news: newsReducer,
    disaster: disasterReducer,
  },
});

// ✅ 개발 중에 Redux Store를 브라우저에서 접근할 수 있도록 등록
if (window) {
  window.store = store;
}

export default store;
