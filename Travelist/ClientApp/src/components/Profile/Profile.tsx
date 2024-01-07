import Button from "../Button/Button";
import profilePlaceholder from '../../public/users/profile-placeholder.png';

interface ProfileProps {
  name: string;
  imageUrl: string | null;
  
  email?: string;
  profileUrl?: string;

  handleLogout?: () => void;
  handleEdit?: () => void;
  handleChangePassword?: () => void;
  handleDeleteAccount?: () => void;
}

export default function Profile({ 
  name, 
  imageUrl, 
  email, 
  profileUrl, 
  handleLogout, 
  handleEdit, 
  handleChangePassword, 
  handleDeleteAccount,
}: ProfileProps) {

  return (
    <div className="mx-auto md:w-fit p-8 sm:flex sm:space-x-6 bg-gray-900 text-gray-100">
      <div className="flex-shrink-0 w-full mb-6 h-44 sm:h-32 sm:w-32 sm:mb-0">
        <img src={imageUrl ?? profilePlaceholder} alt="" className="object-cover object-center w-full h-full rounded-xl bg-gray-500" />
      </div>
      <div className="flex flex-col justify-center">
        <div className='flex flex-col mb-4'>
          <div className='flex'>
            <h2 className="text-2xl font-semibold">{name}</h2>
            {handleLogout && (
              <Button title='Log Out' type='button' className='text-base ms-auto' theme='green' handleClick={handleLogout} />
            )}
          </div>
          {email && 
            <span className="text-gray-400">
              Email:{' '}
              <a href={`mailto:${email}`} className='text-green hover:underline'>
                {email}
              </a>
            </span>
          }
          {profileUrl && (
            <span className="text-gray-400">
              Public URL:{' '}
              <a href={profileUrl} className='text-green hover:underline'>
                {profileUrl}
              </a>
            </span>
          )}
        </div>
          <div className={"grid grid-cols-1 sm:grid-cols-3  gap-2" + (handleLogout ? ' mt-auto' : '')}>
            {handleEdit && (
              <Button title='Edit profile' type='button' theme='gray' handleClick={handleEdit} />
            )}

            {handleChangePassword && (
              <Button title='Change password' type='button' theme='gray' handleClick={handleChangePassword} />
            )}
            
            {handleDeleteAccount && (
              <Button title='Delete account' type='button' theme='black' handleClick={handleDeleteAccount} />
            )}
          </div>
      </div>
    </div>
  );
}