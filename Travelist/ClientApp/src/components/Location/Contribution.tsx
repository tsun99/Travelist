import { useEffect, useState } from 'react';

import Location from './Location.tsx';

import { queryContribution } from '../../api/destinationService.ts';
import { DestinationPreviewType } from '../../types/destinationTypes.ts';

export default function Contribution({ username } : { username: string }) {
  const [locations, setLocations] = useState<DestinationPreviewType[]>([]);

  useEffect(() => {
    const fetchLocations = async () => {
      try {
        const data = await queryContribution(username, -1, 0);
        setLocations(data);
      } catch(err) {
        console.log(err);
      }
    };

    fetchLocations();
  }, [Contribution, username]);

  return(
    <>
      <div className='mt-8'>
        <div className='p-4 text-center'>
            <h2 className='text-green text-3xl font-semibold'>Contribution</h2>
        </div>
        <section className="mt-8 flex flex-wrap justify-center">
          {locations.length > 0 ? (locations.map((location) => (
            <div key={location.id} className='mb-8 w-1/2 px-4 sm:w-1/2 md:w-1/2 lg:w-1/3 xl:w-1/4'>
              <Location destination={location} />
            </div>
          ))) : (
            <p>No contribution yet</p>
          )}
        </section>
      </div>
    </>
  );
}