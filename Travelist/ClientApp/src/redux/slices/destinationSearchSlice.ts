import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface DestinationSearchState {
  isFocused: boolean;
  searchSuggestions: string[];
  // Updated on every key stroke
  searchQuery: string;
  // Updated when the user is searching for something
  searchTerm: string;
  areSuggestionsOpen: boolean;
  isLoading: boolean;
}

const initialState: DestinationSearchState = {
  isFocused: false,
  searchSuggestions: [],
  searchQuery: '',
  searchTerm: '',
  areSuggestionsOpen: false,
  isLoading: false,
};

const destinationSearchSlice = createSlice({
  name: 'destinationSearch',
  initialState,
  reducers: {
    setFocus: (state, action: PayloadAction<boolean>) => {
      state.isFocused = action.payload;
    },
    setSearchSuggestions: (state, action: PayloadAction<string[]>) => {
      state.searchSuggestions = action.payload;
    },
    setSearchQuery: (state, action: PayloadAction<string>) => { 
      state.searchQuery = action.payload;
    },
    setSearchTerm: (state, action: PayloadAction<string>) => {
      state.searchTerm = action.payload;
    },
    setAreSuggestionsOpen: (state, action: PayloadAction<boolean>) => { 
      state.areSuggestionsOpen = action.payload;
    },
    setLoading: (state, action: PayloadAction<boolean>) => {
      state.isLoading = action.payload;
    },
  },
});

export const { setFocus, setSearchSuggestions, setSearchQuery, setSearchTerm, setAreSuggestionsOpen, setLoading } = destinationSearchSlice.actions;
export default destinationSearchSlice.reducer;