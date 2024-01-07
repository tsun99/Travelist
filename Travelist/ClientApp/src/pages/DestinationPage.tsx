import { useEffect, useState } from 'react';
import { FaTrash } from 'react-icons/fa';
import { useSelector } from 'react-redux';
import { useNavigate, useParams } from 'react-router';
import { Link } from 'react-router-dom';

import { deleteDestination, getDestinationById } from '../api/destinationService.ts';
import Checklist from '../components/Checklist/Checklist.tsx';
import CommentSection from '../components/Comments/CommentsSection.tsx';
import DestinationHeader from '../components/DestinationHeader/DestinationHeader.tsx';
import CommentInput from '../components/Input/CommentInput.tsx';
import LikeAndInfoSection from '../components/LikeAndInfoSection/LikeAndInfoSection.tsx';
import LocationMap from '../components/LocationMap/LocationMap.tsx';
import DeleteConfirmationModal from '../components/Modals/DeleteModal.tsx';
import { RootState } from '../redux/stores/store.ts';
import { DestinationType } from '../types/destinationTypes.ts';

export default function DestinationPage() {
  const { id } = useParams();
  const [destination, setDestination] = useState<DestinationType | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const { currentUser } = useSelector((state: RootState) => state.user);
  const [refreshComments, setRefreshComments] = useState(true);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState<boolean>(false);

  const navigate = useNavigate();

  const openDeleteModal = () => {
    setIsDeleteModalOpen(true);
  };

  const handleLikeUpdate = (liked: boolean) => {
    if (destination) {
      setDestination({
        ...destination,
        likes: liked ? destination.likes + 1 : destination.likes - 1,
        isLiked: liked,
      });
    }
  };

  useEffect(() => {
    const fetchDestination = async () => {
      try {
        const result = await getDestinationById(Number(id));
        setDestination(result);
      } catch (err) {
        if (err instanceof Error) {
          setError(err.message);
        } else {
          setError('An unknown error occurred');
        }
      } finally {
        setLoading(false);
      }
    };

    if (id) {
      fetchDestination().catch(() => { 
      }) ;
    }
  }, [id]);

  const handleDelete = async () => {
    try {
      if(destination) {
        await deleteDestination(destination.id);
        navigate('/');
      }
    } catch(err) {
      console.log(err);
    }
  };

  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error}</div>;
  if (!destination) return <div>No destination found.</div>;

  const isCurrentUserOwner = currentUser?.username === destination.user.username;

  return (
    <div className='container w-full'>
      <DestinationHeader destination={destination} />
      <div className='p-8'>
        <div className='flex flex-row justify-between'>
          <div className='mb-12 flex flex-col gap-4'>
            <div className='flex gap-4'>
              <h2 className='text-2xl font-semibold'>{destination.title}</h2>
              <LikeAndInfoSection destination={destination} onLikeUpdate={handleLikeUpdate} />
            </div>
            <p>{destination.text}</p>
          </div>
          {isCurrentUserOwner && (
            <div className='flex flex-col space-y-2'>
              <Link to={`/destinationFormEdit/${destination.id}`}>
                <button className='bg-green hover:bg-green-hover self-start rounded-md px-4 py-2 font-bold text-white transition duration-300 ease-in-out' type='button'>
                  Edit Post
                </button>
              </Link>
              {/* eslint-disable-next-line @typescript-eslint/no-misused-promises */}
              <button type='button' className='bg-red hover:bg-red-hover flex w-full items-center justify-center rounded-md px-4 py-2 text-white transition duration-300 ease-in-out' onClick={openDeleteModal}>
                <FaTrash />
              </button>
            </div>
          )}
        </div>

        <div className='flex flex-col gap-8 sm:flex-row sm:justify-between'>
          <div className='sm:w-[40%]'>
            <h3 className='mb-4 font-semibold'>Suggested items to take:</h3>
            <Checklist itemsToPack={destination.itemsToPack} destinationId={destination.id} />          
          </div>
          <div className='z-10 sm:w-[50%]'>
            <h3 className='mb-4 font-semibold sm:text-center'>On the map:</h3>
            <LocationMap location={destination.location} title={destination.title} />
          </div>
        </div>
        <div className='flex flex-col'>
          <hr className='border-gray-hover my-8 border-t' />
          <div className='mb-8'>
            <h2 className='text-2xl font-semibold'>Comments Section</h2>
            {/* eslint-disable-next-line @typescript-eslint/no-misused-promises */}
            <CommentInput id={destination.id} triggerRefresh={() => setRefreshComments(true)} />
            <CommentSection id={destination.id} refreshComments={refreshComments} resetRefresh={() => setRefreshComments(false)} />
          </div>
        </div>
      </div>
      <DeleteConfirmationModal
        isOpen={isDeleteModalOpen}
        onClose={() => setIsDeleteModalOpen(false)}
        // eslint-disable-next-line @typescript-eslint/no-misused-promises
        onConfirm={handleDelete}
        itemName="post"
      />
    </div>
  );
}