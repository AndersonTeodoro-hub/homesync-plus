
import React, { useState, useEffect } from 'react';
import { FinanceIcon, DollarIcon, TrashIcon } from './Icons';

interface Transaction {
  id: number;
  description: string;
  amount: number;
  type: 'income' | 'expense';
  date: string;
}

export const Finances: React.FC = () => {
  const [transactions, setTransactions] = useState<Transaction[]>(() => {
    try {
      const localData = localStorage.getItem('financeTransactions');
      return localData ? JSON.parse(localData) : [];
    } catch (e) {
      return [];
    }
  });

  const [description, setDescription] = useState('');
  const [amount, setAmount] = useState('');
  const [type, setType] = useState<'income' | 'expense'>('expense');

  useEffect(() => {
    localStorage.setItem('financeTransactions', JSON.stringify(transactions));
    // Dispara evento para atualizar o Dashboard se estiver montado
    window.dispatchEvent(new Event('storage'));
  }, [transactions]);

  const handleAddTransaction = (e: React.FormEvent) => {
    e.preventDefault();
    if (!description || !amount) return;

    const newTransaction: Transaction = {
      id: Date.now(),
      description,
      amount: parseFloat(amount),
      type,
      date: new Date().toLocaleDateString('pt-BR')
    };

    setTransactions([newTransaction, ...transactions]);
    setDescription('');
    setAmount('');
  };

  const handleDelete = (id: number) => {
    setTransactions(transactions.filter(t => t.id !== id));
  };

  const totalBalance = transactions.reduce((acc, curr) => {
    return curr.type === 'income' ? acc + curr.amount : acc - curr.amount;
  }, 0);

  const totalIncome = transactions.filter(t => t.type === 'income').reduce((acc, curr) => acc + curr.amount, 0);
  const totalExpense = transactions.filter(t => t.type === 'expense').reduce((acc, curr) => acc + curr.amount, 0);

  return (
    <div className="flex-1 overflow-y-auto bg-gradient-to-br from-indigo-600 to-slate-900 p-8 font-sans text-white">
      <header className="flex items-center space-x-3 mb-8">
        <div className="w-12 h-12 rounded-lg flex items-center justify-center bg-indigo-400/20 text-indigo-300">
          <FinanceIcon />
        </div>
        <div>
          <h1 className="text-3xl font-bold text-white">Controle Financeiro</h1>
          <p className="text-md text-white/80">Gerencie suas receitas e despesas</p>
        </div>
      </header>

      {/* Cards de Resumo */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div className="bg-white/10 backdrop-blur-md p-5 rounded-2xl border border-white/10">
          <p className="text-sm text-white/60">Saldo Total</p>
          <p className={`text-3xl font-bold ${totalBalance >= 0 ? 'text-emerald-400' : 'text-red-400'}`}>
            R$ {totalBalance.toFixed(2)}
          </p>
        </div>
        <div className="bg-emerald-500/20 backdrop-blur-md p-5 rounded-2xl border border-emerald-500/30">
          <p className="text-sm text-emerald-200">Entradas</p>
          <p className="text-2xl font-bold text-emerald-400">+ R$ {totalIncome.toFixed(2)}</p>
        </div>
        <div className="bg-red-500/20 backdrop-blur-md p-5 rounded-2xl border border-red-500/30">
          <p className="text-sm text-red-200">Saídas</p>
          <p className="text-2xl font-bold text-red-400">- R$ {totalExpense.toFixed(2)}</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Formulário */}
        <div className="bg-black/20 backdrop-blur-sm p-6 rounded-2xl border border-white/10 h-fit">
          <h3 className="text-xl font-semibold mb-4">Nova Transação</h3>
          <form onSubmit={handleAddTransaction} className="space-y-4">
            <div>
              <label className="block text-sm text-white/70 mb-1">Descrição</label>
              <input 
                type="text" 
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Ex: Mercado, Salário..."
                className="w-full p-3 rounded-lg bg-black/30 border border-white/10 focus:outline-none focus:border-indigo-400 text-white"
              />
            </div>
            <div>
              <label className="block text-sm text-white/70 mb-1">Valor (R$)</label>
              <input 
                type="number" 
                step="0.01"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                placeholder="0.00"
                className="w-full p-3 rounded-lg bg-black/30 border border-white/10 focus:outline-none focus:border-indigo-400 text-white"
              />
            </div>
            <div>
              <label className="block text-sm text-white/70 mb-2">Tipo</label>
              <div className="flex gap-2">
                <button
                  type="button"
                  onClick={() => setType('income')}
                  className={`flex-1 py-2 rounded-lg font-medium transition-colors ${type === 'income' ? 'bg-emerald-600 text-white' : 'bg-white/5 text-white/60 hover:bg-white/10'}`}
                >
                  Entrada
                </button>
                <button
                  type="button"
                  onClick={() => setType('expense')}
                  className={`flex-1 py-2 rounded-lg font-medium transition-colors ${type === 'expense' ? 'bg-red-600 text-white' : 'bg-white/5 text-white/60 hover:bg-white/10'}`}
                >
                  Saída
                </button>
              </div>
            </div>
            <button 
              type="submit"
              className="w-full py-3 bg-indigo-600 hover:bg-indigo-500 text-white font-bold rounded-lg shadow-lg transition-all mt-2"
            >
              Adicionar
            </button>
          </form>
        </div>

        {/* Lista */}
        <div className="lg:col-span-2">
          <h3 className="text-xl font-semibold mb-4 flex items-center justify-between">
            <span>Histórico</span>
            <span className="text-sm font-normal text-white/50">{transactions.length} registros</span>
          </h3>
          
          <div className="space-y-3 max-h-[500px] overflow-y-auto pr-2 custom-scrollbar">
            {transactions.length === 0 ? (
              <div className="text-center py-10 text-white/30 bg-white/5 rounded-xl border border-white/5">
                <DollarIcon />
                <p className="mt-2">Nenhuma transação registrada.</p>
              </div>
            ) : (
              transactions.map(t => (
                <div key={t.id} className="flex items-center justify-between p-4 bg-white/5 border border-white/5 rounded-xl hover:bg-white/10 transition-colors group">
                  <div className="flex items-center gap-4">
                    <div className={`p-2 rounded-full ${t.type === 'income' ? 'bg-emerald-500/20 text-emerald-400' : 'bg-red-500/20 text-red-400'}`}>
                      <DollarIcon />
                    </div>
                    <div>
                      <p className="font-medium text-white">{t.description}</p>
                      <p className="text-xs text-white/50">{t.date}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-4">
                    <span className={`font-bold ${t.type === 'income' ? 'text-emerald-400' : 'text-red-400'}`}>
                      {t.type === 'income' ? '+' : '-'} R$ {t.amount.toFixed(2)}
                    </span>
                    <button 
                      onClick={() => handleDelete(t.id)}
                      className="text-white/20 hover:text-red-400 transition-colors opacity-0 group-hover:opacity-100"
                    >
                      <TrashIcon />
                    </button>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
