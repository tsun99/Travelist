import { useEffect, useCallback } from 'react';
import { useDispatch } from 'react-redux';

import { getDestinationCities } from '../api/destinationService.ts';
import { setLoading, setSearchQuery, setSearchSuggestions } from '../redux/slices/destinationSearchSlice.ts';
import debounce from '../utils/debounce.ts';

const useFilteredSuggestions = (inputValue: string) => {
  const dispatch = useDispatch();

  const updateFilteredSuggestions = useCallback(async () => {
    const trimmedQuery = inputValue.trim().toLowerCase();
    dispatch(setSearchQuery(trimmedQuery));
    if (trimmedQuery === '') {
      dispatch(setSearchSuggestions([]));
      return;
    }

    dispatch(setLoading(true));
    try {
      const cities = await getDestinationCities();

      // Since cities are now just strings, filter them directly
      const filteredCities = cities.filter(city => city.toLowerCase().startsWith(trimmedQuery));

      dispatch(setSearchSuggestions(filteredCities.slice(0, 15)));
    } catch (error) {
      console.error('Error fetching destinations:', error);
    } finally {
      dispatch(setLoading(false));
    }
  }, [inputValue, dispatch]);

  useEffect(() => {
    const debouncedUpdate = debounce(() => {
      updateFilteredSuggestions().catch(error => {
        console.error('Error in updateFilteredSuggestions:', error);
      });
    }, 300);

    debouncedUpdate();

    return () => {
      if (debouncedUpdate.cancel) {
        debouncedUpdate.cancel();
      }
    };
  }, [inputValue, updateFilteredSuggestions]);
};

export default useFilteredSuggestions;