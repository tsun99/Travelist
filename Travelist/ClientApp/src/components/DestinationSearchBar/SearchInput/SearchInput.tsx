import { FaArrowLeft } from 'react-icons/fa';
import { FiSearch } from 'react-icons/fi';
import { useSelector } from 'react-redux';

import { RootState } from '../../../redux/stores/store.ts';
import Button from '../../Button/Button.tsx';

type SearchInputProps = {
  inputValue: string;
  onInputChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
  onInputKeyDown: (event: React.KeyboardEvent<HTMLInputElement>) => void;
  onInputFocus: (event: React.FocusEvent<HTMLInputElement>) => void;
  onBackClick?: () => void;
  onSearchButtonClick: () => void;
  inputRef: React.RefObject<HTMLInputElement>;
};

export default function SearchInput({
  inputValue,
  onInputChange,
  onInputKeyDown,
  onInputFocus,
  onBackClick,
  onSearchButtonClick,
  inputRef,
}: SearchInputProps) { 
  const { viewportWidth } = useSelector((state: RootState) => state.ui);
  const { areSuggestionsOpen } = useSelector((state: RootState) => state.destinationSearch);
  return (
    <div className='relative w-full'>
      <FiSearch className='absolute left-4 top-[50%] hidden translate-y-[-50%] text-[1.25rem] sm:block' />
      {
        areSuggestionsOpen && viewportWidth < 450 && (
          <FaArrowLeft onClick={onBackClick} className='absolute left-4 top-[50%] translate-y-[-50%] cursor-pointer text-[1.25rem]' />
        )
      }
      <input 
        ref={inputRef}
        value={inputValue}
        className={viewportWidth > 450 || !areSuggestionsOpen ? 'border-gray focus:border-gray-focus/70 w-full rounded-full border-2 p-3 pl-4 pr-[4.5rem] shadow-2xl outline-none transition-all duration-300 ease-in-out sm:pl-[3rem] sm:pr-[6.5rem]' : `border-gray focus:border-gray-focus/70 w-full rounded-full border-2 p-3 transition-none ${areSuggestionsOpen ? 'pl-[3rem]' : 'pl-4'} pr-[4.5rem] shadow-sm outline-none transition-all duration-300 ease-in-out sm:pl-[3rem] sm:pr-[6.5rem]`}
        type="text"
        placeholder="Search Destinations..."
        onChange={onInputChange}
        onKeyDown={onInputKeyDown}
        onFocus={onInputFocus}
      />
      <Button handleClick={onSearchButtonClick} theme="black" title="" className='absolute right-2 top-[50%] translate-y-[-50%] py-2 sm:px-5'>
        <p className="hidden sm:block">Search</p>
        <FiSearch className="block text-[1.25rem] sm:hidden" />
      </Button>
    </div>
  );
}

SearchInput.defaultProps = {
  onBackClick: () => { },
  
};