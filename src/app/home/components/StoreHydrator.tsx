'use client';

import { useEffect, useRef } from 'react';
import { useAppDispatch } from '@/store/hooks';
import { setHomepageData, setHomepageError } from '@/features/homepage/homepageDataSlice';
import { HomePageResponse } from '@/features/homepage/homepage';

interface StoreHydratorProps {
  data: HomePageResponse | null;
}

export default function StoreHydrator({ data }: StoreHydratorProps) {
  const dispatch = useAppDispatch();
  const isHydrated = useRef(false);

  useEffect(() => {
    // We only want to hydrate the store once, on initial client render.
    if (!isHydrated.current) {
      if (data) {
        dispatch(setHomepageData(data));
      } else {
        dispatch(setHomepageError('Failed to fetch homepage data on the server.'));
      }
      isHydrated.current = true;
    }
  }, [data, dispatch]);

  return null; // This component renders nothing.
}
