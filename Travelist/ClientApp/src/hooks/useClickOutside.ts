import { RefObject, useEffect } from 'react';

function useClickOutside<T extends HTMLElement>(
  ref: RefObject<T>,
  onClickOutside: () => void
): void {
  useEffect(() => {
    function handleClickOutside(event: MouseEvent | TouchEvent) {
      if (ref.current && !ref.current.contains(event.target as Node)) {
        onClickOutside();
      }
    }

    document.addEventListener('mousedown', handleClickOutside);
    document.addEventListener('touchstart', handleClickOutside);

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      document.removeEventListener('touchstart', handleClickOutside);
    };
  }, [ref, onClickOutside]);
}

export default useClickOutside;
