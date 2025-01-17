import dataReducer, { fetchData, DataState } from './dataSlice';
import { configureStore } from '@reduxjs/toolkit';
import thunk from 'redux-thunk';

// Mock fetch API
global.fetch = jest.fn();

const initialState: DataState = {
  data: [],
  loading: false,
  error: null,
};

describe('dataSlice', () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should return the initial state when passed an empty action', () => {
    const result = dataReducer(undefined, { type: '' });
    expect(result).toEqual(initialState);
  });

  it('should set loading to true when fetchData is pending', () => {
    const action = { type: fetchData.pending.type };
    const state = dataReducer(initialState, action);
    expect(state).toEqual({
      ...initialState,
      loading: true,
    });
  });

  it('should populate data and set loading to false when fetchData is fulfilled', () => {
    const mockData = [{ id: 1, name: 'John Doe' }];
    const action = { type: fetchData.fulfilled.type, payload: mockData };
    const state = dataReducer(initialState, action);
    expect(state).toEqual({
      ...initialState,
      loading: false,
      data: mockData,
    });
  });

  it('should set an error message and set loading to false when fetchData is rejected', () => {
    const mockError = 'Failed to fetch data';
    const action = { type: fetchData.rejected.type, payload: mockError };
    const state = dataReducer(initialState, action);
    expect(state).toEqual({
      ...initialState,
      loading: false,
      error: mockError,
    });
  });

  it('should handle fetchData thunk - success', async () => {
    const mockData = [{ id: 1, name: 'John Doe' }];
    (fetch as jest.Mock).mockResolvedValueOnce({
      ok: true,
      json: async () => mockData,
    });

    const store = configureStore({
      reducer: dataReducer,
      middleware: [thunk],
    });

    await store.dispatch(fetchData() as any);
    const state = store.getState();

    expect(fetch).toHaveBeenCalledWith('/users.json');
    expect(state).toEqual({
      data: mockData,
      loading: false,
      error: null,
    });
  });

  it('should handle fetchData thunk - failure', async () => {
    const mockError = 'Network error';
    (fetch as jest.Mock).mockRejectedValueOnce(new Error(mockError));

    const store = configureStore({
      reducer: dataReducer,
      middleware: [thunk],
    });

    await store.dispatch(fetchData() as any);
    const state = store.getState();

    expect(fetch).toHaveBeenCalledWith('/users.json');
    expect(state).toEqual({
      data: [],
      loading: false,
      error: mockError,
    });
  });
});
