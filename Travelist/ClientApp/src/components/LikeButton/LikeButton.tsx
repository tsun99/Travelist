import { useState } from 'react';
import { useNavigate } from 'react-router';

import likedButtonImageHover from '../../public/likeButtons/likedButton-hover.png';
import likedButtonImage from '../../public/likeButtons/likedButton.png';
import unlikedButtonImageHover from '../../public/likeButtons/unlikedButton-hover.png';
import unlikedButtonImage from '../../public/likeButtons/unlikedButton.png';
import NoUserModal from '../Modals/NoUserModal.tsx';

interface LikeButtonProps {
    size: 'small' | 'medium' | 'large';
    locationId: number;
    liked: boolean;
    // a function to update the like count, updateLikes = 1 | -1
    onLikeUpdate?: (liked: boolean) => void;
}

const sizePadding = {
  small: 'p-4',
  medium: 'p-5',
  large: 'p-6',
};

export default function LikeButton({ size, locationId, liked, onLikeUpdate }: LikeButtonProps) {
  const navigate = useNavigate();

  const [isHovered, setIsHovered] = useState(false);
  const [isLiked, setIsLiked] = useState(liked);
  const [isModalOpen, setModalOpen] = useState(false);

  const handleMouseEnter = () => {
    setIsHovered(true);
  };

  const handleMouseLeave = () => {
    setIsHovered(false);
  };

  const handleLikeToggle = async (e: React.MouseEvent<HTMLElement>) => {
    e.stopPropagation();
    e.preventDefault();
    const token = localStorage.getItem('token');
    if(token) {
      try {
        const response = await fetch(`/api/travelentity/switch-like/${locationId}`, {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${token}`,
          }
        });
      
        if (!response.ok) {
          throw new Error('Failed to toggle like');
        }

        const data = await response.text();
        const newLikedStatus = data === 'true';
        setIsLiked(newLikedStatus);
        onLikeUpdate?.(newLikedStatus);

      } catch(error) {
        // if (error instanceof Error) {
        //   console.log(error.message);
        // }
        // console.log('unknown error occured');
      }
    }
    else {
      setModalOpen(true);
    }
  };

  const handleCloseModal = (e: React.MouseEvent<HTMLElement>) => {
    e.preventDefault();
    setModalOpen(false);
  };
  const handleLoginNavigate = (e: React.MouseEvent<HTMLElement>) => {
    e.preventDefault();
    navigate('/login');
  };

  let buttonImage;

  if(isLiked) {
    buttonImage = isHovered ? likedButtonImageHover : likedButtonImage;
  } else {
    buttonImage = isHovered ? unlikedButtonImageHover : unlikedButtonImage;
  }
  
  return (
    <>
      <button
        type="button"
        className={`h-fit w-fit ${sizePadding[size]}`}
        style={{
          backgroundImage: `url(${buttonImage})`,
          backgroundSize: 'cover',
          backgroundRepeat: 'no-repeat',
          transition: 'all',
          transitionTimingFunction: 'ease-in',
          transitionDuration: '300ms',
        }}
        // eslint-disable-next-line @typescript-eslint/no-misused-promises
        onClick={handleLikeToggle}
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
      />
      <NoUserModal isOpen={isModalOpen}
        onClose={handleCloseModal}
        onLogin={handleLoginNavigate} 
        displayMessage='You need to be logged in to like posts.' />
    </>
  );
}

LikeButton.defaultProps = {
  onLikeUpdate: () => { }
};
