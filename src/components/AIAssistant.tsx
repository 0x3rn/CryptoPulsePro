import React, { useState } from 'react';
import ReactMarkdown from 'react-markdown';
import { generateAIAnalysis } from '../services/api';
import { Coin } from '../types/crypto';
import { Bot, AlertTriangle } from 'lucide-react';
import '../styles/AIAssistant.css';

interface AIAssistantProps {
  selectedCoin?: Coin | null;
}

const AIAssistant: React.FC<AIAssistantProps> = ({ selectedCoin }) => {
  const [analysis, setAnalysis] = useState<string>('');
  const [loading, setLoading] = useState(false);

  const handleAnalyze = async () => {
    if (!selectedCoin) return;
    setLoading(true);
    setAnalysis('');
    try {
      const result = await generateAIAnalysis(
        selectedCoin.name,
        selectedCoin.current_price,
        selectedCoin.price_change_percentage_24h,
        [],
        [],
        []
      );
      setAnalysis(result);
    } catch (err) {
      setAnalysis("Error generating analysis. Please try again later.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="ai-assistant-panel">
      <div className="ai-header">
        <div className="ai-title">
          <div className="ai-icon-wrap">
            <Bot size={20} className="ai-icon" />
          </div>
          <div>
            <h3>AI Assistant</h3>
            <span className="ai-subtitle">Powered by DeepSeek</span>
          </div>
        </div>
      </div>

      <div className="disclaimer-alert">
        <AlertTriangle size={16} className="warning-icon" />
        <p><strong>Disclaimer:</strong> AI suggestions are for informational purposes only and do not constitute financial advice. Trading crypto involves significant risk.</p>
      </div>

      <div className="ai-body">
        {selectedCoin ? (
          <div className="ai-action">
            <p>Ready to analyze <strong>{selectedCoin.name}</strong> based on current trends and sentiment.</p>
            <button className="analyze-btn" onClick={handleAnalyze} disabled={loading}>
              {loading ? 'Analyzing...' : 'Generate AI Analysis'}
            </button>
          </div>
        ) : (
          <p className="no-selection">Select a coin from the table to analyze.</p>
        )}

        {analysis && (
          <div className="ai-result">
            <h4>Analysis Result:</h4>
            <ReactMarkdown>{analysis}</ReactMarkdown>
          </div>
        )}
      </div>
    </div>
  );
};

export default AIAssistant;
