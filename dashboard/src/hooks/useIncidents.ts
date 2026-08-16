import { useEffect, useState, useCallback } from 'react';

export interface Incident {
  id: string;
  incident_ref: string;
  zone_id: string;
  device_category: string;
  threat_class: string;
  confidence_score: number;
  status: string;
  detected_at: string | null;
  contained_at: string | null;
  resolved_at: string | null;
  playbook_id: string | null;
  actions_taken?: any[];
  created_at?: string | null;
  updated_at?: string | null;
}

export const useIncidents = (params?: Record<string, string>, enabled = true) => {
  const [incidents, setIncidents] = useState<Incident[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const load = useCallback(async () => {
    if (!enabled) return;
    setLoading(true);
    try {
      const query = params ? '?' + new URLSearchParams(params).toString() : '';
      const res = await fetch(`/api/v1/incidents${query}`);
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      const data = await res.json();
      setIncidents(data.results || []);
      setError(null);
    } catch (e: any) {
      setError(e.message);
    } finally {
      setLoading(false);
    }
  }, [enabled, params?.limit, params?.zone_id, params?.status, params?.threat_class]);

  useEffect(() => { load(); }, [load]);

  return { incidents, loading, error, reload: load };
};