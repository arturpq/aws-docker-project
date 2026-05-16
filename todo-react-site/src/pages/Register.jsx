import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';

export default function Register() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [passwordConfirmation, setPasswordConfirmation] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleRegister = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    if (password !== passwordConfirmation) {
      setError("As senhas não coincidem.");
      setLoading(false);
      return;
    }

    try {
      const response = await fetch('http://52.67.41.175:8000/api/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'Accept': 'application/json' },
        body: JSON.stringify({ name, email, password, password_confirmation: passwordConfirmation })
      });

      const data = await response.json();

      if (response.ok) {
        if (data.token || data.access_token) {
          localStorage.setItem('token', data.token || data.access_token);
          navigate('/dashboard');
        } else {
          alert("Conta criada com sucesso! Faça o login.");
          navigate('/login');
        }
      } else {
        setError(data.message || 'Erro ao criar conta.');
      }
    } catch (err) {
      setError('Erro de conexão com o servidor.');
    } finally {
      setLoading(false);
    }
  };

  const formStyle = { maxWidth: '400px', margin: '50px auto', padding: '20px', border: '1px solid #ccc', borderRadius: '8px', fontFamily: 'sans-serif' };

  return (
    <div style={formStyle}>
      <h2 style={{ textAlign: 'center' }}>Criar Nova Conta</h2>
      {error && <div style={{ color: 'red', marginBottom: '15px', textAlign: 'center' }}>{error}</div>}
      
      <form onSubmit={handleRegister} style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
        <input type="text" placeholder="Seu Nome" value={name} onChange={(e) => setName(e.target.value)} required style={{ padding: '10px' }} />
        <input type="email" placeholder="E-mail" value={email} onChange={(e) => setEmail(e.target.value)} required style={{ padding: '10px' }} />
        <input type="password" placeholder="Senha" value={password} onChange={(e) => setPassword(e.target.value)} required style={{ padding: '10px' }} />
        <input type="password" placeholder="Confirme a Senha" value={passwordConfirmation} onChange={(e) => setPasswordConfirmation(e.target.value)} required style={{ padding: '10px' }} />
        <button type="submit" disabled={loading} style={{ padding: '10px', backgroundColor: '#28A745', color: 'white', border: 'none', cursor: 'pointer' }}>
          {loading ? 'Carregando...' : 'Cadastrar'}
        </button>
      </form>

      <p style={{ textAlign: 'center', marginTop: '15px' }}>
        Já possui conta? <Link to="/login">Faça login</Link>
      </p>
    </div>
  );
}