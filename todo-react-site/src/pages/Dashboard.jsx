import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Task from '../components/Tasks';

export default function Dashboard() {
  const navigate = useNavigate();
  const token = localStorage.getItem('token');

  const [tasks, setTasks] = useState([]);
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [status, setStatus] = useState('pending');
  const [loading, setLoading] = useState(true);
  const [creating, setCreating] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    if (!token) {
      navigate('/login');
      return;
    }
    fetchTasks();
  }, [token, navigate]);

  const fetchTasks = async () => {
    try {
      const response = await fetch('http://52.67.41.175:8000/api/tasks', {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Accept': 'application/json'
        }
      });

      if (response.ok) {
        const data = await response.json();
        if (Array.isArray(data)) setTasks(data);
        else if (data && Array.isArray(data.data)) setTasks(data.data);
        else setTasks([]);
      } else {
        if (response.status === 401) handleLogout();
        throw new Error('Falha ao buscar tarefas');
      }
    } catch (err) {
      setError('Erro de conexão com a API.');
    } finally {
      setLoading(false);
    }
  };

  const handleCreateTask = async (e) => {
    e.preventDefault();
    if (!title.trim() || !description.trim()) return;

    setCreating(true);
    try {
      const response = await fetch('http://52.67.41.175:8000/api/tasks', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
          'Accept': 'application/json'
        },
        body: JSON.stringify({ title, description, status })
      });

      if (response.ok) {
        const body = await response.json();

        // A API pode retornar a task diretamente ou dentro de { data: task }
        const createdTask = body?.data ?? body;

        if (createdTask && createdTask.id) {
          // Adiciona a task no topo da lista sem recarregar
          setTasks(prev => [createdTask, ...prev]);
        } else {
          // Fallback: se a resposta vier num formato inesperado, rebusca tudo
          await fetchTasks();
        }

        setTitle('');
        setDescription('');
        setStatus('pending');
      } else {
        alert('Erro ao criar tarefa. Verifique as validações.');
      }
    } catch (err) {
      alert('Erro de conexão ao criar tarefa.');
    } finally {
      setCreating(false);
    }
  };

  const handleDeleteTask = async (id) => {
    if (!window.confirm('Tem certeza que deseja deletar esta tarefa?')) return;

    try {
      const response = await fetch(`http://52.67.41.175:8000/api/tasks/${id}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Accept': 'application/json'
        }
      });

      if (response.ok) {
        setTasks(prev => prev.filter(task => task.id !== id));
      }
    } catch (err) {
      alert('Erro de conexão ao deletar.');
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    navigate('/login');
  };

  // ==========================================
  // ESTILOS PADRONIZADOS (Tema Slate Moderno)
  // ==========================================
  const containerStyle = { maxWidth: '700px', margin: '40px auto', padding: '24px', fontFamily: 'system-ui, -apple-system, sans-serif', color: '#1e293b' };
  const inputStyle = { width: '100%', padding: '10px 14px', marginBottom: '12px', boxSizing: 'border-box', border: '1px solid #cbd5e1', borderRadius: '8px', fontSize: '14px', backgroundColor: '#ffffff', color: '#1e293b', outline: 'none' };
  const btnPrimary = { padding: '10px 16px', backgroundColor: creating ? '#93c5fd' : '#2563eb', color: '#ffffff', border: 'none', borderRadius: '8px', fontWeight: '600', cursor: creating ? 'not-allowed' : 'pointer', fontSize: '14px', width: '100%', transition: 'background-color 0.2s' };
  const btnDanger = { padding: '8px 14px', backgroundColor: '#ffffff', color: '#dc2626', border: '1px solid #fee2e2', borderRadius: '8px', fontWeight: '600', cursor: 'pointer', fontSize: '13px' };

  return (
    <div style={containerStyle}>
      {/* HEADER */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
        <h2 style={{ margin: 0, fontSize: '24px', fontWeight: '700', color: '#0f172a' }}>🎯 Gerenciador de Tarefas</h2>
        <button onClick={handleLogout} style={btnDanger}>Sair da Conta</button>
      </div>

      {/* FORMULÁRIO */}
      <div style={{ backgroundColor: '#f8fafc', padding: '20px', borderRadius: '12px', border: '1px solid #f1f5f9', marginBottom: '32px' }}>
        <h3 style={{ margin: '0 0 16px 0', fontSize: '16px', fontWeight: '600', color: '#334155' }}>Nova Tarefa</h3>
        <form onSubmit={handleCreateTask}>
          <input
            type="text"
            placeholder="Título da tarefa..."
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            style={inputStyle}
            required
          />
          <textarea
            placeholder="Escreva uma breve descrição sobre o que precisa ser feito..."
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            style={{ ...inputStyle, minHeight: '80px', resize: 'vertical' }}
            required
          />
          <div style={{ marginBottom: '16px' }}>
            <label style={{ display: 'block', fontSize: '13px', fontWeight: '600', color: '#64748b', marginBottom: '6px' }}>Status Inicial:</label>
            <select value={status} onChange={(e) => setStatus(e.target.value)} style={{ ...inputStyle, marginBottom: 0 }}>
              <option value="pending">Pendente ⏳</option>
              <option value="ongoing">Em Andamento 🚀</option>
              <option value="complete">Concluído ✅</option>
            </select>
          </div>
          <button type="submit" style={btnPrimary} disabled={creating}>
            {creating ? 'Criando...' : 'Criar Tarefa'}
          </button>
        </form>
      </div>

      {/* CONTEÚDO / LISTA */}
      <h3 style={{ fontSize: '18px', fontWeight: '600', color: '#334155', marginBottom: '16px' }}>
        Minhas Tarefas ({tasks.length})
      </h3>

      {error && (
        <p style={{ color: '#dc2626', backgroundColor: '#fef2f2', padding: '12px', borderRadius: '8px', fontSize: '14px' }}>
          {error}
        </p>
      )}

      {loading ? (
        <p style={{ color: '#64748b', textAlign: 'center', fontSize: '14px' }}>Carregando tarefas...</p>
      ) : tasks.length === 0 ? (
        <div style={{ textAlign: 'center', padding: '40px 20px', border: '2px dashed #e2e8f0', borderRadius: '12px', color: '#94a3b8' }}>
          <p style={{ margin: 0, fontSize: '14px' }}>Nenhuma tarefa encontrada. Que tal criar a primeira ali em cima?</p>
        </div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
          {tasks.map(task => (
            <div key={task.id} className="coluna-de-tarefas">
              <Task task={task} onDelete={handleDeleteTask} />
            </div>
          ))}
        </div>
      )}
    </div>
  );
}