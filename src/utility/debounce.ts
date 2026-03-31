export default function debounce<T extends (...args: any[]) => void>(fn: T, delay = 400) {
  let timer: NodeJS.Timeout;
  
  const debouncedFn = (...args: Parameters<T>) => {
    clearTimeout(timer);
    timer = setTimeout(() => fn(...args), delay);
  };
  
  // Add cancel method to clear pending calls
  debouncedFn.cancel = () => {
    clearTimeout(timer);
  };
  
  return debouncedFn as T & { cancel: () => void };
}
