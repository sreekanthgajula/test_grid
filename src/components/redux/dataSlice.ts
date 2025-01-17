import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';

export interface DataState {
  data: { id: number; name: string }[];
  loading: boolean;
  error: string | null;
}

const initialState: DataState = {
  data: [],
  loading: false,
  error: null,
};

// Async thunk to fetch the mock data using fetch
export const fetchData = createAsyncThunk<
  { id: number; name: string }[],
  void,
  { rejectValue: string }
>('data/fetchData', async (_, thunkAPI) => {
  try {
    const response = await fetch('/users.json');
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    const data = await response.json();
    return data;
  } catch (error: any) {
    return thunkAPI.rejectWithValue(error.message);
  }
});

const dataSlice = createSlice({
  name: 'data',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchData.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchData.fulfilled, (state, action: PayloadAction<{ id: number; name: string }[]>) => {
        state.loading = false;
        state.data = action.payload;
      })
      .addCase(fetchData.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || 'Unknown error occurred';
      });
  },
});

export default dataSlice.reducer;
