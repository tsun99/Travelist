export default function Footer() { 
  const currentYear = new Date().getFullYear();
  return (
    <footer className="bg-green mt-[--footer-height] flex h-[--footer-height] items-center justify-center text-white">
      <p>© {currentYear} Travelist. All Rights Reserved.</p>
    </footer>
  );
}