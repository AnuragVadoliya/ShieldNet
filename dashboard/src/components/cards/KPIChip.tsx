import React from 'react';

interface KPIChipProps {
  label: string;
  value: string | number;
  color?: string;
  icon?: string;
}

export const KPIChip: React.FC<KPIChipProps> = ({ label, value, color = '#1565C0', icon }) => {
  return (
    <div style={{
      background: 'white', borderRadius: '12px', padding: '16px',
      boxShadow: '0 1px 3px rgba(0,0,0,0.12), 0 1px 2px rgba(0,0,0,0.08)',
      borderTop: `3px solid ${color}`, display: 'flex', flexDirection: 'column', gap: '4px',
    }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
        {icon && <span style={{
          fontSize: '16px', lineHeight: 1, fontFamily: '"Material Symbols Outlined"',
          color: color,
        }}>{icon}</span>}
        <span style={{ fontSize: '12px', color: '#757575', fontWeight: 500 }}>{label}</span>
      </div>
      <span style={{ fontSize: '28px', fontWeight: 500, color: '#212121', lineHeight: 1.2 }}>
        {value}
      </span>
    </div>
  );
};
