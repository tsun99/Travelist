import { useSelector } from 'react-redux';

import { RootState } from '../../../redux/stores/store.ts';

type SuggestionsDropdownProps = {
  suggestions: string[];
  highlightedIndex: number | null;
  onSuggestionClick: (event: React.MouseEvent<HTMLDivElement>) => void;
};

export default function SearchSuggestions({
  suggestions,
  highlightedIndex,
  onSuggestionClick,
}: SuggestionsDropdownProps) {

  const { viewportWidth } = useSelector((state: RootState) => state.ui);
  const { searchQuery } = useSelector((state: RootState) => state.destinationSearch);
  const { isLoading } = useSelector((state: RootState) => state.destinationSearch);

  return (
    // We're handling key listeners outside this component
    // eslint-disable-next-line jsx-a11y/click-events-have-key-events
    <div
      className={`mt-2 w-full overflow-y-auto rounded-lg bg-white ${viewportWidth > 450 ? 'absolute left-0 top-full h-auto max-h-[13rem] shadow-lg' : 'relative z-[100] max-h-[calc(100vh-8rem)] min-h-[20rem]'}`}
      onClick={onSuggestionClick}
      role="listbox"
      tabIndex={0}
    >
      {suggestions.length === 0 && searchQuery.length > 0 && !isLoading ? (
        <div className="px-4 py-2">No results found.</div>
      ) : (
        suggestions.map((suggestion, index) => (
          <div
            key={suggestion}
            role='option'
            aria-selected={highlightedIndex === index ? 'true' : 'false'}
            className={`hover:bg-gray focus:bg-gray cursor-pointer ${viewportWidth > 450 ? 'px-4 py-2' : 'px-4 py-5'} ${highlightedIndex === index ? 'bg-gray' : ''}`}
          >
            {suggestion}
          </div>
        ))
      )}
    </div>
  );
}
