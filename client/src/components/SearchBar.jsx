import { useState } from "react";
import { Search } from "lucide-react";

/**
 * SearchBar Component
 * Renders a small search form and calls onSearch with entered keyword.
 * Props: { onSearch: Function, placeholder?: String, initialValue?: String }
 */
const SearchBar = ({ onSearch, placeholder = "Search products...", initialValue = "" }) => {
  const [keyword, setKeyword] = useState(initialValue);

  const handleSubmit = (event) => {
    event.preventDefault();
    onSearch(keyword.trim());
  };

  return (
    <form onSubmit={handleSubmit} className="flex w-full items-center gap-2">
      <div className="relative flex-1">
        <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-amber-700/70" />
        <input
          type="text"
          value={keyword}
          onChange={(event) => setKeyword(event.target.value)}
          placeholder={placeholder}
          className="w-full rounded-full border border-amber-300 bg-white/90 py-2 pl-9 pr-3 text-sm text-amber-900 outline-none transition focus:border-amber-500"
        />
      </div>
      <button
        type="submit"
        className="rounded-full bg-brand-500 px-4 py-2 text-sm font-semibold text-white transition hover:bg-brand-600"
      >
        Go
      </button>
    </form>
  );
};

export default SearchBar;
