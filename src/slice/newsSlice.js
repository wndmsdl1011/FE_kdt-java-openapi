// src/slice/newsSlice.js
import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

// 🔍 뉴스 데이터 불러오기 (검색 + 페이지네이션 지원)
export const fetchNews = createAsyncThunk(
  "news/fetchNews",
  async ({ query = "", page = 1, size = 9 } = {}, { rejectWithValue }) => {
    try {
      const endpoint = query
        ? "http://localhost:8080/api/news"
        : "http://localhost:8080/api/news/all";

      const response = await axios.get(endpoint, {
        params: { ynaTtl: query, page, size },
      });

      return response.data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data || "데이터를 불러오지 못했습니다."
      );
    }
  }
);

const newsSlice = createSlice({
  name: "news",
  initialState: {
    news: [],
    totalPages: 1,
    loading: false,
    error: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchNews.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchNews.fulfilled, (state, action) => {
        state.loading = false;
        state.news = action.payload.content || [];
        state.totalPages = action.payload.page?.totalPages || 1;
      })
      .addCase(fetchNews.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || "검색 요청에 실패했습니다.";
      });
  },
});

export default newsSlice.reducer;
