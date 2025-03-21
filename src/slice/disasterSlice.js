// src/slice/disasterSlice.js
import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

export const fetchDisasterMessages = createAsyncThunk(
  "disaster/fetchDisasterMessages",
  async ({ query = "", page = 1, size = 10 } = {}, { rejectWithValue }) => {
    try {
      const endpoint = query
        ? "http://localhost:8080/api/disaster"
        : "http://localhost:8080/api/disaster/all";

      const response = await axios.get(endpoint, {
        params: { keyword: query, page, size },
      });

      return response.data;
    } catch (error) {
      let errData = error.response?.data || "데이터를 불러오지 못했습니다.";
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
    totalPages: 1,
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
        state.messages = action.payload.content || [];
        state.totalPages = action.payload.page?.totalPages || 1;
      })
      .addCase(fetchDisasterMessages.rejected, (state, action) => {
        state.loading = false;
        let err = action.payload;
        if (typeof err === "object") {
          err = err.message || JSON.stringify(err);
        }
        state.error = err;
      });
  },
});

export default disasterSlice.reducer;
