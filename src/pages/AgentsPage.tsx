import { useState, useEffect } from 'react';
import type { CSSProperties } from 'react';
import { useNavigate } from 'react-router-dom';
import { apiService } from '../services/api';
import type { Agent, ApiError } from '../types';
import { Layout } from '../components/common/Layout';
import { ErrorModal } from '../components/common/ErrorModal';

export function AgentsPage() {
  const [agents, setAgents] = useState<Agent[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();

  useEffect(() => {
    loadAgents();
  }, []);

  const loadAgents = async () => {
    try {
      setLoading(true);
      const data = await apiService.listAgents();
      setAgents(data);
    } catch (err) {
      const apiError = err as ApiError;
      setError(apiError.message);
    } finally {
      setLoading(false);
    }
  };

  const handleAgentClick = (agentId: string) => {
    navigate(`/agents/${agentId}`);
  };

  const cardStyle: CSSProperties = {
    backgroundColor: 'white',
    borderRadius: '8px',
    padding: '24px',
    boxShadow: '0 1px 3px 0 rgba(0, 0, 0, 0.1)',
  };

  const titleStyle: CSSProperties = {
    fontSize: '24px',
    fontWeight: 'bold',
    color: '#1f2937',
    marginBottom: '24px',
  };

  const gridStyle: CSSProperties = {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))',
    gap: '20px',
  };

  const agentCardStyle: CSSProperties = {
    backgroundColor: 'white',
    border: '1px solid #e5e7eb',
    borderRadius: '8px',
    padding: '20px',
    cursor: 'pointer',
    transition: 'all 0.2s',
    boxShadow: '0 1px 2px 0 rgba(0, 0, 0, 0.05)',
  };

  const agentNameStyle: CSSProperties = {
    fontSize: '18px',
    fontWeight: '600',
    color: '#1f2937',
    marginBottom: '12px',
  };

  const agentInfoStyle: CSSProperties = {
    display: 'flex',
    justifyContent: 'space-between',
    marginBottom: '8px',
    fontSize: '14px',
    color: '#6b7280',
  };

  const emotionStyle: CSSProperties = {
    display: 'inline-block',
    padding: '4px 12px',
    backgroundColor: '#dbeafe',
    color: '#1e40af',
    borderRadius: '12px',
    fontSize: '13px',
    fontWeight: '500',
  };

  const loadingStyle: CSSProperties = {
    textAlign: 'center',
    padding: '40px',
    color: '#6b7280',
  };

  const emptyStyle: CSSProperties = {
    textAlign: 'center',
    padding: '40px',
    color: '#9ca3af',
  };

  return (
    <Layout>
      <div style={cardStyle}>
        <h2 style={titleStyle}>我的代理</h2>
        {loading ? (
          <div style={loadingStyle}>加载中...</div>
        ) : agents.length === 0 ? (
          <div style={emptyStyle}>暂无代理，请先创建代理</div>
        ) : (
          <div style={gridStyle}>
            {agents.map((agent) => (
              <div
                key={agent.id}
                style={agentCardStyle}
                onClick={() => handleAgentClick(agent.id)}
                onMouseEnter={(e) => {
                  e.currentTarget.style.transform = 'translateY(-2px)';
                  e.currentTarget.style.boxShadow = '0 4px 6px -1px rgba(0, 0, 0, 0.1)';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.transform = 'translateY(0)';
                  e.currentTarget.style.boxShadow = '0 1px 2px 0 rgba(0, 0, 0, 0.05)';
                }}
              >
                <div style={agentNameStyle}>{agent.name}</div>
                <div style={agentInfoStyle}>
                  <span>情绪:</span>
                  <span style={emotionStyle}>{agent.emotion}</span>
                </div>
                <div style={agentInfoStyle}>
                  <span>好感度:</span>
                  <span style={{ fontWeight: '600', color: '#059669' }}>{agent.favorability}</span>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
      {error && <ErrorModal message={error} onClose={() => setError(null)} />}
    </Layout>
  );
}
