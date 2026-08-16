import React, { useState } from 'react';
import { PageHeader } from '../components/PageHeader';
import { Card, CardHeader, CardActions } from '../components/Card';
import { TextField, Switch } from '../components/Form';
import { Button } from '../components/Button';
import { theme } from '../styles/theme';
import { useToast } from '../components/Toast';

interface ConfigField {
  label: string;
  key: string;
  type: 'number' | 'text';
  desc: string;
  placeholder?: string;
}

interface ConfigSection {
  title: string;
  icon: string;
  desc: string;
  fields: ConfigField[];
}

const SECTIONS: ConfigSection[] = [
  {
    title: 'Inference Engine',
    icon: 'psychology',
    desc: 'Classification thresholds for the ensemble anomaly detection model.',
    fields: [
      { label: 'Low Threshold', key: 'INFERENCE_THRESHOLD_LOW', type: 'number', desc: 'Scores below this are classified NORMAL.', placeholder: '0.40' },
      { label: 'High Threshold', key: 'INFERENCE_THRESHOLD_HIGH', type: 'number', desc: 'Scores at or above this are classified THREAT_HIGH.', placeholder: '0.70' },
    ],
  },
  {
    title: 'Differential Privacy',
    icon: 'security',
    desc: 'Privacy budget applied to gradient updates before federation.',
    fields: [
      { label: 'Epsilon (ε)', key: 'DP_EPSILON', type: 'number', desc: 'Privacy budget per round — lower is more private.', placeholder: '1.0' },
      { label: 'Delta (δ)', key: 'DP_DELTA', type: 'text', desc: 'Probability of privacy leakage.', placeholder: '1e-5' },
      { label: 'Clip Norm', key: 'DP_CLIP_NORM', type: 'number', desc: 'Maximum gradient norm before clipping.', placeholder: '1.0' },
    ],
  },
  {
    title: 'Federated Learning',
    icon: 'hub',
    desc: 'Global model aggregation schedule across zones.',
    fields: [
      { label: 'Local Epochs', key: 'FL_LOCAL_EPOCHS', type: 'number', desc: 'Training epochs per client per round.', placeholder: '3' },
      { label: 'Interval (min)', key: 'FL_INTERVAL_MINUTES', type: 'number', desc: 'Minutes between federated aggregation rounds.', placeholder: '60' },
    ],
  },
  {
    title: 'AIRO Response',
    icon: 'robot',
    desc: 'Autonomous response engine — auto-contains threats above the AIRO threshold.',
    fields: [
      { label: 'Confirmation Delay (ms)', key: 'AIRO_CONFIRMATION_DELAY_MS', type: 'number', desc: 'Wait window before autonomous containment.', placeholder: '5000' },
    ],
  },
  {
    title: 'Logging & Retention',
    icon: 'description',
    desc: 'Operational logging and alert delivery configuration.',
    fields: [
      { label: 'Log Retention (days)', key: 'LOG_RETENTION_DAYS', type: 'number', desc: 'How long raw logs are retained.', placeholder: '30' },
      { label: 'Alert Webhook URL', key: 'ALERT_WEBHOOK_URL', type: 'text', desc: 'Endpoint for outbound alert notifications.', placeholder: 'https://...' },
    ],
  },
];

interface ToggleSetting {
  label: string;
  desc: string;
  key: string;
  icon: string;
}

const TOGGLES: ToggleSetting[] = [
  { label: 'Auto-contain high confidence', desc: 'AIRO automatically contains threats with confidence ≥ 0.4', key: 'AUTO_CONTAIN_HIGH', icon: 'shield' },
  { label: 'Auto-contain medium confidence', desc: 'AIRO contains medium-confidence threats without review', key: 'AUTO_CONTAIN_MEDIUM', icon: 'verified_user' },
  { label: 'Prometheus metrics export', desc: 'Expose /metrics for Prometheus scraping', key: 'PROMETHEUS_ENABLED', icon: 'monitoring' },
];

