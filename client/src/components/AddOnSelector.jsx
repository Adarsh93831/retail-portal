/**
 * AddOnSelector Component
 * Renders checkbox list for selecting optional add-ons on product detail page.
 * Props: { addOns: Array, selected: Array, onToggle: Function }
 */
const AddOnSelector = ({ addOns = [], selected = [], onToggle }) => {
  return (
    <div className="glass-panel p-4">
      <h3 className="text-lg font-bold text-amber-900">Choose Add-ons</h3>
      <div className="mt-3 space-y-2">
        {addOns.length === 0 && <p className="text-sm text-amber-800/80">No add-ons available.</p>}
        {addOns.map((addOn, index) => {
          const isChecked = selected.some((item) => item.name === addOn.name);

          return (
            <label key={`${addOn.name}-${index}`} className="flex items-center justify-between text-sm text-amber-900">
              <span className="flex items-center gap-2">
                <input
                  type="checkbox"
                  checked={isChecked}
                  onChange={() => onToggle(addOn)}
                  className="h-4 w-4 rounded border-amber-400 text-brand-600 focus:ring-brand-400"
                />
                {addOn.name}
              </span>
              <span className="font-semibold text-brand-700">+ Rs. {Number(addOn.price).toFixed(2)}</span>
            </label>
          );
        })}
      </div>
    </div>
  );
};

export default AddOnSelector;
