
import React, { useState, useEffect } from 'react';
import { CheckCircleIcon, TrashIcon, AlertIcon, CalendarIcon } from './Icons';

interface Task {
  id: number;
  title: string;
  priority: 'high' | 'medium' | 'low';
  completed: boolean;
  createdAt: string;
}

export const Tasks: React.FC = () => {
  const [tasks, setTasks] = useState<Task[]>(() => {
    try {
      const localData = localStorage.getItem('tasks');
      return localData ? JSON.parse(localData) : [];
    } catch (e) {
      return [];
    }
  });

  const [inputValue, setInputValue] = useState('');
  const [priority, setPriority] = useState<'high' | 'medium' | 'low'>('medium');
  const [filter, setFilter] = useState<'all' | 'pending' | 'completed'>('all');

  useEffect(() => {
    localStorage.setItem('tasks', JSON.stringify(tasks));
    window.dispatchEvent(new Event('storage')); // Atualiza Dashboard
  }, [tasks]);

  const handleAddTask = (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputValue.trim()) return;

    const newTask: Task = {
      id: Date.now(),
      title: inputValue.trim(),
      priority,
      completed: false,
      createdAt: new Date().toLocaleDateString('pt-BR')
    };

    setTasks([newTask, ...tasks]);
    setInputValue('');
  };

  const toggleTask = (id: number) => {
    setTasks(tasks.map(t => t.id === id ? { ...t, completed: !t.completed } : t));
  };

  const deleteTask = (id: number) => {
    setTasks(tasks.filter(t => t.id !== id));
  };

  const getPriorityColor = (p: string) => {
    switch(p) {
      case 'high': return 'bg-red-500 text-white';
      case 'medium': return 'bg-yellow-500 text-black';
      case 'low': return 'bg-blue-500 text-white';
      default: return 'bg-gray-500';
    }
  };

  const getPriorityLabel = (p: string) => {
    switch(p) {
      case 'high': return 'Alta';
      case 'medium': return 'Média';
      case 'low': return 'Baixa';
      default: return '';
    }
  };

  const filteredTasks = tasks.filter(t => {
    if (filter === 'pending') return !t.completed;
    if (filter === 'completed') return t.completed;
    return true;
  });

  const pendingCount = tasks.filter(t => !t.completed).length;

  return (
    <div className="flex-1 overflow-y-auto bg-gradient-to-br from-slate-800 to-blue-900 p-8 font-sans text-white">
      <header className="flex items-center justify-between mb-8">
        <div className="flex items-center space-x-3">
          <div className="w-12 h-12 rounded-lg flex items-center justify-center bg-blue-400/20 text-blue-300">
            <CheckCircleIcon />
          </div>
          <div>
            <h1 className="text-3xl font-bold text-white">Minhas Tarefas</h1>
            <p className="text-md text-white/80">
              {pendingCount > 0 ? `Você tem ${pendingCount} tarefas pendentes` : "Tudo em dia! Parabéns."}
            </p>
          </div>
        </div>
      </header>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Coluna de Adição */}
        <div className="bg-white/5 backdrop-blur-md border border-white/10 p-6 rounded-2xl h-fit">
          <h2 className="text-xl font-semibold mb-4">Nova Tarefa</h2>
          <form onSubmit={handleAddTask} className="space-y-4">
            <div>
              <label className="block text-sm text-white/60 mb-1">O que precisa ser feito?</label>
              <input 
                type="text"
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                placeholder="Ex: Pagar conta de luz, Agendar médico..."
                className="w-full p-3 rounded-lg bg-black/20 border border-white/10 focus:outline-none focus:border-blue-400 text-white transition-colors"
              />
            </div>
            
            <div>
              <label className="block text-sm text-white/60 mb-2">Prioridade</label>
              <div className="flex gap-2">
                {(['low', 'medium', 'high'] as const).map((p) => (
                  <button
                    key={p}
                    type="button"
                    onClick={() => setPriority(p)}
                    className={`flex-1 py-2 rounded-lg text-sm font-medium transition-all ${
                      priority === p 
                        ? getPriorityColor(p) + ' shadow-lg scale-105' 
                        : 'bg-white/5 text-white/60 hover:bg-white/10'
                    }`}
                  >
                    {getPriorityLabel(p)}
                  </button>
                ))}
              </div>
            </div>

            <button 
              type="submit"
              disabled={!inputValue.trim()}
              className="w-full py-3 bg-blue-600 hover:bg-blue-500 text-white font-bold rounded-lg shadow-lg transition-all disabled:opacity-50 disabled:cursor-not-allowed mt-2"
            >
              Adicionar Tarefa
            </button>
          </form>
        </div>

        {/* Lista de Tarefas */}
        <div className="lg:col-span-2 space-y-4">
          {/* Filtros */}
          <div className="flex gap-2 mb-4 overflow-x-auto pb-2">
            {(['all', 'pending', 'completed'] as const).map((f) => (
              <button
                key={f}
                onClick={() => setFilter(f)}
                className={`px-4 py-1.5 rounded-full text-sm font-medium transition-colors whitespace-nowrap ${
                  filter === f 
                    ? 'bg-white text-blue-900' 
                    : 'bg-white/5 text-white/60 hover:bg-white/10'
                }`}
              >
                {f === 'all' ? 'Todas' : f === 'pending' ? 'Pendentes' : 'Concluídas'}
              </button>
            ))}
          </div>

          <div className="space-y-3 custom-scrollbar max-h-[600px] overflow-y-auto pr-2">
            {filteredTasks.length === 0 ? (
              <div className="text-center py-16 bg-white/5 rounded-2xl border border-dashed border-white/10">
                <p className="text-white/40">Nenhuma tarefa encontrada nesta categoria.</p>
              </div>
            ) : (
              filteredTasks.map(task => (
                <div 
                  key={task.id}
                  className={`group flex items-center justify-between p-4 rounded-xl border transition-all duration-300 ${
                    task.completed 
                      ? 'bg-white/5 border-white/5 opacity-60' 
                      : 'bg-white/10 border-white/10 hover:border-white/20 hover:bg-white/15 shadow-md'
                  }`}
                >
                  <div className="flex items-center gap-4 flex-1">
                    <button
                      onClick={() => toggleTask(task.id)}
                      className={`w-6 h-6 rounded-full border-2 flex items-center justify-center transition-colors ${
                        task.completed 
                          ? 'bg-green-500 border-green-500 text-white' 
                          : 'border-white/30 hover:border-blue-400'
                      }`}
                    >
                      {task.completed && <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" /></svg>}
                    </button>
                    
                    <div className="flex-1">
                      <p className={`font-medium text-lg transition-all ${task.completed ? 'line-through text-white/50' : 'text-white'}`}>
                        {task.title}
                      </p>
                      <div className="flex items-center gap-3 mt-1">
                        <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full uppercase tracking-wide ${getPriorityColor(task.priority)}`}>
                          {getPriorityLabel(task.priority)}
                        </span>
                        <span className="text-xs text-white/40 flex items-center gap-1">
                          <CalendarIcon /> {task.createdAt}
                        </span>
                      </div>
                    </div>
                  </div>

                  <button 
                    onClick={() => deleteTask(task.id)}
                    className="p-2 text-white/20 hover:text-red-400 hover:bg-red-500/10 rounded-lg transition-colors opacity-0 group-hover:opacity-100"
                    title="Excluir tarefa"
                  >
                    <TrashIcon />
                  </button>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
