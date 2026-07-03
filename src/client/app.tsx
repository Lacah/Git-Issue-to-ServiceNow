import React, {useState, useCallback} from 'react';
import './styles.css';
import SyncForm, {SyncFormData} from './components/SyncForm';
import SyncProgress from './components/SyncProgress';
import SyncResults from './components/SyncResults';

declare const window: Window & {g_ck: string};

type AppView = 'form' | 'progress' | 'results' | 'error';

interface SyncResultsData {
  issues_created: number;
  issues_updated: number;
  issues_skipped: number;
  milestones_created: number;
  labels_created: number;
}

const API_BASE = '/api/x_snc_git_issue/v1/sync';

export default function App() {
  const [view, setView] = useState<AppView>('form');
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState<SyncFormData | null>(null);
  const [results, setResults] = useState<SyncResultsData | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = useCallback(async (data: SyncFormData) => {
    setFormData(data);
    setLoading(true);
    setView('progress');
    setError(null);

    try {
      const resp = await fetch(`${API_BASE}/start`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'X-UserToken': window.g_ck
        },
        body: JSON.stringify(data)
      });
      const json = await resp.json();
      const body = json.result || json;

      if (body.success) {
        setResults(body.results);
        setView('results');
      } else {
        setError(body.error || 'Sync failed');
        setView('error');
      }
    } catch (e: unknown) {
      setError(e instanceof Error ? e.message : 'Network error');
      setView('error');
    } finally {
      setLoading(false);
    }
  }, []);

  const handleViewList = useCallback(() => {
    window.location.assign('/now/nav/ui/list/x_snc_git_issue_record');
  }, []);

  const handleReset = useCallback(() => {
    setView('form');
    setResults(null);
    setError(null);
    setFormData(null);
  }, []);

  return (
    <div className="sync-page">
      {view === 'form' && (
        <SyncForm onSubmit={handleSubmit} loading={loading} />
      )}
      {view === 'progress' && formData && (
        <SyncProgress repositoryUrl={formData.repository_url} syncMode={formData.sync_mode} />
      )}
      {view === 'results' && (
        <SyncResults success={true} results={results} error={null} onViewList={handleViewList} onReset={handleReset} />
      )}
      {view === 'error' && (
        <SyncResults success={false} results={null} error={error} onViewList={handleViewList} onReset={handleReset} />
      )}
    </div>
  );
}
