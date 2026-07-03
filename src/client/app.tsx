import React, { useState, useEffect, useCallback } from "react";
import { Input } from "@servicenow/react-components/Input";
import { Select } from "@servicenow/react-components/Select";
import { RadioButtons } from "@servicenow/react-components/RadioButtons";
import { Checkbox } from "@servicenow/react-components/Checkbox";
import { Button } from "@servicenow/react-components/Button";
import "./styles.css";

const BASE_URL = "/api/x_snc_git_issue/v1/sync";

function getHeaders(): Record<string, string> {
  return {
    "Content-Type": "application/json",
    Accept: "application/json",
    "X-UserToken": (window as any).g_ck
  };
}

interface Credential {
  sys_id: string;
  name: string;
  type: string;
}

export default function App() {
  const [repoUrl, setRepoUrl] = useState("");
  const [credentials, setCredentials] = useState<Credential[]>([]);
  const [selectedCred, setSelectedCred] = useState<string | number>("");
  const [syncMode, setSyncMode] = useState("mirror");
  const [stateFilter, setStateFilter] = useState<string | number>("open");
  const [updateExisting, setUpdateExisting] = useState(false);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");

  useEffect(() => {
    fetch(`${BASE_URL}/credentials`, { headers: getHeaders() })
      .then(res => res.json())
      .then(json => setCredentials(json?.result?.data || []))
      .catch(() => setCredentials([]));
  }, []);

  const credItems = credentials.map(c => ({
    id: c.sys_id,
    label: `${c.name} (${c.type})`
  }));

  const handleStartSync = useCallback(async () => {
    if (!repoUrl || !selectedCred) return;
    setLoading(true);
    setMessage("");
    try {
      const res = await fetch(`${BASE_URL}/start`, {
        method: "POST",
        headers: getHeaders(),
        body: JSON.stringify({
          repository_url: repoUrl,
          credential_sys_id: String(selectedCred),
          sync_mode: syncMode,
          state_filter: String(stateFilter),
          update_existing: updateExisting
        })
      });
      const json = await res.json();
      const syncId = json?.result?.data?.sync_id;
      if (syncId) {
        setMessage("Sync started successfully! ID: " + syncId);
      } else {
        setMessage("Sync request submitted.");
      }
    } catch (e: any) {
      setMessage("Error: " + (e?.message || "Failed to start sync"));
    } finally {
      setLoading(false);
    }
  }, [repoUrl, selectedCred, syncMode, stateFilter, updateExisting]);

  return (
    <div className="gis-app">
      <div className="gis-header">
        <h1 className="gis-header__title">Git Issue Sync</h1>
        <p className="gis-header__subtitle">Synchronize GitHub issues to ServiceNow</p>
      </div>
      <div className="gis-card">
        <div className="gis-form-section">
          <Input
            label="Repository URL"
            placeholder="https://github.com/owner/repo"
            value={repoUrl}
            onValueSet={e => setRepoUrl(e.detail.payload.value)}
            required
          />
        </div>
        <div className="gis-form-section">
          <Select
            label="Credential"
            items={credItems}
            selectedItem={selectedCred}
            onSelectedItemSet={e => setSelectedCred(e.detail.payload.value)}
            required
            search="none"
          />
        </div>
        <div className="gis-form-section">
          <RadioButtons
            name="state-filter"
            label="Issue State Filter"
            layout="horizontal"
            value={stateFilter}
            options={[
              { id: "open", label: "Open" },
              { id: "closed", label: "Closed" },
              { id: "all", label: "All" }
            ]}
            onValueSet={e => setStateFilter(e.detail.payload.value)}
          />
        </div>
        <div className="gis-form-section">
          <Checkbox
            label="Update existing records"
            checked={updateExisting}
            onCheckedSet={e => setUpdateExisting(e.detail.payload.value)}
            manageChecked
          />
        </div>
        <div className="gis-form-actions">
          <Button
            label={loading ? "Syncing..." : "Start Sync"}
            variant="primary"
            size="md"
            disabled={!repoUrl || !selectedCred || loading}
            onClicked={handleStartSync}
          />
        </div>
        {message && <div className="gis-message">{message}</div>}
      </div>
    </div>
  );
}