const Settings: React.FC = () => {
  const { showToast } = useToast();
  const [saving, setSaving] = useState(false);
  const [config, setConfig] = useState<Record<string, string>>({
    INFERENCE_THRESHOLD_LOW: '0.40',
    INFERENCE_THRESHOLD_HIGH: '0.70',
    DP_EPSILON: '1.0',
    DP_DELTA: '1e-5',
    DP_CLIP_NORM: '1.0',
    FL_LOCAL_EPOCHS: '3',
    FL_INTERVAL_MINUTES: '60',
    AIRO_CONFIRMATION_DELAY_MS: '5000',
    LOG_RETENTION_DAYS: '30',
    ALERT_WEBHOOK_URL: '',
  });
  const [toggles, setToggles] = useState<Record<string, boolean>>({
    AUTO_CONTAIN_HIGH: true,
    AUTO_CONTAIN_MEDIUM: true,
    PROMETHEUS_ENABLED: false,
  });

  const handleChange = (key: string, value: string) => {
    setConfig(prev => ({ ...prev, [key]: value }));
  };

  const handleSave = () => {
    setSaving(true);
    setTimeout(() => {
      setSaving(false);
      showToast({ type: 'success', title: 'Configuration saved', message: 'Settings applied to the live system' });
    }, 800);
  };

  const handleReset = () => {
    showToast({ type: 'info', title: 'Defaults restored', message: 'All values reset to recommended defaults' });
  };

  return (
    <div>
      <PageHeader
        title="System Settings"
        subtitle="Configure inference, privacy, federated learning, and autonomous response"
        icon="tune"
        actions={
          <>
            <Button variant="outlined" icon={<span style={{ fontFamily: '"Material Symbols Outlined"', fontSize: '20px' }}>restart_alt</span>} onClick={handleReset}>
              Reset Defaults
            </Button>
            <Button variant="filled" icon={<span style={{ fontFamily: '"Material Symbols Outlined"', fontSize: '20px' }}>save</span>} onClick={handleSave} loading={saving}>
              Save Configuration
            </Button>
          </>
        }
      />

      <div style={{ display: 'grid', gridTemplateColumns: '1fr', gap: theme.spacing.lg }}>
        <Card>
          <CardHeader title="Autonomous Response" subtitle="AIRO behavior — threats above the AIRO threshold are contained automatically" avatar={
            <span style={{ fontFamily: '"Material Symbols Outlined"', fontSize: '28px', color: theme.colors.primary }}>robot</span>
          } />
          <div style={{ display: 'flex', flexDirection: 'column', gap: theme.spacing.md }}>
            {TOGGLES.map(t => (
              <Switch
                key={t.key}
                label={t.label}
                description={t.desc}
                checked={toggles[t.key]}
                onChange={e => setToggles(prev => ({ ...prev, [t.key]: e.target.checked }))}
              />
            ))}
          </div>
        </Card>

        {SECTIONS.map(section => (
          <Card key={section.title}>
            <CardHeader
              title={section.title}
              subtitle={section.desc}
              avatar={<span style={{ fontFamily: '"Material Symbols Outlined"', fontSize: '28px', color: theme.colors.secondary }}>{section.icon}</span>}
            />
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: theme.spacing.lg }}>
              {section.fields.map(f => (
                <TextField
                  key={f.key}
                  label={f.label}
                  type={f.type}
                  helperText={f.desc}
                  placeholder={f.placeholder}
                  value={config[f.key]}
                  onChange={e => handleChange(f.key, e.target.value)}
                />
              ))}
            </div>
          </Card>
        ))}

        <Card variant="filled">
          <CardActions align="end">
            <Button variant="tonal" onClick={handleReset}>Discard Changes</Button>
            <Button variant="filled" onClick={handleSave} loading={saving}>Save Configuration</Button>
          </CardActions>
        </Card>
      </div>
    </div>
  );
};

export default Settings;