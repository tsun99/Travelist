type DebouncedFunction<Args extends unknown[]> = ((...args: Args) => void) & {
  cancel: () => void;
};

function debounce<Args extends unknown[]>(fn: (...args: Args) => void, delay: number): DebouncedFunction<Args> {
  let timeoutID: NodeJS.Timeout | null = null;

  const debounced: DebouncedFunction<Args> = (...args: Args) => {
    if (timeoutID) {
      clearTimeout(timeoutID);
    }

    timeoutID = setTimeout(() => {
      fn(...args);
    }, delay);
  };

  debounced.cancel = () => {
    if (timeoutID) {
      clearTimeout(timeoutID);
    }
  };

  return debounced;
}

export default debounce;