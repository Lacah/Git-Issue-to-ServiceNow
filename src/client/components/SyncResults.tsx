import React from 'react';
import {Button} from '@servicenow/react-components/Button';

interface SyncResultsData {
  issues_created: number;
  issues_updated: number;
  issues_skipped: number;
  milestones_created: number;
  labels_created: number;
}

interface SyncResultsProps {
  success: boolean;
  results: SyncResultsData | null;
  error: string | null;
  onViewList: () => void;
  onReset: () => void;
}

export default function SyncResults({success, results, error, onViewList, onReset}: SyncResultsProps) {
  return (
    <div aria-live="polite">
      <div className="sync-header">
        <h1>{success ? 'Git Issue Sync — Complete ✅' : 'Git Issue Sync — Error'}</h1>
      </div>

      {success && results && (
        <div className="sync-results__stats">
          <div className="sync-stat-card">
            <span className="sync-stat-card__value">{results.issues_created}</span>
            <span className="sync-stat-card__label">Issues Created</span>
          </div>
          <div className="sync-stat-card">
            <span className="sync-stat-card__value">{results.issues_updated}</span>
            <span className="sync-stat-card__label">Issues Updated</span>
          </div>
          <div className="sync-stat-card">
            <span className="sync-stat-card__value">{results.issues_skipped}</span>
            <span className="sync-stat-card__label">Issues Skipped</span>
          </div>
          <div className="sync-stat-card">
            <span className="sync-stat-card__value">{results.milestones_created}</span>
            <span className="sync-stat-card__label">Milestones Created</span>
          </div>
          <div className="sync-stat-card">
            <span className="sync-stat-card__value">{results.labels_created}</span>
            <span className="sync-stat-card__label">Labels Created</span>
          </div>
        </div>
      )}

      {!success && error && (
        <div className="sync-error" role="alert">{error}</div>
      )}

      <div className="sync-results__actions">
        {success && (
          <Button label="View Issues List" variant="primary" onClicked={onViewList} />
        )}
        <Button label="Sync Another Repo" variant="secondary" onClicked={onReset} />
      </div>
    </div>
  );
}
