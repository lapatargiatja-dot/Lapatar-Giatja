import React, { useState, useEffect } from 'react';
import { LayoutDashboard, List, Sparkles, Plus, Wallet } from 'lucide-react';
import { Transaction, ViewState } from './types';
import { INITIAL_TRANSACTIONS } from './constants';
import { Dashboard } from './components/Dashboard';
import { TransactionList } from './components/TransactionList';
import { AddTransactionModal } from './components/AddTransactionModal';
import { AnalysisView } from './components/AnalysisView';

const App: React.FC = () => {
  const [transactions, setTransactions] = useState<Transaction[]>(() => {
    const saved = localStorage.getItem('transactions');
    return saved ? JSON.parse(saved) : INITIAL_TRANSACTIONS;
  });
  
  const [view, setView] = useState<ViewState>(ViewState.DASHBOARD);
  const [isModalOpen, setIsModalOpen] = useState(false);

  useEffect(() => {
    localStorage.setItem('transactions', JSON.stringify(transactions));
  }, [transactions]);

  const handleAddTransaction = (newTransaction: Transaction) => {
    setTransactions(prev => [...prev, newTransaction]);
  };

  const handleDeleteTransaction = (id: string) => {
    setTransactions(prev => prev.filter(t => t.id !== id));
  };

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col md:flex-row font-sans">
      
      {/* Sidebar Navigation (Desktop) - Hidden on Print */}
      <aside className="hidden md:flex flex-col w-64 bg-white border-r border-slate-200 h-screen sticky top-0 p-6 print:hidden">
        <div className="flex items-center gap-3 mb-10">
          <div className="bg-indigo-600 p-2 rounded-lg shrink-0">
            <Wallet className="text-white w-6 h-6" />
          </div>
          <h1 className="text-lg font-bold text-slate-800 leading-tight">Laporan Keuangan Kegiatan Kerja</h1>
        </div>

        <nav className="flex-1 space-y-2">
          <button
            onClick={() => setView(ViewState.DASHBOARD)}
            className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all font-medium ${
              view === ViewState.DASHBOARD 
                ? 'bg-indigo-50 text-indigo-700 shadow-sm' 
                : 'text-slate-500 hover:bg-slate-50 hover:text-slate-700'
            }`}
          >
            <LayoutDashboard size={20} />
            Dashboard
          </button>
          
          <button
            onClick={() => setView(ViewState.TRANSACTIONS)}
            className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all font-medium ${
              view === ViewState.TRANSACTIONS 
                ? 'bg-indigo-50 text-indigo-700 shadow-sm' 
                : 'text-slate-500 hover:bg-slate-50 hover:text-slate-700'
            }`}
          >
            <List size={20} />
            Transaksi
          </button>

          <button
            onClick={() => setView(ViewState.ANALYSIS)}
            className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all font-medium ${
              view === ViewState.ANALYSIS 
                ? 'bg-purple-50 text-purple-700 shadow-sm' 
                : 'text-slate-500 hover:bg-purple-50 hover:text-purple-600'
            }`}
          >
            <Sparkles size={20} />
            Analisis AI
          </button>
        </nav>

        <div className="pt-6 border-t border-slate-100">
          <button 
            onClick={() => setIsModalOpen(true)}
            className="w-full bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-3 rounded-xl font-semibold shadow-lg shadow-indigo-200 transition-all flex items-center justify-center gap-2"
          >
            <Plus size={20} />
            Tambah Baru
          </button>
        </div>
      </aside>

      {/* Main Content - Full width on Print */}
      <main className="flex-1 p-4 md:p-8 pb-24 md:pb-8 overflow-y-auto max-w-7xl mx-auto w-full print:p-0 print:overflow-visible">
        {/* Mobile Header - Hidden on Print */}
        <div className="md:hidden flex items-center justify-between mb-6 print:hidden">
           <div className="flex items-center gap-2">
            <div className="bg-indigo-600 p-1.5 rounded-lg shrink-0">
                <Wallet className="text-white w-5 h-5" />
            </div>
            <h1 className="text-sm font-bold text-slate-800 leading-tight">Laporan Keuangan Kegiatan Kerja</h1>
           </div>
           <button 
             onClick={() => setIsModalOpen(true)}
             className="bg-indigo-600 text-white p-2 rounded-lg shadow-md shrink-0"
           >
             <Plus size={20} />
           </button>
        </div>

        <header className="mb-8 print:hidden">
          <h2 className="text-2xl font-bold text-slate-800">
            {view === ViewState.DASHBOARD && 'Ringkasan Keuangan'}
            {view === ViewState.TRANSACTIONS && 'Riwayat Transaksi'}
            {view === ViewState.ANALYSIS && 'Analisis Cerdas'}
          </h2>
          <p className="text-slate-500">
            {view === ViewState.DASHBOARD && 'Pantau arus kas dan kesehatan finansial Anda.'}
            {view === ViewState.TRANSACTIONS && 'Daftar lengkap pemasukan dan pengeluaran.'}
            {view === ViewState.ANALYSIS && 'Dapatkan wawasan mendalam dari data keuangan Anda.'}
          </p>
        </header>

        {view === ViewState.DASHBOARD && <Dashboard transactions={transactions} />}
        {view === ViewState.TRANSACTIONS && <TransactionList transactions={transactions} onDelete={handleDeleteTransaction} />}
        {view === ViewState.ANALYSIS && <AnalysisView transactions={transactions} />}
      </main>

      {/* Mobile Bottom Navigation - Hidden on Print */}
      <nav className="md:hidden fixed bottom-0 left-0 right-0 bg-white border-t border-slate-200 flex justify-around p-2 z-40 pb-safe print:hidden">
        <button
          onClick={() => setView(ViewState.DASHBOARD)}
          className={`flex flex-col items-center p-2 rounded-lg ${view === ViewState.DASHBOARD ? 'text-indigo-600' : 'text-slate-400'}`}
        >
          <LayoutDashboard size={24} />
          <span className="text-[10px] font-medium mt-1">Home</span>
        </button>
        <button
          onClick={() => setView(ViewState.TRANSACTIONS)}
          className={`flex flex-col items-center p-2 rounded-lg ${view === ViewState.TRANSACTIONS ? 'text-indigo-600' : 'text-slate-400'}`}
        >
          <List size={24} />
          <span className="text-[10px] font-medium mt-1">List</span>
        </button>
        <button
          onClick={() => setView(ViewState.ANALYSIS)}
          className={`flex flex-col items-center p-2 rounded-lg ${view === ViewState.ANALYSIS ? 'text-purple-600' : 'text-slate-400'}`}
        >
          <Sparkles size={24} />
          <span className="text-[10px] font-medium mt-1">AI</span>
        </button>
      </nav>

      <AddTransactionModal 
        isOpen={isModalOpen} 
        onClose={() => setIsModalOpen(false)} 
        onAdd={handleAddTransaction} 
      />
    </div>
  );
};

export default App;