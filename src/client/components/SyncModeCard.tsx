import React from 'react';

interface SyncModeCardProps {
  title: string;
  description: string;
  selected: boolean;
  onSelect: () => void;
}

export default function SyncModeCard({title, description, selected, onSelect}: SyncModeCardProps) {
  const className = `sync-mode-card${selected ? ' sync-mode-card--selected' : ''}`;

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      onSelect();
    }
  };

  return (
    <div
      className={className}
      role="radio"
      aria-checked={selected}
      tabIndex={0}
      onClick={onSelect}
      onKeyDown={handleKeyDown}
    >
      <p className="sync-mode-card__title">{title}</p>
      <p className="sync-mode-card__desc">{description}</p>
    </div>
  );
}
