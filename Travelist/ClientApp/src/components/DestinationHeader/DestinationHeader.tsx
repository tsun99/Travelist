import { FaMapMarkerAlt } from 'react-icons/fa';

import { DestinationType } from '../../types/destinationTypes.ts';

interface DestinationHeaderProps {
  destination: DestinationType
}

export default function DestinationHeader({ destination }:DestinationHeaderProps) {
  return (
    <div className='relative h-[50vh] max-h-[25rem] min-h-[10rem]'>
      <div className='absolute bottom-8 left-8 z-10 mb-4 flex items-center gap-4'>
        <div className='grid place-items-center rounded-full bg-white p-[0.5rem]'>
          <FaMapMarkerAlt className='text-green text-2xl' />
        </div>
        <h1 className='text-5xl font-bold text-white'>{destination.city}</h1>
      </div>
      <img className='absolute h-full w-full object-cover brightness-50' src={destination.imageUrl} alt="" />
    </div>
  );
}
