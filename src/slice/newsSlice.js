import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

// 🔹 뉴스 데이터 불러오기 (검색어가 있으면 검색, 없으면 전체 데이터 요청)
export const fetchNews = createAsyncThunk(
  "news/fetchNews",
  async (query = "", { rejectWithValue }) => {
    try {
      const response = query
        ? await axios.get("http://localhost:8080/api/news", {
            params: { ynaTtl: query },
          }) // 검색 기능
        : await axios.get("http://localhost:8080/api/news/all"); // 전체 데이터 요청

      return response.data.content || [];
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
    news: [], // 뉴스 데이터 저장
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
        state.news = action.payload; // ✅ 검색 결과 또는 전체 데이터 업데이트
      })
      .addCase(fetchNews.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || "검색 요청에 실패했습니다.";
      });
  },
});

export default newsSlice.reducer;
