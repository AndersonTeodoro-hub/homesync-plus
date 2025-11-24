import React, { useState, useEffect } from 'react';
import { ShoppingCartIcon, TrashIcon } from './Icons';

interface ShoppingItem {
  id: number;
  name: string;
  completed: boolean;
}

export const Shopping: React.FC = () => {
  const [items, setItems] = useState<ShoppingItem[]>(() => {
    try {
        const localData = localStorage.getItem('shoppingList');
        return localData ? JSON.parse(localData) : [];
    } catch (error) {
        console.error("Could not parse shopping list from localStorage", error);
        return [];
    }
  });
  const [inputValue, setInputValue] = useState('');

  useEffect(() => {
    try {
        localStorage.setItem('shoppingList', JSON.stringify(items));
    } catch (error) {
        console.error("Could not save shopping list to localStorage", error);
    }
  }, [items]);

  const handleAddItem = (e: React.FormEvent) => {
    e.preventDefault();
    if (inputValue.trim() === '') return;
    const newItem: ShoppingItem = {
      id: Date.now(),
      name: inputValue.trim(),
      completed: false,
    };
    setItems([...items, newItem]);
    setInputValue('');
  };

  const handleToggleItem = (id: number) => {
    setItems(
      items.map(item =>
        item.id === id ? { ...item, completed: !item.completed } : item
      )
    );
  };

  const handleDeleteItem = (id: number) => {
    setItems(items.filter(item => item.id !== id));
  };
  
  const completedCount = items.filter(item => item.completed).length;
  const totalCount = items.length;

  return (
    <div className="flex-1 overflow-y-auto bg-gradient-to-br from-purple-600 to-indigo-900 p-8 font-sans text-white">
      <header className="flex items-center space-x-3 mb-8">
        <div className="w-12 h-12 rounded-lg flex items-center justify-center bg-purple-200/20 text-purple-300">
            <ShoppingCartIcon />
        </div>
        <div>
            <h1 className="text-3xl font-bold text-white">Lista de Compras</h1>
            <p className="text-md text-white/80">
                {totalCount > 0 ? `${completedCount} de ${totalCount} itens marcados` : "Nenhum item na lista"}
            </p>
        </div>
      </header>
      
      <div className="max-w-2xl mx-auto">
        <form onSubmit={handleAddItem} className="flex items-center gap-3 mb-6 bg-black/20 p-2 rounded-xl shadow-lg border border-white/10 backdrop-blur-sm">
          <input
            type="text"
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            placeholder="Adicionar um novo item..."
            className="w-full p-3 border-none rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-400 bg-black/20 text-white placeholder-white/60"
          />
          <button
            type="submit"
            disabled={!inputValue.trim()}
            className="bg-purple-500 text-white font-bold py-3 px-6 rounded-lg hover:bg-purple-600 focus:outline-none focus:ring-2 focus:ring-purple-400 disabled:bg-purple-500/50 disabled:cursor-not-allowed transition-all duration-200 shadow-md"
            aria-label="Adicionar item"
          >
            Adicionar
          </button>
        </form>

        <div className="space-y-3">
          {items.length > 0 ? (
            items.map(item => (
              <div
                key={item.id}
                className={`bg-black/20 backdrop-blur-sm border border-white/10 p-4 rounded-xl shadow-lg flex items-center justify-between transition-all duration-300 ${
                  item.completed ? 'opacity-60' : 'opacity-100'
                }`}
              >
                <div className="flex items-center gap-4">
                  <input
                    type="checkbox"
                    checked={item.completed}
                    onChange={() => handleToggleItem(item.id)}
                    className="h-6 w-6 rounded border-gray-500 bg-white/10 text-purple-500 focus:ring-purple-500 cursor-pointer"
                    id={`item-${item.id}`}
                  />
                  <label htmlFor={`item-${item.id}`} className={`text-white cursor-pointer ${item.completed ? 'line-through text-white/50' : ''}`}>
                    {item.name}
                  </label>
                </div>
                <button
                  onClick={() => handleDeleteItem(item.id)}
                  className="text-white/50 hover:text-red-400 transition-colors"
                  aria-label={`Remover ${item.name}`}
                >
                  <TrashIcon />
                </button>
              </div>
            ))
          ) : (
            <div className="text-center py-12 bg-black/10 rounded-xl">
              <p className="text-white/70">Sua lista de compras está vazia. 🛒</p>
              <p className="text-sm text-white/50">Use o campo acima para adicionar novos itens.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};