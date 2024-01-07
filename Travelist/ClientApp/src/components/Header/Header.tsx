import { useEffect, useState } from 'react';

import Logo from '../Logo/Logo.tsx';
import Nav from '../Nav/Nav.tsx';

export default function Header() {
  const [isSticky, setIsSticky] = useState(false);

  const handleScroll = () => {
    if (window.scrollY > 0) {
      setIsSticky(true);
    } else {
      setIsSticky(false);
    }
  };

  useEffect(() => {
    window.addEventListener('scroll', handleScroll);
    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);

  return (
    <header role="banner" className={`sticky top-0 z-50 bg-white p-4 sm:h-[--header-height] ${isSticky && 'border-gray border-b'}`}>
      <div className="container flex flex-col  items-center justify-center gap-4 sm:flex-row sm:justify-between">
        <Logo />
        <Nav />
      </div>
    </header>
  );
}