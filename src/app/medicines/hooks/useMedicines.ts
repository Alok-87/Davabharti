'use client';
import { useEffect, useState, useRef, useCallback } from 'react';

interface Medicine {
  productCode: string;
  productName: string;
  description?: string;
  mrp: number;
  salePrice: number;
  images?: string[];
}

interface MedicinesResponse {
  data: Medicine[];
  hasMore: boolean;
}

const LIMIT = 12; // configurable

export function useMedicines(searchTerm?: string) {
  const [medicines, setMedicines] = useState<Medicine[]>([]);
  const [offset, setOffset] = useState(0);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [hasMore, setHasMore] = useState(true);

  const abortControllerRef = useRef<AbortController | null>(null);

  const fetchMedicines = useCallback(async () => {
    if (loading || !hasMore) return;
    setLoading(true);
    setError(null);

    abortControllerRef.current?.abort();
    abortControllerRef.current = new AbortController();

    try {
      const query = new URLSearchParams({
        limit: LIMIT.toString(),
        offset: offset.toString(),
        ...(searchTerm ? { search_term: searchTerm } : {}),
      });

      const res = await fetch(`/api/medicines?${query.toString()}`, {
        signal: abortControllerRef.current.signal,
      });

      if (!res.ok) throw new Error('Failed to fetch medicines');
      const json: MedicinesResponse = await res.json();

      setMedicines((prev) => [...prev, ...json.data]);
      setHasMore(json.hasMore);
      setOffset((prev) => prev + LIMIT);
    } catch (err: any) {
      if (err.name !== 'AbortError') {
        setError(err.message);
      }
    } finally {
      setLoading(false);
    }
  }, [offset, searchTerm, hasMore, loading]);

  return { medicines, loading, error, hasMore, fetchMedicines };
}
