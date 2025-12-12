import React, { useState, useMemo } from 'react';
import { Transaction } from '../types';
import { CATEGORIES } from '../constants';
import { Trash2, ArrowUpCircle, ArrowDownCircle, Filter, XCircle, Calendar, Tag, FileSpreadsheet, Printer, Download } from 'lucide-react';

interface TransactionListProps {
  transactions: Transaction[];
  onDelete: (id: string) => void;
}

export const TransactionList: React.FC<TransactionListProps> = ({ transactions, onDelete }) => {
  const [categoryFilter, setCategoryFilter] = useState('');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');

  // Combine income and expense categories for the filter dropdown
  const allCategories = useMemo(() => {
    const uniqueCats = Array.from(new Set([...CATEGORIES.income, ...CATEGORIES.expense]));
    return uniqueCats.sort();
  }, []);

  const filteredTransactions = useMemo(() => {
    let result = [...transactions];

    if (categoryFilter) {
      result = result.filter(t => t.category === categoryFilter);
    }

    if (startDate) {
      result = result.filter(t => t.date >= startDate);
    }

    if (endDate) {
      result = result.filter(t => t.date <= endDate);
    }

    // Sort by date desc
    return result.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
  }, [transactions, categoryFilter, startDate, endDate]);

  const hasFilters = categoryFilter || startDate || endDate;

  const clearFilters = () => {
    setCategoryFilter('');
    setStartDate('');
    setEndDate('');
  };

  const downloadCSV = () => {
    if (filteredTransactions.length === 0) return;

    // CSV Header
    const headers = ["Tanggal", "Kategori", "Deskripsi", "Tipe", "Jumlah (IDR)"];
    
    // CSV Rows
    const rows = filteredTransactions.map(t => [
      t.date,
      t.category,
      `"${t.description.replace(/"/g, '""')}"`, // Escape quotes
      t.type === 'income' ? 'Pemasukan' : 'Pengeluaran',
      t.amount
    ]);

    const csvContent = [
      headers.join(','),
      ...rows.map(row => row.join(','))
    ].join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', `laporan_keuangan_${new Date().toISOString().slice(0, 10)}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handlePrint = () => {
    window.print();
  };

  const totalIncome = filteredTransactions.filter(t => t.type === 'income').reduce((sum, t) => sum + t.amount, 0);
  const totalExpense = filteredTransactions.filter(t => t.type === 'expense').reduce((sum, t) => sum + t.amount, 0);

  if (transactions.length === 0) {
    return (
        <div className="bg-white rounded-2xl p-12 text-center shadow-sm border border-slate-100">
            <p className="text-slate-400 text-lg">Belum ada transaksi.</p>
        </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header Actions - Hidden on Print except specific title */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 print:hidden">
        <div>
           {/* Placeholder for left content if needed */}
        </div>
        <div className="flex w-full md:w-auto gap-2">
            <button
                onClick={downloadCSV}
                disabled={filteredTransactions.length === 0}
                className="flex-1 md:flex-none flex items-center justify-center gap-2 px-4 py-2 bg-emerald-50 text-emerald-700 rounded-xl hover:bg-emerald-100 transition-colors font-medium text-sm disabled:opacity-50 disabled:cursor-not-allowed"
            >
                <FileSpreadsheet size={18} />
                Export Excel
            </button>
            <button
                onClick={handlePrint}
                disabled={filteredTransactions.length === 0}
                className="flex-1 md:flex-none flex items-center justify-center gap-2 px-4 py-2 bg-slate-100 text-slate-700 rounded-xl hover:bg-slate-200 transition-colors font-medium text-sm disabled:opacity-50 disabled:cursor-not-allowed"
            >
                <Printer size={18} />
                Cetak / PDF
            </button>
        </div>
      </div>

      {/* Print Only Header */}
      <div className="hidden print:block mb-6">
        <h1 className="text-2xl font-bold text-slate-900 mb-2">Laporan Keuangan</h1>
        <p className="text-slate-600">
            {startDate && endDate ? `Periode: ${startDate} s/d ${endDate}` : `Dicetak pada: ${new Date().toLocaleDateString('id-ID')}`}
        </p>
        {categoryFilter && <p className="text-slate-600">Kategori: {categoryFilter}</p>}
      </div>

      {/* Filter Toolbar - Hidden on Print */}
      <div className="bg-white p-4 md:p-5 rounded-2xl shadow-sm border border-slate-100 print:hidden">
        <div className="flex items-center gap-2 mb-4 text-slate-800 font-semibold">
          <Filter className="w-5 h-5 text-indigo-600" />
          <h3>Filter Transaksi</h3>
        </div>
        
        <div className="flex flex-col gap-4">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-3 md:gap-4 w-full">
                <div>
                    <label className="block text-xs font-medium text-slate-500 mb-1.5">Kategori</label>
                    <div className="relative">
                        <Tag className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                        <select
                            value={categoryFilter}
                            onChange={(e) => setCategoryFilter(e.target.value)}
                            className="w-full text-sm border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-transparent py-2.5 pl-9 pr-3 bg-slate-50 border transition-all appearance-none"
                        >
                            <option value="">Semua Kategori</option>
                            {allCategories.map(cat => (
                                <option key={cat} value={cat}>{cat}</option>
                            ))}
                        </select>
                    </div>
                </div>
                <div>
                    <label className="block text-xs font-medium text-slate-500 mb-1.5">Dari Tanggal</label>
                    <div className="relative">
                        <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                        <input
                            type="date"
                            value={startDate}
                            onChange={(e) => setStartDate(e.target.value)}
                            className="w-full text-sm border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-transparent py-2.5 pl-9 pr-3 bg-slate-50 border transition-all"
                        />
                    </div>
                </div>
                 <div>
                    <label className="block text-xs font-medium text-slate-500 mb-1.5">Sampai Tanggal</label>
                    <div className="relative">
                         <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                        <input
                            type="date"
                            value={endDate}
                            onChange={(e) => setEndDate(e.target.value)}
                            className="w-full text-sm border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-transparent py-2.5 pl-9 pr-3 bg-slate-50 border transition-all"
                        />
                    </div>
                </div>
            </div>
            
            {hasFilters && (
                <button
                    onClick={clearFilters}
                    className="flex items-center justify-center gap-2 px-4 py-2.5 text-sm text-red-600 bg-red-50 hover:bg-red-100 rounded-xl transition-colors font-medium w-full md:w-auto self-end"
                >
                    <XCircle size={18} />
                    Reset Filter
                </button>
            )}
        </div>
      </div>

      {filteredTransactions.length === 0 ? (
        <div className="bg-white rounded-2xl p-8 text-center shadow-sm border border-slate-100">
            <p className="text-slate-400">Tidak ada transaksi yang cocok dengan filter.</p>
        </div>
      ) : (
        <>
            {/* MOBILE VIEW: Card List - Visible on Mobile, Hidden on Print (Table preferred for print) */}
            <div className="flex flex-col gap-3 md:hidden print:hidden">
                {filteredTransactions.map((t) => (
                    <div key={t.id} className="bg-white p-4 rounded-2xl shadow-sm border border-slate-100 flex flex-col gap-3">
                        <div className="flex justify-between items-start">
                            <div>
                                <span className="text-xs text-slate-400 flex items-center gap-1 mb-1">
                                    <Calendar className="w-3 h-3" />
                                    {new Date(t.date).toLocaleDateString('id-ID', { day: 'numeric', month: 'short', year: 'numeric' })}
                                </span>
                                <h4 className="font-bold text-slate-800 line-clamp-2">{t.description}</h4>
                            </div>
                            <div className={`text-sm font-bold whitespace-nowrap ${t.type === 'income' ? 'text-emerald-600' : 'text-red-600'}`}>
                                {t.type === 'income' ? '+' : '-'} Rp {t.amount.toLocaleString('id-ID')}
                            </div>
                        </div>
                        
                        <div className="flex justify-between items-center border-t border-slate-50 pt-3 mt-1">
                            <span className="px-2.5 py-1 rounded-lg bg-slate-100 text-slate-600 text-xs font-medium border border-slate-200">
                                {t.category}
                            </span>
                            <button 
                                onClick={() => onDelete(t.id)}
                                className="p-2 text-slate-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-colors"
                                aria-label="Hapus Transaksi"
                            >
                                <Trash2 size={18} />
                            </button>
                        </div>
                    </div>
                ))}
            </div>

            {/* DESKTOP VIEW & PRINT VIEW: Table */}
            <div className="hidden md:block print:block bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden print:border-0 print:shadow-none">
                <div className="overflow-x-auto">
                <table className="w-full text-left">
                    <thead>
                    <tr className="bg-slate-50 border-b border-slate-200 print:bg-white print:border-black">
                        <th className="px-6 py-4 text-xs font-semibold text-slate-500 uppercase tracking-wider print:text-black">Tanggal</th>
                        <th className="px-6 py-4 text-xs font-semibold text-slate-500 uppercase tracking-wider print:text-black">Kategori</th>
                        <th className="px-6 py-4 text-xs font-semibold text-slate-500 uppercase tracking-wider print:text-black">Deskripsi</th>
                        <th className="px-6 py-4 text-xs font-semibold text-slate-500 uppercase tracking-wider text-right print:text-black">Jumlah</th>
                        <th className="px-6 py-4 text-xs font-semibold text-slate-500 uppercase tracking-wider text-center print:hidden">Aksi</th>
                    </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100 print:divide-slate-200">
                        {filteredTransactions.map((t) => (
                        <tr key={t.id} className="hover:bg-slate-50 transition-colors print:hover:bg-transparent">
                            <td className="px-6 py-4 text-sm text-slate-600 whitespace-nowrap print:text-black">
                            {new Date(t.date).toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' })}
                            </td>
                            <td className="px-6 py-4 text-sm print:text-black">
                            <span className="px-3 py-1 rounded-full bg-slate-100 text-slate-600 text-xs font-medium border border-slate-200 print:bg-transparent print:border-0 print:p-0 print:text-black">
                                {t.category}
                            </span>
                            </td>
                            <td className="px-6 py-4 text-sm text-slate-800 font-medium print:text-black">
                            {t.description}
                            </td>
                            <td className="px-6 py-4 text-sm text-right whitespace-nowrap">
                            <div className={`flex items-center justify-end gap-2 font-bold ${t.type === 'income' ? 'text-emerald-600' : 'text-red-600'} print:text-black`}>
                                {t.type === 'income' ? <ArrowUpCircle size={16} className="print:hidden" /> : <ArrowDownCircle size={16} className="print:hidden" />}
                                <span className="print:hidden">{t.type === 'income' ? '+' : '-'}</span> 
                                Rp {t.amount.toLocaleString('id-ID')}
                            </div>
                            </td>
                            <td className="px-6 py-4 text-center print:hidden">
                            <button 
                                onClick={() => onDelete(t.id)}
                                className="p-2 text-slate-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-colors"
                                title="Hapus Transaksi"
                            >
                                <Trash2 size={18} />
                            </button>
                            </td>
                        </tr>
                        ))}
                        {/* Summary Row for Print */}
                        <tr className="hidden print:table-row font-bold border-t-2 border-slate-300">
                            <td colSpan={3} className="px-6 py-4 text-right">Total Pemasukan:</td>
                            <td className="px-6 py-4 text-right">Rp {totalIncome.toLocaleString('id-ID')}</td>
                            <td></td>
                        </tr>
                         <tr className="hidden print:table-row font-bold">
                            <td colSpan={3} className="px-6 py-4 text-right">Total Pengeluaran:</td>
                            <td className="px-6 py-4 text-right">Rp {totalExpense.toLocaleString('id-ID')}</td>
                             <td></td>
                        </tr>
                        <tr className="hidden print:table-row font-bold text-lg">
                            <td colSpan={3} className="px-6 py-4 text-right">Saldo Akhir:</td>
                            <td className="px-6 py-4 text-right">Rp {(totalIncome - totalExpense).toLocaleString('id-ID')}</td>
                             <td></td>
                        </tr>
                    </tbody>
                </table>
                </div>
            </div>
        </>
      )}
    </div>
  );
};