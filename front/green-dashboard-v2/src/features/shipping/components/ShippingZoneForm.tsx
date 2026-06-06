'use client';

import { useEffect, useState } from 'react';
import { Plus, Trash } from 'lucide-react';
import { COUNTRIES } from '../lib/countries';
import { shippingService } from '../api/shipping.api';
import {
  CreateShippingZoneDTO,
  ShippingZone,
  ShippingZoneLocationInput,
} from '../types';

interface ShippingZoneFormProps {
  initialData?: ShippingZone;
  onSubmit: (payload: CreateShippingZoneDTO) => Promise<void>;
  onCancel: () => void;
  isLoading?: boolean;
}

export function ShippingZoneForm({ initialData, onSubmit, onCancel, isLoading }: ShippingZoneFormProps) {
  const [name, setName] = useState(initialData?.name ?? '');
  const [price, setPrice] = useState(initialData?.price ?? 0);
  const [isActive, setIsActive] = useState(initialData?.isActive ?? true);
  const [countryOptions, setCountryOptions] = useState<string[]>(COUNTRIES);
  const [cityOptionsByCountry, setCityOptionsByCountry] = useState<Record<string, string[]>>({});
  const [loadingCountries, setLoadingCountries] = useState(false);
  const [locations, setLocations] = useState<ShippingZoneLocationInput[]>(
    initialData?.locations?.length
      ? initialData.locations.map((location) => ({
          country: location.country,
          city: location.city,
        }))
      : [{ country: '', city: '' }]
  );

  useEffect(() => {
    let mounted = true;
    setLoadingCountries(true);

    shippingService
      .getWorldCountries()
      .then((countries) => {
        if (mounted && countries.length) setCountryOptions(countries);
      })
      .catch(() => {
        if (mounted) setCountryOptions(COUNTRIES);
      })
      .finally(() => {
        if (mounted) setLoadingCountries(false);
      });

    return () => {
      mounted = false;
    };
  }, []);

  useEffect(() => {
    const uniqueCountries = Array.from(
      new Set(locations.map((location) => location.country).filter(Boolean))
    );
    uniqueCountries.forEach((country) => {
      void loadCities(country);
    });
    // Only run for initial data; country changes load cities directly in handleLocationChange.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const loadCities = async (country: string) => {
    if (!country || cityOptionsByCountry[country]) return;
    try {
      const cities = await shippingService.getWorldCities(country);
      setCityOptionsByCountry((prev) => ({ ...prev, [country]: cities }));
    } catch {
      setCityOptionsByCountry((prev) => ({ ...prev, [country]: [] }));
    }
  };

  const handleLocationChange = (
    index: number,
    key: keyof ShippingZoneLocationInput,
    value: string
  ) => {
    setLocations((prev) =>
      prev.map((loc, idx) =>
        idx === index
          ? {
              ...loc,
              [key]: value,
              ...(key === 'country' ? { city: '' } : {}),
            }
          : loc
      )
    );
    if (key === 'country') {
      void loadCities(value);
    }
  };

  const addLocationRow = () => {
    setLocations((prev) => [...prev, { country: '', city: '' }]);
  };

  const removeLocationRow = (index: number) => {
    setLocations((prev) => prev.filter((_, idx) => idx !== index));
  };

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    await onSubmit({
      name,
      price: Number(price),
      isActive,
      locations,
    });
  };

  return (
    <form className="space-y-4" onSubmit={handleSubmit}>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-2">
          <label className="block text-sm font-medium text-mintlify-text">Zone Name</label>
          <input
            type="text"
            required
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="w-full px-4 py-2 bg-mintlify-hover/30 text-mintlify-text rounded-lg focus:outline-none focus:ring-2 focus:ring-mintlify-accent/50"
          />
        </div>

        <div className="space-y-2">
          <label className="block text-sm font-medium text-mintlify-text">Zone Price</label>
          <input
            type="number"
            required
            min="0"
            step="0.01"
            value={price}
            onChange={(e) => setPrice(Number(e.target.value))}
            className="w-full px-4 py-2 bg-mintlify-hover/30 text-mintlify-text rounded-lg focus:outline-none focus:ring-2 focus:ring-mintlify-accent/50"
          />
        </div>
      </div>

      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <h3 className="text-sm font-medium text-mintlify-text">Locations (Country + City)</h3>
          <button
            type="button"
            onClick={addLocationRow}
            className="inline-flex items-center px-3 py-1.5 text-sm bg-mintlify-hover/30 text-mintlify-text rounded-lg hover:bg-mintlify-hover/50"
          >
            <Plus className="w-4 h-4 mr-1" />
            Add Location
          </button>
        </div>

        <div className="space-y-2">
          {locations.map((location, index) => (
            <div key={`${index}-${location.country}-${location.city}`} className="grid grid-cols-1 md:grid-cols-[1fr_1fr_auto] gap-2">
              <select
                required
                value={location.country}
                onChange={(e) => handleLocationChange(index, 'country', e.target.value)}
                className="w-full px-4 py-2 bg-mintlify-hover/30 text-mintlify-text rounded-lg focus:outline-none focus:ring-2 focus:ring-mintlify-accent/50"
              >
                <option value="">{loadingCountries ? 'Loading countries...' : 'Select country'}</option>
                {countryOptions.map((country) => (
                  <option key={country} value={country}>
                    {country}
                  </option>
                ))}
              </select>
              <input
                type="text"
                required
                placeholder="City"
                list={`shipping-zone-cities-${index}`}
                value={location.city}
                onChange={(e) => handleLocationChange(index, 'city', e.target.value)}
                className="w-full px-4 py-2 bg-mintlify-hover/30 text-mintlify-text rounded-lg focus:outline-none focus:ring-2 focus:ring-mintlify-accent/50"
              />
              <datalist id={`shipping-zone-cities-${index}`}>
                {(cityOptionsByCountry[location.country] ?? []).map((city) => (
                  <option key={`${location.country}-${city}`} value={city} />
                ))}
              </datalist>
              <button
                type="button"
                onClick={() => removeLocationRow(index)}
                disabled={locations.length === 1}
                className="px-3 py-2 rounded-lg text-mintlify-text-secondary hover:text-red-400 hover:bg-red-500/10 disabled:opacity-50 disabled:cursor-not-allowed"
                title="Remove location"
              >
                <Trash className="w-4 h-4" />
              </button>
            </div>
          ))}
        </div>
      </div>

      <div>
        <label className="inline-flex items-center gap-2 text-sm text-mintlify-text-secondary">
          <input
            type="checkbox"
            checked={isActive}
            onChange={(e) => setIsActive(e.target.checked)}
          />
          Active zone
        </label>
      </div>

      <div className="flex justify-end gap-3">
        <button
          type="button"
          onClick={onCancel}
          className="px-4 py-2 bg-mintlify-hover/30 text-mintlify-text-secondary rounded-lg hover:text-mintlify-text"
        >
          Cancel
        </button>
        <button
          type="submit"
          disabled={isLoading}
          className="px-4 py-2 bg-mintlify-accent text-white rounded-lg hover:bg-mintlify-accent-dark disabled:opacity-50"
        >
          {isLoading ? 'Saving...' : initialData ? 'Update Zone' : 'Create Zone'}
        </button>
      </div>
    </form>
  );
}
