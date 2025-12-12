import React, { useMemo } from 'react';
import { Transaction } from '../types';
import { CATEGORIES } from '../constants';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip as RechartsTooltip, BarChart, Bar, XAxis, YAxis, CartesianGrid, Legend } from 'recharts';
import { Wallet, TrendingUp, TrendingDown, Scissors, Hammer, Car, Shirt, Sprout, Droplets, Grid3X3, Box } from 'lucide-react';

interface DashboardProps {
  transactions: Transaction[];
}

export const Dashboard: React.FC<DashboardProps> = ({ transactions }) => {
  const summary = useMemo(() => {
    return transactions.reduce(
      (acc, curr) => {
        if (curr.type === 'income') {
          acc.totalIncome += curr.amount;
        } else {
          acc.totalExpense += curr.amount;
        }
        acc.balance = acc.totalIncome - acc.totalExpense;
        return acc;
      },
      { totalIncome: 0, totalExpense: 0, balance: 0 }
    );
  }, [transactions]);

  const expenseByCategory = useMemo(() => {
    const data: Record<string, number> = {};
    transactions.filter(t => t.type === 'expense').forEach(t => {
      data[t.category] = (data[t.category] || 0) + t.amount;
    });
    return Object.entries(data).map(([name, value]) => ({ name, value }));
  }, [transactions]);

  const incomeByCategory = useMemo(() => {
    const data: Record<string, number> = {};
    transactions.filter(t => t.type === 'income').forEach(t => {
      data[t.category] = (data[t.category] || 0) + t.amount;
    });
    return Object.entries(data).map(([name, value]) => ({ name, value }));
  }, [transactions]);

  const unitPerformance = useMemo(() => {
     // Fokus pada unit usaha utama
     const targets = ['Menjahit', 'Las', 'Doorsmeer', 'Pangkas', 'Pertanian Luar Tembok', 'Hidroponik', 'Tenun', 'Miniatur'];
     
     return targets.map(cat => {
        const catTrans = transactions.filter(t => t.category === cat);
        const income = catTrans.filter(t => t.type === 'income').reduce((sum, t) => sum + t.amount, 0);
        const expense = catTrans.filter(t => t.type === 'expense').reduce((sum, t) => sum + t.amount, 0);
        const hasData = income > 0 || expense > 0;
        
        return {
            name: cat,
            income,
            expense,
            profit: income - expense,
            hasData,
            chartData: [
                { name: 'Pemasukan', value: income },
                { name: 'Pengeluaran', value: expense }
            ]
        };
     });
  }, [transactions]);

  const monthlyTrend = useMemo(() => {
    const groupedData: Record<string, { income: number; expense: number; dateStr: string }> = {};

    transactions.forEach(t => {
      const dateKey = t.date; 
      const dateObj = new Date(t.date);
      const displayDate = dateObj.toLocaleDateString('id-ID', { day: '2-digit', month: 'short' });

      if (!groupedData[dateKey]) {
        groupedData[dateKey] = { income: 0, expense: 0, dateStr: displayDate };
      }

      if (t.type === 'income') {
        groupedData[dateKey].income += t.amount;
      } else {
        groupedData[dateKey].expense += t.amount;
      }
    });

    return Object.keys(groupedData)
      .sort()
      .map(key => ({
        date: groupedData[key].dateStr,
        income: groupedData[key].income,
        expense: groupedData[key].expense
      }))
      .slice(-7); 
  }, [transactions]);

  const COLORS = ['#ef4444', '#f97316', '#eab308', '#84cc16', '#06b6d4', '#6366f1', '#a855f7'];
  const INCOME_COLORS = ['#059669', '#10b981', '#34d399', '#6ee7b7', '#a7f3d0'];
  const PROFIT_COLORS = ['#10b981', '#ef4444']; // Green for Income, Red for Expense

  const getIconForCategory = (cat: string) => {
    switch(cat) {
        case 'Menjahit': return <Shirt className="w-5 h-5 text-indigo-600" />;
        case 'Las': return <Hammer className="w-5 h-5 text-orange-600" />;
        case 'Doorsmeer': return <Car className="w-5 h-5 text-blue-600" />;
        case 'Pangkas': return <Scissors className="w-5 h-5 text-pink-600" />;
        case 'Pertanian Luar Tembok': return <Sprout className="w-5 h-5 text-green-600" />;
        case 'Hidroponik': return <Droplets className="w-5 h-5 text-cyan-600" />;
        case 'Tenun': return <Grid3X3 className="w-5 h-5 text-violet-600" />;
        case 'Miniatur': return <Box className="w-5 h-5 text-amber-600" />;
        default: return <Wallet className="w-5 h-5 text-slate-600" />;
    }
  };

  return (
    <div className="space-y-6 md:space-y-8">
      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-white p-5 md:p-6 rounded-2xl shadow-sm border border-slate-100 flex items-center space-x-4">
          <div className="p-3 bg-emerald-100 rounded-full text-emerald-600 shrink-0">
            <TrendingUp className="w-6 h-6" />
          </div>
          <div>
            <p className="text-sm text-slate-500 font-medium">Total Pemasukan</p>
            <p className="text-2xl font-bold text-slate-800 break-all">Rp {summary.totalIncome.toLocaleString('id-ID')}</p>
          </div>
        </div>
        
        <div className="bg-white p-5 md:p-6 rounded-2xl shadow-sm border border-slate-100 flex items-center space-x-4">
          <div className="p-3 bg-red-100 rounded-full text-red-600 shrink-0">
            <TrendingDown className="w-6 h-6" />
          </div>
          <div>
            <p className="text-sm text-slate-500 font-medium">Total Pengeluaran</p>
            <p className="text-2xl font-bold text-slate-800 break-all">Rp {summary.totalExpense.toLocaleString('id-ID')}</p>
          </div>
        </div>

        <div className="bg-white p-5 md:p-6 rounded-2xl shadow-sm border border-slate-100 flex items-center space-x-4">
          <div className={`p-3 rounded-full shrink-0 ${summary.balance >= 0 ? 'bg-indigo-100 text-indigo-600' : 'bg-orange-100 text-orange-600'}`}>
            <Wallet className="w-6 h-6" />
          </div>
          <div>
            <p className="text-sm text-slate-500 font-medium">Sisa Saldo</p>
            <p className={`text-2xl font-bold break-all ${summary.balance >= 0 ? 'text-indigo-600' : 'text-orange-600'}`}>
              Rp {summary.balance.toLocaleString('id-ID')}
            </p>
          </div>
        </div>
      </div>

      {/* Unit Performance Section - Pie Charts Per Category */}
      <div>
        <h3 className="text-lg font-bold text-slate-800 mb-4 flex items-center gap-2">
            <Wallet className="w-5 h-5 text-indigo-600" />
            Performa Unit Usaha (Pemasukan vs Pengeluaran)
        </h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {unitPerformance.map((unit) => (
                <div key={unit.name} className="bg-white p-4 md:p-5 rounded-2xl shadow-sm border border-slate-100 flex flex-col items-center">
                    <div className="flex items-center gap-2 w-full mb-2">
                        <div className="p-2 bg-slate-50 rounded-lg">
                            {getIconForCategory(unit.name)}
                        </div>
                        <h4 className="font-semibold text-slate-700">{unit.name}</h4>
                    </div>
                    
                    <div className="h-40 w-full relative">
                        {unit.hasData ? (
                            <ResponsiveContainer width="100%" height="100%">
                                <PieChart>
                                    <Pie
                                        data={unit.chartData}
                                        cx="50%"
                                        cy="50%"
                                        innerRadius={40}
                                        outerRadius={60}
                                        paddingAngle={5}
                                        dataKey="value"
                                    >
                                        <Cell fill="#10b981" /> {/* Pemasukan */}
                                        <Cell fill="#ef4444" /> {/* Pengeluaran */}
                                    </Pie>
                                    <RechartsTooltip 
                                        formatter={(value: number) => `Rp ${value.toLocaleString('id-ID')}`}
                                        contentStyle={{ fontSize: '12px' }}
                                    />
                                </PieChart>
                            </ResponsiveContainer>
                        ) : (
                            <div className="absolute inset-0 flex items-center justify-center text-slate-300 text-sm">
                                Belum ada data
                            </div>
                        )}
                    </div>
                    
                    <div className="w-full mt-2 space-y-1">
                        <div className="flex justify-between text-xs text-slate-500">
                            <span className="flex items-center gap-1"><div className="w-2 h-2 rounded-full bg-emerald-500"></div>Masuk</span>
                            <span className="font-medium text-emerald-600">Rp {unit.income.toLocaleString('id-ID')}</span>
                        </div>
                        <div className="flex justify-between text-xs text-slate-500">
                            <span className="flex items-center gap-1"><div className="w-2 h-2 rounded-full bg-red-500"></div>Keluar</span>
                            <span className="font-medium text-red-600">Rp {unit.expense.toLocaleString('id-ID')}</span>
                        </div>
                        <div className="pt-2 mt-1 border-t border-slate-100 flex justify-between text-xs font-bold">
                            <span className="text-slate-700">Profit</span>
                            <span className={unit.profit >= 0 ? 'text-indigo-600' : 'text-orange-600'}>
                                Rp {unit.profit.toLocaleString('id-ID')}
                            </span>
                        </div>
                    </div>
                </div>
            ))}
        </div>
      </div>

      {/* Main Charts Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        
        {/* Income Distribution */}
        <div className="bg-white p-4 md:p-6 rounded-2xl shadow-sm border border-slate-100">
          <h3 className="text-lg font-semibold text-slate-800 mb-6">Sumber Pemasukan</h3>
          <div className="h-[300px] w-full">
             {incomeByCategory.length > 0 ? (
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={incomeByCategory}
                      cx="50%"
                      cy="50%"
                      innerRadius={60}
                      outerRadius={100}
                      fill="#8884d8"
                      paddingAngle={5}
                      dataKey="value"
                    >
                      {incomeByCategory.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={INCOME_COLORS[index % INCOME_COLORS.length]} />
                      ))}
                    </Pie>
                    <RechartsTooltip 
                        formatter={(value: number) => `Rp ${value.toLocaleString('id-ID')}`}
                        contentStyle={{ backgroundColor: '#fff', borderRadius: '8px', border: '1px solid #e2e8f0' }}
                    />
                    <Legend />
                  </PieChart>
                </ResponsiveContainer>
             ) : (
                <div className="h-full flex items-center justify-center text-slate-400">
                    Belum ada data pemasukan
                </div>
             )}
          </div>
        </div>

        {/* Expense Distribution */}
        <div className="bg-white p-4 md:p-6 rounded-2xl shadow-sm border border-slate-100">
          <h3 className="text-lg font-semibold text-slate-800 mb-6">Distribusi Pengeluaran</h3>
          <div className="h-[300px] w-full">
             {expenseByCategory.length > 0 ? (
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={expenseByCategory}
                      cx="50%"
                      cy="50%"
                      innerRadius={60}
                      outerRadius={100}
                      fill="#8884d8"
                      paddingAngle={5}
                      dataKey="value"
                    >
                      {expenseByCategory.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                      ))}
                    </Pie>
                    <RechartsTooltip 
                        formatter={(value: number) => `Rp ${value.toLocaleString('id-ID')}`}
                        contentStyle={{ backgroundColor: '#fff', borderRadius: '8px', border: '1px solid #e2e8f0' }}
                    />
                    <Legend />
                  </PieChart>
                </ResponsiveContainer>
             ) : (
                <div className="h-full flex items-center justify-center text-slate-400">
                    Belum ada data pengeluaran
                </div>
             )}
          </div>
        </div>
      </div>
        
      {/* Transaction Trend */}
      <div className="bg-white p-4 md:p-6 rounded-2xl shadow-sm border border-slate-100">
          <h3 className="text-lg font-semibold text-slate-800 mb-6">Aktivitas Harian (7 Hari Terakhir)</h3>
          <div className="h-[300px] w-full">
              <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={monthlyTrend} margin={{ top: 20, right: 30, left: 0, bottom: 0 }}>
                      <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" />
                      <XAxis dataKey="date" stroke="#94a3b8" fontSize={12} tickLine={false} axisLine={false} />
                      <YAxis stroke="#94a3b8" fontSize={12} tickLine={false} axisLine={false} tickFormatter={(val) => `Rp${val/1000}k`} />
                      <RechartsTooltip 
                          formatter={(value: number) => `Rp ${value.toLocaleString('id-ID')}`}
                          cursor={{ fill: '#f1f5f9' }}
                          contentStyle={{ backgroundColor: '#fff', borderRadius: '8px', border: '1px solid #e2e8f0' }}
                      />
                      <Legend wrapperStyle={{ paddingTop: '20px' }} />
                      <Bar dataKey="income" name="Pemasukan" fill="#10b981" stackId="a" radius={[0, 0, 4, 4]} />
                      <Bar dataKey="expense" name="Pengeluaran" fill="#ef4444" stackId="a" radius={[4, 4, 0, 0]} />
                  </BarChart>
              </ResponsiveContainer>
          </div>
      </div>
    </div>
  );
};