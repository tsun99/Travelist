import { useEffect } from 'react';
import { useSelector } from 'react-redux';

import { RootState } from '../../../redux/stores/store.ts';

import './search-bar-wrapper.css';

type SearchBarWrapperProps = {
  searchContainerRef: React.RefObject<HTMLDivElement>;
  children: React.ReactNode;
};

export default function SearchBarWrapper({ searchContainerRef, children }: SearchBarWrapperProps) {
  
  const { viewportWidth } = useSelector((state: RootState) => state.ui);
  const { areSuggestionsOpen } = useSelector((state: RootState) => state.destinationSearch);

  useEffect(() => {
    if (areSuggestionsOpen && viewportWidth < 450) {
      document.body.style.overflowY = 'hidden';
    } else {
      document.body.style.overflowY = 'auto';
    }

    return () => {
      document.body.style.overflowY = 'auto';
    };
  }, [areSuggestionsOpen, viewportWidth]);

  return (
    <div ref={searchContainerRef} className={viewportWidth > 450 || !areSuggestionsOpen ? 'search-bar-wrapper-desktop' : 'search-bar-wrapper-mobile'}>
      {children}
    </div>
  );
};