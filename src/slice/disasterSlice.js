import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

// 🔹 비동기 재난 문자 요청 (검색어 포함)
export const fetchDisasterMessages = createAsyncThunk(
  "disaster/fetchDisasterMessages",
  async (query = "", { rejectWithValue }) => {
    try {
      if (query) {
        // 검색어 있는 경우
        const response = await axios.get("http://localhost:8080/api/disaster", {
          params: { keyword: query },
        });
        return response.data.content || [];
      } else {
        // 검색어 없는 경우(전체조회)
        const response = await axios.get(
          "http://localhost:8080/api/disaster/all"
        );
        return response.data.content || [];
      }
    } catch (error) {
      // 🔹 백엔드에서 { status, message, timestamp } 형태로 응답할 가능성이 있으므로, 문자열만 추출
      let errData = error.response?.data || "데이터를 불러오지 못했습니다.";
      // 만약 errData가 객체라면 errData.message만 추출하거나 JSON.stringify 처리
      if (typeof errData === "object") {
        errData = errData.message || JSON.stringify(errData);
      }
      return rejectWithValue(errData);
    }
  }
);

const disasterSlice = createSlice({
  name: "disaster",
  initialState: {
    messages: [],
    loading: false,
    error: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchDisasterMessages.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchDisasterMessages.fulfilled, (state, action) => {
        state.loading = false;
        state.messages = action.payload;
      })
      .addCase(fetchDisasterMessages.rejected, (state, action) => {
        state.loading = false;
        // action.payload가 문자열이 아니라 객체일 수도 있으므로 최종적으로 문자열만 저장
        let err = action.payload;
        if (typeof err === "object") {
          err = err.message || JSON.stringify(err);
        }
        state.error = err;
      });
  },
});

export default disasterSlice.reducer;
