import { useRef, useState, useCallback, useLayoutEffect } from "react";

interface UseVirtualListOptions<T> {
  items: T[];
  itemHeight: number;
  containerHeight: number;
}

/**
 * Simple virtual list hook (no library)
 */
export function useVirtualList<T>({
  items,
  itemHeight,
  containerHeight,
}: UseVirtualListOptions<T>) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [scrollTop, setScrollTop] = useState(0);

  const totalHeight = items.length * itemHeight;
  const visibleCount = Math.ceil(containerHeight / itemHeight);
  const startIndex = Math.floor(scrollTop / itemHeight);
  const endIndex = Math.min(startIndex + visibleCount + 3, items.length); // +3 overscan

  const visibleItems = items.slice(startIndex, endIndex);

  const handleScroll = useCallback(() => {
    if (containerRef.current) {
      setScrollTop(containerRef.current.scrollTop);
    }
  }, []);

  useLayoutEffect(() => {
    const container = containerRef.current;
    if (!container) return;
    container.addEventListener("scroll", handleScroll);
    return () => container.removeEventListener("scroll", handleScroll);
  }, [handleScroll]);

  return {
    containerRef,
    visibleItems,
    totalHeight,
    offsetY: startIndex * itemHeight,
  };
}
