import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { ServiceRequest } from '../../types/request.types';

interface RequestsState {
  requests: ServiceRequest[];
  selectedRequest: ServiceRequest | null;
  loading: boolean;
  search: string;
  filters: {
    category: string;
    priority: string;
    status: string;
    department: string;
  };
}

const initialState: RequestsState = {
  requests: [],
  selectedRequest: null,
  loading: false,
  search: '',
  filters: {
    category: 'All',
    priority: 'All',
    status: 'All',
    department: 'All'
  }
};

const requestsSlice = createSlice({
  name: 'requests',
  initialState,
  reducers: {
    setRequests(state, action: PayloadAction<ServiceRequest[]>) {
      state.requests = action.payload;
      state.loading = false;
    },
    setSelectedRequest(state, action: PayloadAction<ServiceRequest | null>) {
      state.selectedRequest = action.payload;
      state.loading = false;
    },
    setLoading(state, action: PayloadAction<boolean>) {
      state.loading = action.payload;
    },
    setSearch(state, action: PayloadAction<string>) {
      state.search = action.payload;
    },
    setFilter(state, action: PayloadAction<{ key: keyof RequestsState['filters']; value: string }>) {
      state.filters[action.payload.key] = action.payload.value;
    }
  }
});

export const { setRequests, setSelectedRequest, setLoading, setSearch, setFilter } = requestsSlice.actions;
export default requestsSlice.reducer;
