/**
 * Footer Component
 * Renders application footer text and hackathon branding line.
 * Props: none
 */
const Footer = () => {
  return (
    <footer className="border-t border-amber-200/70 bg-amber-50/60">
      <div className="mx-auto flex w-full max-w-7xl flex-col gap-2 px-4 py-5 text-sm text-amber-900/80 sm:px-6 lg:px-8">
        <p className="font-semibold">Retail Portal</p>
        <p>Built for fast demos: AI-assisted product content and low-stock event alerts.</p>
      </div>
    </footer>
  );
};

export default Footer;
