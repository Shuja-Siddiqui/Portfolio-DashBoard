import React, { useMemo, useState } from "react";

/**
 * Compact searchable multi-select with chips.
 * items: [{ id, label }]
 * value: string[] of selected ids
 */
export const SearchableMultiSelect = ({
  items = [],
  value = [],
  onChange,
  placeholder = "Search to add…",
  emptyLabel = "Nothing selected",
  disabled = false,
}) => {
  const [query, setQuery] = useState("");
  const selectedSet = useMemo(() => new Set(value.map(String)), [value]);

  const selectedItems = useMemo(
    () => items.filter((i) => selectedSet.has(String(i.id))),
    [items, selectedSet]
  );

  const options = useMemo(() => {
    const q = query.trim().toLowerCase();
    const list = items.filter((i) => !selectedSet.has(String(i.id)));
    if (!q) return list.slice(0, 10);
    return list
      .filter((i) => String(i.label || "").toLowerCase().includes(q))
      .slice(0, 16);
  }, [items, query, selectedSet]);

  const toggle = (id) => {
    if (disabled) return;
    const sid = String(id);
    if (selectedSet.has(sid)) {
      onChange(value.filter((v) => String(v) !== sid));
    } else {
      onChange([...value, sid]);
    }
  };

  return (
    <div>
      <div className="picker-selected">
        {selectedItems.map((item) => (
          <button
            key={item.id}
            type="button"
            className="picker-chip"
            disabled={disabled}
            onClick={() => toggle(item.id)}
            title="Click to remove"
          >
            {item.label} ×
          </button>
        ))}
        {!selectedItems.length && (
          <span style={{ color: "#888", fontSize: "0.85rem" }}>{emptyLabel}</span>
        )}
      </div>
      <input
        type="search"
        className="admin-search"
        style={{ maxWidth: "100%" }}
        value={query}
        disabled={disabled}
        onChange={(e) => setQuery(e.target.value)}
        placeholder={placeholder}
      />
      <div className="picker-list">
        {options.map((item) => (
          <button
            key={item.id}
            type="button"
            className="picker-option"
            disabled={disabled}
            onClick={() => toggle(item.id)}
          >
            + {item.label}
          </button>
        ))}
        {!options.length && (
          <span style={{ color: "#888", fontSize: "0.85rem" }}>
            {query.trim() ? "No matches" : "Type to find more"}
          </span>
        )}
      </div>
    </div>
  );
};
