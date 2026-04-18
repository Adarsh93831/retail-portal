/**
 * LoadMoreButton Component
 * Renders a reusable button for paginated "load more" UX.
 * Props: { onClick: Function, disabled?: Boolean, label?: String }
 */
const LoadMoreButton = ({ onClick, disabled = false, label = "Load More" }) => {
  return (
    <button
      onClick={onClick}
      disabled={disabled}
      className="rounded-full border border-brand-500 px-5 py-2 text-sm font-semibold text-brand-700 transition hover:bg-brand-50 disabled:cursor-not-allowed disabled:opacity-50"
    >
      {label}
    </button>
  );
};

export default LoadMoreButton;
