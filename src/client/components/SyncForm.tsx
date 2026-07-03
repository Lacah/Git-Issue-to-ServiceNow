import React, {useState, useEffect, useCallback} from 'react';
import {Input, InputValueSet} from '@servicenow/react-components/Input';
import {Select, SelectSelectedItemSet} from '@servicenow/react-components/Select';
import {RadioButtons, RadioButtonValueSet} from '@servicenow/react-components/RadioButtons';
import {Checkbox, CheckboxCheckedSet} from '@servicenow/react-components/Checkbox';
import {Button} from '@servicenow/react-components/Button';
import SyncModeCard from './SyncModeCard';

declare const window: Window & {g_ck: string};

interface Credential {
  sys_id: string;
  name: string;
  type: string;
}

export interface SyncFormData {
  repository_url: string;
  credential_sys_id: string;
  sync_mode: string;
  state_filter: string;
  update_existing: boolean;
}

interface SyncFormProps {
  onSubmit: (data: SyncFormData) => void;
  loading: boolean;
}

const API_BASE = '/api/x_snc_git_issue/v1/sync';

export default function SyncForm({onSubmit, loading}: SyncFormProps) {
  const [repoUrl, setRepoUrl] = useState('');
  const [credentialId, setCredentialId] = useState<string | number>('');
  const [syncMode, setSyncMode] = useState('mirror');
  const [stateFilter, setStateFilter] = useState<string | number>('open');
  const [updateExisting, setUpdateExisting] = useState(false);
  const [credentials, setCredentials] = useState<Credential[]>([]);

  useEffect(() => {
    fetch(`${API_BASE}/credentials`, {
      headers: {'X-UserToken': window.g_ck}
    })
      .then(r => r.json())
      .then(data => {
        if (data.result?.success) setCredentials(data.result.data);
      })
      .catch(() => {});
  }, []);

  const handleRepoChange = useCallback<InputValueSet>(e => {
    setRepoUrl(e.detail.payload.value);
  }, []);

  const handleCredChange = useCallback<SelectSelectedItemSet>(e => {
    setCredentialId(e.detail.payload.value);
  }, []);

  const handleStateChange = useCallback<RadioButtonValueSet>(e => {
    setStateFilter(e.detail.payload.value);
  }, []);

  const handleUpdateChange = useCallback<CheckboxCheckedSet>(e => {
    setUpdateExisting(e.detail.payload.value);
  }, []);

  const handleSubmit = () => {
    onSubmit({
      repository_url: repoUrl,
      credential_sys_id: String(credentialId),
      sync_mode: syncMode,
      state_filter: String(stateFilter),
      update_existing: updateExisting
    });
  };

  const credItems = [{id: '', label: 'None (public repo)'}, ...credentials.map(c => ({id: c.sys_id, label: `${c.name} (${c.type})`}))];

  return (
    <div>
      <div className="sync-header">
        <h1>Git Issue Sync</h1>
        <p>Synchronize GitHub issues to ServiceNow</p>
      </div>

      <div className="sync-form-section">
        <Input label="Repository URL" placeholder="https://github.com/owner/repo" required value={repoUrl} onValueSet={handleRepoChange} />
      </div>

      <div className="sync-form-section">
        <Select label="Credential" items={credItems} selectedItem={credentialId} onSelectedItemSet={handleCredChange} search="contains" helperContent="Optional for public repositories" />
      </div>

      <div className="sync-form-section">
        <span className="sync-form-section-label">Sync Mode</span>
        <div className="sync-mode-cards" role="radiogroup" aria-label="Sync Mode">
          <SyncModeCard title="Mirror Repository Structure" description="Issues → Custom Table, Milestones → Custom" selected={syncMode === 'mirror'} onSelect={() => setSyncMode('mirror')} />
          <SyncModeCard title="Map to User Stories" description="Issues → Stories, Milestones → Epics" selected={syncMode === 'story_map'} onSelect={() => setSyncMode('story_map')} />
        </div>
      </div>

      <div className="sync-form-section">
        <RadioButtons name="state_filter" label="Issue State Filter" layout="horizontal" value={stateFilter} options={[{id: 'open', label: 'Open'}, {id: 'closed', label: 'Closed'}, {id: 'all', label: 'All'}]} onValueSet={handleStateChange} />
      </div>

      <div className="sync-form-section">
        <Checkbox label="Update existing records" checked={updateExisting} onCheckedSet={handleUpdateChange} />
      </div>

      <div className="sync-actions">
        <Button label="Start Sync" variant="primary" icon="sync-outline" disabled={!repoUrl.trim() || loading} onClicked={handleSubmit} />
      </div>
    </div>
  );
}
