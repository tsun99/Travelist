import { Link } from 'react-router-dom';

import travelistLogo from '../../public/travelist-logo.svg';

export default function Logo() {
  return (
    <div className="flex items-center justify-between">
      <Link to="./">
        <img className='w-[10rem]' src={travelistLogo} alt="travelist logo" />
      </Link>

    </div>
  );
}
