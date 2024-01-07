import HeroImg from '../../public/heroImg.png';
import DestinationSearchBar from '../DestinationSearchBar/SearchBar/SearchBar.tsx';

export default function HeroSection() {
  return (
    <section className="container relative h-[50vh] min-h-[15rem]">
      <img className="h-full w-full object-cover" src={HeroImg} alt="traveller in the forrest" />
      <DestinationSearchBar />
    </section>
  );
}