import React, { useState } from 'react';
import { HistoryRecord } from '../types';
import { Search, Trash2, Calendar, User, ArrowRight, FileText } from 'lucide-react';

interface HistoryListProps {
  history: HistoryRecord[];
  isOpen: boolean;
  onClose: () => void;
  onLoad: (record: HistoryRecord) => void;
  onDelete: (id: string) => void;
}

export const HistoryList: React.FC<HistoryListProps> = ({ 
  history, 
  isOpen, 
  onClose, 
  onLoad, 
  onDelete 
}) => {
  const [searchTerm, setSearchTerm] = useState('');

  const filteredHistory = history.filter(item => 
    item.studentData.name.toLowerCase().includes(searchTerm.toLowerCase())
  ).sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime());

  return (
    <>
      {/* Backdrop */}
      <div 
        className={`fixed inset-0 bg-black/20 backdrop-blur-sm z-40 transition-opacity duration-300 ${
          isOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'
        }`} 
        onClick={onClose}
      />

      {/* Drawer */}
      <div 
        className={`fixed inset-y-0 right-0 w-full sm:w-96 bg-white shadow-2xl transform transition-transform duration-300 ease-in-out z-50 flex flex-col ${
          isOpen ? 'translate-x-0' : 'translate-x-full'
        }`}
      >
        <div className="p-6 border-b border-gray-100 flex items-center justify-between bg-gray-50">
          <div className="flex items-center gap-2">
            <div className="bg-brand-100 p-2 rounded-lg">
                <FileText className="w-5 h-5 text-brand-600" />
            </div>
            <h2 className="text-lg font-bold text-gray-800">Histórico de PEIs</h2>
          </div>
          <button 
            onClick={onClose}
            className="p-2 hover:bg-gray-200 rounded-full text-gray-500 transition-colors"
          >
            <ArrowRight className="w-5 h-5" />
          </button>
        </div>

        <div className="p-4 border-b border-gray-100">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
            <input
              type="text"
              placeholder="Pesquisar por aluno..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-brand-500 outline-none text-sm transition-all"
            />
          </div>
        </div>

        <div className="flex-1 overflow-y-auto p-4 space-y-3 bg-gray-50/50">
          {filteredHistory.length === 0 ? (
            <div className="text-center py-12 text-gray-400">
              <p className="text-sm">Nenhum PEI encontrado.</p>
            </div>
          ) : (
            filteredHistory.map((item) => (
              <div 
                key={item.id} 
                className="bg-white rounded-xl p-4 border border-gray-200 hover:shadow-md transition-shadow group relative overflow-hidden"
              >
                <div className="flex justify-between items-start mb-2">
                  <h3 className="font-semibold text-gray-800 flex items-center gap-2">
                    <User className="w-4 h-4 text-brand-500" />
                    {item.studentData.name}
                  </h3>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      onDelete(item.id);
                    }}
                    className="text-gray-400 hover:text-red-500 p-1 rounded-md hover:bg-red-50 transition-colors"
                    title="Excluir"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
                
                <p className="text-xs text-gray-500 mb-3 flex items-center gap-1.5">
                  <Calendar className="w-3 h-3" />
                  {new Date(item.timestamp).toLocaleDateString('pt-BR', { 
                    day: '2-digit', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit' 
                  })}
                </p>

                <p className="text-xs text-gray-600 line-clamp-2 mb-4 bg-gray-50 p-2 rounded-lg border border-gray-100">
                  {item.studentData.diagnosis}
                </p>

                <button
                  onClick={() => onLoad(item)}
                  className="w-full py-2 px-3 bg-brand-50 text-brand-700 text-sm font-medium rounded-lg hover:bg-brand-100 transition-colors flex items-center justify-center gap-2"
                >
                  Carregar PEI
                </button>
              </div>
            ))
          )}
        </div>
        
        <div className="p-4 border-t border-gray-200 bg-white text-center">
             <span className="text-xs text-gray-400">{filteredHistory.length} documentos salvos</span>
        </div>
      </div>
    </>
  );
};