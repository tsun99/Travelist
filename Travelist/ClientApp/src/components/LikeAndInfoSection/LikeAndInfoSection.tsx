import { DestinationType } from '../../types/destinationTypes.ts';
import LikeButton from '../LikeButton/LikeButton.tsx';

interface LikeAndInfoSectionProps {
  destination: DestinationType;
  onLikeUpdate: (liked: boolean) => void;
}

export default function LikeAndInfoSection({ destination, onLikeUpdate }: LikeAndInfoSectionProps) {
  return (
    <div className='flex items-center gap-3'>
      <LikeButton size="small" locationId={destination.id} liked={destination.isLiked} onLikeUpdate={onLikeUpdate} />
      <p className='font-semibold'>: {destination.likes}</p>
    </div>
  );
}