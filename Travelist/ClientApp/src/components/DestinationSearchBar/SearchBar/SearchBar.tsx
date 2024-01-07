import { useRef, useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';

import useClickOutside from '../../../hooks/useClickOutside.ts';
import useFilteredSuggestions from '../../../hooks/useFilteredSuggestions.ts';
import useWindowResize from '../../../hooks/useWindowResize.ts';
import { setFocus, setSearchQuery, setAreSuggestionsOpen, setSearchTerm } from '../../../redux/slices/destinationSearchSlice.ts';
import { RootState } from '../../../redux/stores/store.ts';
import SearchBarWrapper from '../SearchBarWrapper/SearchBarWrapper.tsx';
import SearchInput from '../SearchInput/SearchInput.tsx';
import SearchSuggestions from '../SearchSuggestions/SearchSuggestions.tsx';

export default function SearchBar() {
  const [inputValue, setInputValue] = useState('');
  const [highlightedIndex, setHighlightedIndex] = useState<number | null>(null);
  const inputRef = useRef(null);
  const searchContainer = useRef(null);

  const { isFocused, searchSuggestions } = useSelector((state: RootState) => state.destinationSearch);
  const dispatch = useDispatch();

  const updateSearchState = (newInputValue: string) => {
    dispatch(setSearchTerm(newInputValue.trim()));
    dispatch(setSearchQuery(newInputValue.trim()));
    dispatch(setFocus(false));
    dispatch(setAreSuggestionsOpen(false));
    setHighlightedIndex(null);
    setInputValue(newInputValue);
  };

  useFilteredSuggestions(inputValue);
  useWindowResize();

  useEffect(() => { 
    if(!isFocused) setHighlightedIndex(null);;
  }, [isFocused]);

  useClickOutside(searchContainer, () => { 
    updateSearchState(inputValue);
  });

  const handleFocus = (event: React.FocusEvent<HTMLDivElement>) => {
    if (event.target === inputRef.current) {
      dispatch(setFocus(true));
    }
    dispatch(setAreSuggestionsOpen(true));
  };

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setInputValue(event.target.value);
  };

  const handleDestinationClick = (event: React.MouseEvent) => {
    const target = event.target as HTMLElement;
    if (target.textContent) {
      updateSearchState(target.textContent);
    }
  };

  const handleInputKeyDown = (event: React.KeyboardEvent<HTMLInputElement>) => { 
    switch (event.key) {
    case 'ArrowDown':
    case 'ArrowUp':
      handleUpAndDownKeys(event.key);
      break;
    case 'Enter':
      handleEnterKey();
      break;
    default:
      break;
    }
  };

  function handleUpAndDownKeys(key: string) {
    const direction = key.toLowerCase() === 'arrowdown' ? 1 : -1;
    const { length } = searchSuggestions;

    if (highlightedIndex === null) {
      setHighlightedIndex(direction === 1 ? 0 : length - 1);
      return;
    }

    setHighlightedIndex((highlightedIndex + direction + length) % length);
  }

  function handleEnterKey() {
    if (highlightedIndex !== null && searchSuggestions[highlightedIndex]) {
      updateSearchState(searchSuggestions[highlightedIndex]);
    } else if (inputValue.length > 0) { 
      updateSearchState(inputValue);
    }

    if (inputRef.current) { 
      (inputRef.current as HTMLInputElement).blur();
    }
   
  }

  const handleSearchButtonClick = () => { 
    updateSearchState(inputValue);
  };

  const handleBackClick = () => { 
    updateSearchState('');
  };

  return (
    <SearchBarWrapper searchContainerRef={searchContainer}>
      <SearchInput
        inputValue={inputValue}
        onInputChange={handleChange}
        onInputKeyDown={handleInputKeyDown}
        onInputFocus={handleFocus}
        onBackClick={handleBackClick}
        onSearchButtonClick={handleSearchButtonClick}
        inputRef={inputRef}
      />
      {isFocused && (
        <SearchSuggestions
          suggestions={searchSuggestions}
          highlightedIndex={highlightedIndex}
          onSuggestionClick={handleDestinationClick}
        />
      )}
    </SearchBarWrapper>
  );
}