import { useEffect, useState } from 'react';
import { useSelector , useDispatch } from 'react-redux';
import { useNavigate, useParams } from 'react-router-dom';

import { deleteAccount, getPublicUser } from '../api/userService.ts';
import Contribution from '../components/Location/Contribution.tsx';
import Profile from '../components/Profile/Profile.tsx';
import { logout } from '../redux/slices/userSlice.ts';
import { RootState } from '../redux/stores/store.ts';

export default function ProfilePage() {
  const { username: urlUsername } = useParams();
  const { currentUser } = useSelector((state: RootState) => state.user);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const [userProfile, setUserProfile] = useState(currentUser || null);
  const isCurrentUser = urlUsername === currentUser?.username || !urlUsername;

  const logoutHandler = () => {
    localStorage.removeItem('token');
    dispatch(logout());
    navigate('/');
  };

  const deleteAccountHandler = async () => {
    const password = prompt('Enter your password to delete account');
    if (password) {
      try {
        const token = localStorage.getItem('token');
        if (!token) {
          throw new Error('Token not found');
        }

        await deleteAccount(token, password);
        logoutHandler();
      } catch(err) {
        console.log(err);
      }
    }
  };

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) { 
      navigate('/login');
    }
    if (urlUsername && urlUsername !== currentUser?.username) {
      const fetchUser = async () => {
        try {
          const user = await getPublicUser(urlUsername);
          setUserProfile(user);
        } catch(err) {
          console.log(err);
        }
      };
      fetchUser();
    } else {
      setUserProfile(currentUser);
    }
  }, [urlUsername, currentUser]);

  return (
    <div className='container'>
      {userProfile && (
        <>
          <Profile 
            name={userProfile.name}
            imageUrl={userProfile.imageUrl as string}
            email={userProfile.email}
            profileUrl={isCurrentUser ? `${window.location.origin}/profile/${userProfile.username}` : undefined}
            handleLogout={isCurrentUser ? logoutHandler : undefined}
            handleDeleteAccount={isCurrentUser ? deleteAccountHandler : undefined}
          />
          <Contribution username={userProfile.username} />
        </>
      )}
    </div>
  );
}
