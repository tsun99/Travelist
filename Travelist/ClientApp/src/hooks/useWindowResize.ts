import { useEffect } from 'react';
import { useDispatch } from 'react-redux';

import { setViewportWidth } from '../redux/slices/uiSlice.ts';
import debounce from '../utils/debounce.ts';

const useWindowResize = () => {
  const dispatch = useDispatch();

  useEffect(() => {
    const handleResize = debounce(() => {
      dispatch(setViewportWidth(window.innerWidth));
    }, 300);

    window.addEventListener('resize', handleResize);
    handleResize(); // Set initial width

    return () => window.removeEventListener('resize', handleResize);
  }, [dispatch]);
};

export default useWindowResize;