import { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';

import Location from './Location.tsx';

import { queryLocations } from '../../api/destinationService.ts';
import { RootState } from '../../redux/stores/store.ts';
import { DestinationPreviewType } from '../../types/destinationTypes.ts';

export default function Locations() {
  const [locations, setLocations] = useState<DestinationPreviewType[]>([]);
  const [error, setError] = useState<string | null>(null);
  const { searchTerm } = useSelector((state: RootState) => state.destinationSearch);

  useEffect(() => {
    const fetchLocations = async () => {
      try {
        setError(null);
        const data = await queryLocations(searchTerm, 50, 0);
        setLocations(data);
      } catch(err) {
        const errorMessage = err instanceof Error ? err.message : 'An unknown error occured while fetching posts. :(';
        setError(errorMessage);
      }
    };

    fetchLocations()
      .catch(() => {
        
      });
  }, [searchTerm]);

  return(
    <>
      {error && <div className='text-3xl text-black'>{error}</div>}
      <div className='mt-24'>
        <div className='p-4 text-center'>
          {searchTerm
            ? <h2 className='text-green text-3xl font-semibold'>Results for: {searchTerm}</h2>
            : <h2 className='text-green text-3xl font-semibold'>Most Popular Destinations</h2>
          }
        </div>
        <section className="mt-8 flex flex-wrap justify-center">
          {locations.length > 0 ? (locations.map((location) => (
            <div key={location.id} className='mb-8 w-1/2 px-4 sm:w-1/2 md:w-1/2 lg:w-1/3 xl:w-1/4'>
              <Location destination={location} />
            </div>
          ))) : (
            <p>No locations found</p>
          )}
        </section>
      </div>
    </>
  );
}