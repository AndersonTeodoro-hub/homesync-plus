
import React, { useEffect, useState } from 'react';
import type { View } from '../types';
import { DollarIcon, CheckIcon, ShoppingCartIcon, BoxIcon, AlertIcon, RecentTasksIcon, FamilyIcon } from './Icons';

interface DashboardCardProps {
    icon: React.ReactNode;
    title: string;
    value: string;
    change?: string;
    bgColor: string;
    onClick?: () => void;
    className?: string;
}

const DashboardCard: React.FC<DashboardCardProps> = ({ icon, title, value, change, bgColor, onClick, className = '' }) => (
    <div 
        onClick={onClick} 
        className={`bg-black/20 backdrop-blur-sm p-4 rounded-xl shadow-lg flex items-start space-x-4 border border-white/10 ${onClick ? 'cursor-pointer transition-transform duration-200 hover:scale-105 hover:border-white/30' : ''} ${className}`}
    >
        <div className={`w-12 h-12 rounded-lg flex items-center justify-center ${bgColor}`}>
            {icon}
        </div>
        <div>
            <p className="text-sm text-white/70">{title}</p>
            <p className="text-2xl font-bold text-white">{value}</p>
            {change && <p className="text-xs text-white/60">{change}</p>}
        </div>
    </div>
);


interface DashboardProps {
  setView: (view: View) => void;
}

export const Dashboard: React.FC<DashboardProps> = ({ setView }) => {
    const currentDate = new Date().toLocaleDateString('pt-BR', {
        weekday: 'long',
        year: 'numeric',
        month: 'long',
        day: 'numeric'
    });

    // Estado para dados reais
    const [balance, setBalance] = useState(0);
    const [shoppingCount, setShoppingCount] = useState(0);
    const [tasksCount, setTasksCount] = useState(0);

    useEffect(() => {
        const loadData = () => {
            // Carregar Finanças
            try {
                const financeData = localStorage.getItem('financeTransactions');
                if (financeData) {
                    const transactions = JSON.parse(financeData);
                    const total = transactions.reduce((acc: number, curr: any) => {
                        return curr.type === 'income' ? acc + curr.amount : acc - curr.amount;
                    }, 0);
                    setBalance(total);
                }
            } catch (e) { console.error(e); }

            // Carregar Compras
            try {
                const shoppingData = localStorage.getItem('shoppingList');
                if (shoppingData) {
                    const items = JSON.parse(shoppingData);
                    setShoppingCount(items.filter((i: any) => !i.completed).length);
                }
            } catch (e) { console.error(e); }

            // Carregar Tarefas (NOVO)
            try {
                const tasksData = localStorage.getItem('tasks');
                if (tasksData) {
                    const tasks = JSON.parse(tasksData);
                    setTasksCount(tasks.filter((t: any) => !t.completed).length);
                }
            } catch (e) { console.error(e); }
        };

        loadData();

        // Escutar mudanças no storage para atualizar em tempo real
        window.addEventListener('storage', loadData); 
        return () => window.removeEventListener('storage', loadData);
    }, []);

    return (
        <div className="flex-1 overflow-y-auto bg-gradient-to-br from-cyan-500 to-blue-800 p-8 text-white">
            <header>
                <h1 className="text-3xl font-bold text-white">Bem-vindo ao Async+</h1>
                <p className="text-md text-white/80 capitalize">{currentDate}</p>
            </header>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mt-8">
                <DashboardCard 
                    icon={<DollarIcon />} 
                    title="Saldo Atual" 
                    value={`R$ ${balance.toFixed(2)}`} 
                    change="Atualizado em tempo real"
                    bgColor="bg-green-100"
                    onClick={() => setView('finances')}
                />
                <DashboardCard 
                    icon={<CheckIcon />} 
                    title="Tarefas Pendentes" 
                    value={tasksCount.toString()} 
                    change={tasksCount === 0 ? "Você está em dia!" : "Foco e produtividade!"}
                    bgColor="bg-blue-100"
                    onClick={() => setView('tasks')}
                />
                <DashboardCard 
                    icon={<ShoppingCartIcon />} 
                    title="Para Comprar" 
                    value={`${shoppingCount} itens`}
                    bgColor="bg-purple-100"
                    onClick={() => setView('shopping')}
                />
                <DashboardCard 
                    icon={<BoxIcon />} 
                    title="Estoque Baixo" 
                    value="0" 
                    change="Tudo OK"
                    bgColor="bg-orange-100"
                    onClick={() => setView('inventory')}
                />
                <DashboardCard
                    icon={<FamilyIcon />}
                    title="Gerenciar Família"
                    value="Família"
                    change="Contatos e Agenda"
                    bgColor="bg-pink-100"
                    onClick={() => setView('family')}
                    className="md:col-span-2 lg:col-span-4"
                />
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mt-8">
                <div className="bg-black/20 backdrop-blur-sm border border-white/10 p-6 rounded-xl shadow-lg">
                    <div className="flex items-center space-x-2 mb-4">
                        <span className="text-blue-400"><RecentTasksIcon /></span>
                        <h3 className="font-semibold text-white">Produtividade</h3>
                    </div>
                    <div className="text-center text-white/70 py-8">
                        {tasksCount === 0 ? (
                            <p>Tudo limpo por aqui! Aproveite o descanso. 🎉</p>
                        ) : (
                            <p>Você tem {tasksCount} tarefas aguardando sua atenção.</p>
                        )}
                    </div>
                </div>
                <div className="bg-black/20 backdrop-blur-sm border border-white/10 p-6 rounded-xl shadow-lg">
                     <div className="flex items-center space-x-2 mb-4">
                        <span className="text-orange-400"><AlertIcon /></span>
                        <h3 className="font-semibold text-white">Alertas Importantes</h3>
                    </div>
                    <div className="text-center text-white/70 py-8">
                        <p>Nenhum alerta no momento 👍</p>
                    </div>
                </div>
            </div>
        </div>
    );
};
