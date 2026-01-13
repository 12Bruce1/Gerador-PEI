import React, { useState, useEffect } from 'react';
import { GeneratedPEI } from '../types';
import { Download, Copy, Check, FileCheck, Edit2, Save, X, FileText } from 'lucide-react';

interface ResultDisplayProps {
  result: GeneratedPEI | null;
  onUpdateContent?: (newContent: string) => void;
}

export const ResultDisplay: React.FC<ResultDisplayProps> = ({ result, onUpdateContent }) => {
  const [copied, setCopied] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [editableContent, setEditableContent] = useState('');

  // Sync internal state when result changes
  useEffect(() => {
    if (result) {
      setEditableContent(result.content);
      setIsEditing(false); // Reset edit mode on new result
    }
  }, [result]);

  if (!result) {
    return (
      <div className="h-full min-h-[500px] flex flex-col items-center justify-center bg-white/60 backdrop-blur-xl rounded-3xl border-2 border-dashed border-gray-300/60 text-gray-400 p-10 shadow-sm transition-all hover:bg-white/80">
        <div className="bg-gray-100 p-4 rounded-full mb-6">
           <FileCheck className="w-12 h-12 text-gray-300" />
        </div>
        <p className="text-xl font-semibold text-gray-600">O documento aparecerá aqui</p>
        <p className="text-sm text-center max-w-xs mt-3 text-gray-400">
          Preencha o formulário e anexe documentos (opcional) para gerar o plano.
        </p>
      </div>
    );
  }

  const handleCopy = () => {
    navigator.clipboard.writeText(editableContent);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleDownload = () => {
    const element = document.createElement("a");
    const file = new Blob([editableContent], {type: 'text/markdown'});
    element.href = URL.createObjectURL(file);
    element.download = `PEI_Gerado_${new Date().toISOString().split('T')[0]}.md`;
    document.body.appendChild(element);
    element.click();
    document.body.removeChild(element);
  };

  const handleSaveEdit = () => {
    if (onUpdateContent) {
      onUpdateContent(editableContent);
    }
    setIsEditing(false);
  };

  const handleCancelEdit = () => {
    setEditableContent(result.content);
    setIsEditing(false);
  };

  // Simple formatter to make the output look nice without a heavy MD library
  const formatContent = (text: string) => {
    return text.split('\n').map((line, index) => {
      // Headers
      if (line.startsWith('### ')) return <h3 key={index} className="text-lg font-bold text-gray-800 mt-6 mb-3 flex items-center gap-2"><div className="w-1.5 h-1.5 rounded-full bg-brand-400"></div>{line.replace('### ', '')}</h3>;
      if (line.startsWith('## ')) return <h2 key={index} className="text-xl font-bold text-brand-700 mt-8 mb-4 pb-2 border-b border-brand-100">{line.replace('## ', '')}</h2>;
      if (line.startsWith('# ')) return <h1 key={index} className="text-3xl font-extrabold text-gray-900 mb-6">{line.replace('# ', '')}</h1>;
      
      // List items
      if (line.trim().startsWith('* ') || line.trim().startsWith('- ')) {
        const content = line.trim().substring(2);
        const parts = content.split(/(\*\*.*?\*\*)/g);
        return (
          <li key={index} className="ml-4 pl-4 border-l-2 border-brand-200 text-gray-700 my-2 list-none relative">
            {parts.map((part, i) => 
               part.startsWith('**') && part.endsWith('**') 
               ? <strong key={i} className="text-gray-900 font-semibold">{part.slice(2, -2)}</strong> 
               : part
            )}
          </li>
        );
      }
      
      // Standard Paragraphs with Bold support
      if (line.trim() === '') return <br key={index} />;
      
      const parts = line.split(/(\*\*.*?\*\*)/g);
      return (
        <p key={index} className="text-gray-700 leading-relaxed mb-3">
             {parts.map((part, i) => 
               part.startsWith('**') && part.endsWith('**') 
               ? <strong key={i} className="text-gray-900 font-semibold">{part.slice(2, -2)}</strong> 
               : part
            )}
        </p>
      );
    });
  };

  return (
    <div className="bg-white/90 backdrop-blur-xl rounded-3xl shadow-2xl shadow-brand-500/10 border border-white/50 overflow-hidden flex flex-col h-full ring-1 ring-gray-900/5">
      <div className="bg-gray-50/80 border-b border-gray-100 px-6 py-4 flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className={`p-2 rounded-lg ${isEditing ? 'bg-amber-100' : 'bg-green-100'}`}>
             <FileText className={`w-5 h-5 ${isEditing ? 'text-amber-600' : 'text-green-600'}`} />
          </div>
          <div>
            <span className="font-bold text-gray-800 block text-sm">
                {isEditing ? 'Modo de Edição' : 'Visualização'}
            </span>
            <span className="text-xs text-gray-500">
                {isEditing ? 'Você pode alterar o texto livremente' : 'Documento formatado'}
            </span>
          </div>
        </div>
        
        <div className="flex items-center gap-2">
          {isEditing ? (
            <>
              <button 
                onClick={handleCancelEdit}
                className="px-3 py-2 hover:bg-red-50 text-red-600 rounded-xl transition-colors flex items-center gap-2 text-sm font-semibold"
                title="Cancelar edição"
              >
                <X className="w-4 h-4" />
                Cancelar
              </button>
              <button 
                onClick={handleSaveEdit}
                className="px-4 py-2 bg-green-500 hover:bg-green-600 text-white shadow-lg shadow-green-500/30 rounded-xl transition-all flex items-center gap-2 text-sm font-semibold hover:scale-105 active:scale-95"
                title="Salvar alterações"
              >
                <Save className="w-4 h-4" />
                Salvar
              </button>
            </>
          ) : (
            <>
              <button 
                onClick={() => setIsEditing(true)}
                className="p-2.5 hover:bg-gray-100 text-gray-600 rounded-xl transition-colors flex items-center gap-2 text-sm font-medium"
                title="Editar texto"
              >
                <Edit2 className="w-4 h-4" />
              </button>
              <div className="h-6 w-px bg-gray-200 mx-1"></div>
              <button 
                onClick={handleCopy}
                className="p-2.5 hover:bg-gray-100 rounded-xl text-gray-600 transition-colors flex items-center gap-2 text-sm font-medium"
                title="Copiar texto"
              >
                {copied ? <Check className="w-4 h-4 text-green-600" /> : <Copy className="w-4 h-4" />}
              </button>
              <button 
                onClick={handleDownload}
                className="px-4 py-2 bg-brand-600 hover:bg-brand-700 text-white rounded-xl shadow-lg shadow-brand-500/30 transition-all flex items-center gap-2 text-sm font-semibold hover:scale-105 active:scale-95"
                title="Baixar Markdown"
              >
                <Download className="w-4 h-4" />
                Baixar
              </button>
            </>
          )}
        </div>
      </div>
      
      <div className="flex-grow overflow-hidden relative">
        {isEditing ? (
          <textarea
            value={editableContent}
            onChange={(e) => setEditableContent(e.target.value)}
            className="w-full h-full p-8 resize-none outline-none font-mono text-sm text-gray-800 leading-relaxed bg-amber-50/30"
            spellCheck={false}
          />
        ) : (
          <div className="p-8 overflow-y-auto h-full scrollbar-thin scrollbar-thumb-gray-300 scrollbar-track-transparent">
            <div className="prose prose-brand prose-headings:font-sans max-w-none">
              {formatContent(editableContent)}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};