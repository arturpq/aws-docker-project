import React from 'react';

export default function Task({ task, onDelete }) {
  // Paleta de cores moderna e suave para os Status Badges
  const statusStyles = {
    pending: { text: 'Pendente', color: '#b45309', bg: '#fef3c7' },     // Âmbar
    ongoing: { text: 'Em Andamento', color: '#0369a1', bg: '#e0f2fe' }, // Azul Céu
    complete: { text: 'Concluído', color: '#047857', bg: '#d1fae5' }    // Esmeralda
  };

  const currentStatus = statusStyles[task.status] || statusStyles.pending;

  return (
    <div style={{
      backgroundColor: '#ffffff',
      padding: '16px',
      borderRadius: '12px',
      border: '1px solid #e2e8f0',
      boxShadow: '0 1px 3px 0 rgba(0, 0, 0, 0.05), 0 1px 2px 0 rgba(0, 0, 0, 0.03)',
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'flex-start',
      gap: '16px',
      transition: 'transform 0.2s, box-shadow 0.2s'
    }}>
      <div style={{ flex: 1 }}>
        <h4 style={{ margin: '0 0 6px 0', color: '#1e293b', fontSize: '16px', fontWeight: '600' }}>
          {task.title}
        </h4>
        <p style={{ margin: '0 0 12px 0', fontSize: '14px', color: '#64748b', lineHeight: '1.5' }}>
          {task.description}
        </p>
        <span style={{
          backgroundColor: currentStatus.bg,
          color: currentStatus.color,
          padding: '4px 12px',
          borderRadius: '9999px',
          fontSize: '12px',
          fontWeight: '600',
          display: 'inline-block'
        }}>
          {currentStatus.text}
        </span>
      </div>

      <button 
        onClick={() => onDelete(task.id)} 
        style={{
          background: 'none',
          border: 'none',
          color: '#94a3b8',
          cursor: 'pointer',
          fontSize: '18px',
          padding: '6px',
          borderRadius: '8px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          transition: 'all 0.2s'
        }}
        // Efeito de hover simples via JS para não precisar de CSS externo
        onMouseEnter={(e) => {
          e.currentTarget.style.color = '#ef4444';
          e.currentTarget.style.backgroundColor = '#fef2f2';
        }}
        onMouseLeave={(e) => {
          e.currentTarget.style.color = '#94a3b8';
          e.currentTarget.style.backgroundColor = 'transparent';
        }}
        title="Deletar Tarefa"
      >
        🗑️
      </button>
    </div>
  );
}