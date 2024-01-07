import { Link } from "react-router-dom";
import profilePlaceholder from '../../public/users/profile-placeholder.png';

interface ProfilePreviewProps {
  username?: string;
  name: string;
  imageUrl: string | null;
}

export default function ProfilePreview({ username = "", name, imageUrl }: ProfilePreviewProps) {
  return (
    <Link to={`/profile/${username}`} className='flex items-center border border-dark rounded-full ps-2'>
      {name}
      <img src={imageUrl ?? profilePlaceholder} alt={name} className='ms-2 h-8 w-8 rounded-full' />
    </Link>
  )
}