import { WandSparkles } from "lucide-react";

/**
 * AIGenerateButton Component
 * Renders AI trigger button for generating product description and add-on suggestions.
 * Props: { onClick: Function, isLoading?: Boolean }
 */
const AIGenerateButton = ({ onClick, isLoading = false }) => {
  return (
    <button
      type="button"
      onClick={onClick}
      disabled={isLoading}
      className="inline-flex items-center gap-2 rounded-full bg-amber-900 px-4 py-2 text-sm font-semibold text-amber-50 transition hover:bg-amber-800 disabled:cursor-not-allowed disabled:opacity-60"
    >
      <WandSparkles className="h-4 w-4" />
      {isLoading ? "Generating..." : "Generate Description"}
    </button>
  );
};

export default AIGenerateButton;
