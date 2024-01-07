import { useState } from 'react';
import { AiOutlineHeart } from 'react-icons/ai';
import { Link } from 'react-router-dom';

import { DestinationPreviewType } from '../../types/destinationTypes.ts';
import LikeButton from '../LikeButton/LikeButton.tsx';

interface LocationProps {
  destination: DestinationPreviewType;
}

function Location({ destination }: LocationProps) {
  const [likeCount, setLikeCount] = useState(destination.likes);

  const handleLikeCount = (liked: boolean) => {
    setLikeCount(liked ? likeCount + 1 : likeCount - 1);
  };
  // console.log(destination);
  return (
    <Link to={`/location/${destination.id}`}>
      <div className="container flex cursor-pointer flex-col overflow-hidden rounded-xl shadow-md transition-shadow hover:shadow-lg">
        <img
          src={destination.imageUrl}
          alt={destination.title}
          className="transition-scale aspect-square h-full w-full object-cover duration-300 hover:scale-105"
        />
        <div className='flex flex-row justify-between overflow-hidden p-4'>
          <div>
            <div className="line-clamp-2 text-sm font-semibold">{destination.title}</div>
          </div>

          <LikeButton size='medium' locationId={destination.id} liked={destination.isLiked} onLikeUpdate={handleLikeCount} />

        </div>
        <div className="flex flex-row justify-between overflow-hidden p-4">
          <div className='flex flex-col'>
            <p className="text-gray-title line-clamp-1 font-semibold">{destination.city}</p>
            <p className='line-clamp-1 text-black'>{destination.user.name}</p>
          </div>
          <div className='flex flex-row items-center'>
            <AiOutlineHeart 
              className='mr-2 h-6 w-6' />
            <p className='mr-4 whitespace-nowrap'>: {likeCount}</p>
          </div>
          
        </div>
      </div>
    
    </Link>
  );
  
}

export default Location;
