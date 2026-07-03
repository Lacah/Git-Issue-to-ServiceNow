import React from 'react';
import {ProgressBar} from '@servicenow/react-components/ProgressBar';

interface SyncProgressProps {
  repositoryUrl: string;
  syncMode: string;
}

export default function SyncProgress({repositoryUrl, syncMode}: SyncProgressProps) {
  const modeLabel = syncMode === 'mirror' ? 'Mirror Repository Structure' : 'Map to User Stories';

  return (
    <div className="sync-progress" aria-live="polite">
      <div className="sync-header">
        <h1>Git Issue Sync — Syncing...</h1>
      </div>
      <div className="sync-progress__info">
        <p>{repositoryUrl}</p>
        <p>Mode: {modeLabel}</p>
      </div>
      <ProgressBar label="Synchronizing issues..." size="lg" />
      <p className="sync-progress__info">
        This may take a moment depending on the number of issues.
      </p>
    </div>
  );
}
