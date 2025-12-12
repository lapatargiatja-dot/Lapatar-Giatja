import React, { useState } from 'react';
import { Transaction } from '../types';
import { analyzeFinancialData } from '../services/geminiService';
import { Sparkles, RefreshCw, AlertCircle } from 'lucide-react';
import ReactMarkdown from 'react-markdown';

interface AnalysisViewProps {
  transactions: Transaction[];
}

export const AnalysisView: React.FC<AnalysisViewProps> = ({ transactions }) => {
  const [analysis, setAnalysis] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleAnalyze = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const result = await analyzeFinancialData(transactions);
      setAnalysis(result);
    } catch (err) {
      setError("Gagal menganalisis data.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="bg-gradient-to-r from-indigo-600 to-purple-600 rounded-2xl p-6 text-white shadow-lg">
        <h2 className="text-2xl font-bold mb-2 flex items-center gap-2">
          <Sparkles className="w-6 h-6 text-yellow-300" />
          Analisis Keuangan Cerdas
        </h2>
        <p className="text-indigo-100 mb-6">
          Gunakan kecerdasan buatan Gemini untuk menganalisis pola pengeluaran Anda dan dapatkan saran penghematan yang dipersonalisasi.
        </p>
        
        <button
          onClick={handleAnalyze}
          disabled={isLoading}
          className="bg-white text-indigo-600 px-6 py-3 rounded-lg font-semibold shadow-md hover:bg-indigo-50 transition-colors flex items-center gap-2 disabled:opacity-70 disabled:cursor-not-allowed"
        >
          {isLoading ? (
            <>
              <RefreshCw className="w-5 h-5 animate-spin" />
              Sedang Menganalisis...
            </>
          ) : (
            <>
              <Sparkles className="w-5 h-5" />
              Mulai Analisis AI
            </>
          )}
        </button>
      </div>

      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 p-4 rounded-xl flex items-center gap-2">
          <AlertCircle className="w-5 h-5" />
          {error}
        </div>
      )}

      {analysis && (
        <div className="bg-white rounded-2xl shadow-sm border border-slate-100 p-6 sm:p-8">
          <h3 className="text-xl font-bold text-slate-800 mb-4 border-b pb-4">Hasil Analisis</h3>
          <div className="prose prose-indigo max-w-none prose-headings:text-slate-800 prose-p:text-slate-600">
             {/* Simple markdown rendering without external library for simplicity in this prompt, or simple formatting */}
             <div className="whitespace-pre-wrap leading-relaxed text-slate-700">
               <ReactMarkdown>{analysis}</ReactMarkdown>
             </div>
          </div>
        </div>
      )}
    </div>
  );
};