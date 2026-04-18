/**
 * Spinner Component
 * Renders a centered loading indicator for async page and API states.
 * Props: { label?: String }
 */
const Spinner = ({ label = "Loading..." }) => {
  return (
    <div className="flex w-full flex-col items-center justify-center gap-2 py-10 text-amber-800">
      <div className="h-10 w-10 animate-spin rounded-full border-4 border-amber-200 border-t-brand-600" />
      <p className="text-sm font-medium">{label}</p>
    </div>
  );
};

export default Spinner;
