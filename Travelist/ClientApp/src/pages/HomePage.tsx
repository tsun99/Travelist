import HeroSection from '../components/HeroSection/HeroSection.tsx';
import Locations from '../components/Location/Locations.tsx';

export default function HomePage() {
  return (
    <div className='container'>
      <HeroSection />
      <Locations />
    </div>
  );
}
