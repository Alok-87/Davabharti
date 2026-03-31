'use client';

import { useEffect, useRef, useState } from 'react';
import { IoLocation } from 'react-icons/io5';
import { MdOutlineMyLocation } from 'react-icons/md';

type Suggestion = {
  city: string;
};


const STORAGE_KEY = 'selected_city_name';

// Blinkit-like “Popular Cities” quick picks
const POPULAR_CITIES = [
  'Delhi',
  'Mumbai',
  'Bengaluru',
  'Hyderabad',
  'Chennai',
  'Kolkata',
  'Pune',
  'Ahmedabad',
  'Jaipur',
  'Lucknow',
];

export default function LocationBox() {
  const [city, setCity] = useState<string>('');               // selected city (persisted)
  const [query, setQuery] = useState<string>('');             // input value
  const [loadingDetect, setLoadingDetect] = useState<boolean>(false);
  const [open, setOpen] = useState<boolean>(false);
  const [suggestions, setSuggestions] = useState<Suggestion[]>([]);
  const [searching, setSearching] = useState<boolean>(false);

  const wrapRef = useRef<HTMLDivElement | null>(null);
  const debounceRef = useRef<NodeJS.Timeout | null>(null);

  // ---- Helpers ----
  const saveCity = (name: string) => {
    setCity(name);
    setQuery(name);
    if (typeof window !== 'undefined') {
      localStorage.setItem(STORAGE_KEY, name);
    }
  };

  const reverseGeocode = async (lat: number, lon: number) => {
    try {
      const res = await fetch(
        `https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lon}&zoom=10&addressdetails=1`,
        { headers: { 'User-Agent': 'davabharti-location' } }
      );
      const data = await res.json();
      const resolvedCity =
        data?.address?.city ||
        data?.address?.town ||
        data?.address?.village ||
        data?.address?.suburb ||
        data?.address?.state_district ||
        data?.address?.state ||
        'Unknown area';
      saveCity(resolvedCity);
    } catch {
      // fallback text but don't overwrite input if user was typing
      if (!city) setQuery('Location not found');
    } finally {
      setLoadingDetect(false);
    }
  };

  const detectLocation = () => {
    if (!navigator.geolocation) {
      if (!city) setQuery('Not supported');
      return;
    }
    setLoadingDetect(true);
    navigator.geolocation.getCurrentPosition(
      pos => reverseGeocode(pos.coords.latitude, pos.coords.longitude),
      err => {
        setLoadingDetect(false);
        if (!city) {
          if (err.code === 1) setQuery('Permission denied');
          else setQuery('Unable to get location');
        }
      },
      { enableHighAccuracy: true, timeout: 10000 }
    );
  };

  const searchCities = async (q: string) => {
    if (!q || q.trim().length < 2) {
      setSuggestions([]);
      return;
    }
    setSearching(true);
    try {
      const url = `https://nominatim.openstreetmap.org/search?format=json&countrycodes=in&q=${encodeURIComponent(
        q
      )}&addressdetails=1&limit=10&accept-language=en`;
      const res = await fetch(url, { headers: { 'User-Agent': 'davabharti-location' } });
      const data = await res.json();

      // Map clean city names
      const mapped = data.map((item: any) => {
        const a = item.address || {};
        const cityName =
          a.city ||
          a.town ||
          a.village ||
          a.suburb ||
          a.state_district ||
          a.state ||
          item.display_name.split(',')[0];
        return { city: cityName };
      });

      // ✅ Remove duplicates
      const unique = Array.from(new Set(mapped.map(item => item.city))).map(city => ({ city }));
      setSuggestions(unique);
    } catch {
      setSuggestions([]);
    } finally {
      setSearching(false);
    }
  };


  // ---- Effects ----
  // Initialize from localStorage; if none, try detect
  useEffect(() => {
    if (typeof window === 'undefined') return;
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved) {
      setCity(saved);
      setQuery(saved);
    } else {
      setQuery('Detecting location...');
      detectLocation();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Debounce search when typing
  useEffect(() => {
    if (!open) return; // only search when dropdown is open
    if (debounceRef.current) clearTimeout(debounceRef.current);
    debounceRef.current = setTimeout(() => {
      searchCities(query);
    }, 300);
    return () => {
      if (debounceRef.current) clearTimeout(debounceRef.current);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [query, open]);

  // Close dropdown on outside click
  useEffect(() => {
    const onDocClick = (e: MouseEvent) => {
      if (wrapRef.current && !wrapRef.current.contains(e.target as Node)) {
        setOpen(false);
      }
    };
    document.addEventListener('mousedown', onDocClick);
    return () => document.removeEventListener('mousedown', onDocClick);
  }, []);

  // ---- UI Handlers ----
  const handleInputFocus = () => {
    setOpen(true);
    // Preload suggestions for current text
    if (query && query.length >= 2) searchCities(query);
  };

  const handlePickCity = (name: string) => {
    saveCity(name);
    setOpen(false);
  };

  return (
    <div className="relative w-full " ref={wrapRef}>
      {/* Input Shell (medium size, clean white) */}
      <div className="overflow-hidden flex items-center gap-2 bg-gray-100 px-4 py-2 rounded-lg w-full border border-gray-200">
        <IoLocation className="text-gray-600 text-xl shrink-0" />
        <input
          type="text"
          value={query}
          onFocus={handleInputFocus}
          onChange={(e) => {
            setQuery(e.target.value);
            setOpen(true);
          }}
          placeholder="Search or select your city"
          className="flex-1 outline-none bg-transparent text-sm"
        />
        <button
          type="button"
          onClick={detectLocation}
          className="p-1 rounded hover:bg-gray-100 transition cursor-pointer"
          aria-label="Detect my location"
          title="Detect my location"
        >
          <MdOutlineMyLocation
            className={`text-gray-700 text-xl ${loadingDetect ? 'animate-spin' : ''}`}
          />
        </button>
      </div>

      {/* Dropdown (Blinkit-style card) */}
      {open && (
        <div className="absolute z-50 mt-2 w-full rounded-xl border border-gray-200 bg-white shadow-xl overflow-hidden">
          {/* Popular Cities */}
          <div className="px-4 pt-3 pb-2">
            <div className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-2">
              Popular Cities
            </div>
            <div className="flex flex-wrap gap-2">
              {POPULAR_CITIES.map((c) => (
                <button
                  key={c}
                  onClick={() => handlePickCity(c)}
                  className="px-3 py-1.5 rounded-full border border-gray-200 text-sm text-gray-700 hover:border-gray-300 hover:bg-gray-50 transition"
                >
                  {c}
                </button>
              ))}
            </div>
          </div>

          <div className="h-px bg-gray-100" />

          {/* Search Results */}
          <div className="max-h-72 overflow-auto">
            {searching ? (
              <div className="px-4 py-3 text-sm text-gray-500">Searching…</div>
            ) : suggestions.length === 0 ? (
              <div className="px-4 py-3 text-sm text-gray-500">
                {query.trim().length < 2 ? 'Type at least 2 characters' : 'No results found'}
              </div>
            ) : (
              <ul className="py-1">
                {suggestions.map((s, idx) => (
                  <li key={`${s.city}-${idx}`}>
                    <button
                      onClick={() => handlePickCity(s.city)}
                      className="w-full text-left px-4 py-2.5 hover:bg-gray-100 transition text-sm"
                    >
                      {s.city}
                    </button>
                  </li>
                ))}
              </ul>

            )}
          </div>

          {/* Selected Summary (subtle footer) */}
          {city && (
            <>
              <div className="h-px bg-gray-100" />
              <div className="px-4 py-2.5 text-xs text-gray-500">
                Selected city: <span className="font-medium text-gray-700">{city}</span>
              </div>
            </>
          )}
        </div>
      )}
    </div>
  );
}
