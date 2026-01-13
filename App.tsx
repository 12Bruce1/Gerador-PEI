import React, { useState, useEffect } from 'react';
import { StudentData, GeneratedPEI, AppStatus, HistoryRecord } from './types';
import { generatePEIContent } from './services/geminiService';
import { StudentForm } from './components/StudentForm';
import { ResultDisplay } from './components/ResultDisplay';
import { HistoryList } from './components/HistoryList';
import { BookOpen, Sparkles, History, Zap } from 'lucide-react';

const initialStudentData: StudentData = {
  name: '',
  age: 7,
  diagnosis: '',
  strengths: '',
  difficulties: '',
  hyperfocus: ''
};

export default function App() {
  const [studentData, setStudentData] = useState<StudentData>(initialStudentData);
  const [status, setStatus] = useState<AppStatus>(AppStatus.IDLE);
  const [result, setResult] = useState<GeneratedPEI | null>(null);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  
  // History State
  const [history, setHistory] = useState<HistoryRecord[]>([]);
  const [isHistoryOpen, setIsHistoryOpen] = useState(false);

  // Load history from localStorage on mount
  useEffect(() => {
    const savedHistory = localStorage.getItem('pei_history');
    if (savedHistory) {
      try {
        setHistory(JSON.parse(savedHistory));
      } catch (e) {
        console.error("Failed to parse history", e);
      }
    }
  }, []);

  const saveToHistory = (data: StudentData, content: string) => {
    // Create a copy of student data without the file to save local storage space
    const dataToSave = { ...data };
    delete dataToSave.diagnosisFile;
    delete dataToSave.diagnosisMimeType;

    const newRecord: HistoryRecord = {
      id: crypto.randomUUID(),
      timestamp: new Date().toISOString(),
      studentData: dataToSave,
      content: content
    };

    const updatedHistory = [newRecord, ...history];
    setHistory(updatedHistory);
    localStorage.setItem('pei_history', JSON.stringify(updatedHistory));
  };

  const deleteHistoryItem = (id: string) => {
    const updatedHistory = history.filter(item => item.id !== id);
    setHistory(updatedHistory);
    localStorage.setItem('pei_history', JSON.stringify(updatedHistory));
  };

  const loadHistoryItem = (record: HistoryRecord) => {
    setStudentData(record.studentData);
    setResult({
      content: record.content,
      timestamp: new Date(record.timestamp)
    });
    setStatus(AppStatus.SUCCESS);
    setIsHistoryOpen(false);
    setErrorMsg(null);
  };

  const handleSubmit = async () => {
    setStatus(AppStatus.LOADING);
    setErrorMsg(null);
    setResult(null);

    try {
      const content = await generatePEIContent(studentData);
      setResult({
        content,
        timestamp: new Date()
      });
      setStatus(AppStatus.SUCCESS);
      
      // Auto-save to history
      saveToHistory(studentData, content);
    } catch (error) {
      console.error(error);
      setStatus(AppStatus.ERROR);
      setErrorMsg("Falha ao gerar o PEI. Verifique sua conexão e tente novamente.");
    }
  };

  const handleUpdateContent = (newContent: string) => {
    if (result) {
      setResult({
        ...result,
        content: newContent
      });
    }
  };

  return (
    <div className="min-h-screen flex flex-col font-sans">
      {/* Modern Backdrop is handled in index.html, this is the main container */}
      
      {/* Header */}
      <header className="bg-white/70 backdrop-blur-lg border-b border-white/20 sticky top-0 z-30 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="bg-gradient-to-br from-brand-600 to-indigo-700 p-2.5 rounded-xl shadow-lg shadow-brand-500/20">
              <BookOpen className="w-6 h-6 text-white" />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-gray-900 tracking-tight leading-none">Gerador de PEI</h1>
              <p className="text-xs text-brand-600 font-semibold tracking-wide mt-1">POWERED BY GEMINI 2.5</p>
            </div>
          </div>
          
          <div className="flex items-center gap-4">
             <div className="hidden md:flex items-center text-sm font-medium text-gray-600 gap-2 mr-2 bg-white/50 px-3 py-1.5 rounded-full border border-gray-100">
              <Zap className="w-4 h-4 text-amber-500 fill-amber-500" />
              <span>Análise Inteligente</span>
            </div>
            
            <button 
              onClick={() => setIsHistoryOpen(true)}
              className="group flex items-center gap-2 px-5 py-2.5 bg-white hover:bg-gray-50 text-gray-700 border border-gray-200 rounded-xl text-sm font-semibold transition-all shadow-sm hover:shadow-md"
            >
              <History className="w-4 h-4 group-hover:text-brand-600 transition-colors" />
              <span className="hidden sm:inline">Histórico</span>
            </button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-grow max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 w-full relative z-10">
        
        {/* Error Banner */}
        {errorMsg && (
            <div className="mb-8 bg-red-50/90 backdrop-blur border border-red-200 p-4 rounded-2xl shadow-lg shadow-red-500/10 animate-fade-in">
                <div className="flex items-center gap-3">
                    <div className="bg-red-100 p-2 rounded-full">
                       <Sparkles className="w-5 h-5 text-red-500" />
                    </div>
                    <p className="text-red-700 font-medium">{errorMsg}</p>
                </div>
            </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 xl:gap-12 items-start">
          {/* Left Column: Form */}
          <section className="space-y-6">
            <div className="lg:sticky lg:top-28 transition-all duration-500">
                <StudentForm 
                    data={studentData} 
                    onChange={setStudentData} 
                    onSubmit={handleSubmit}
                    status={status}
                />
                
                <div className="mt-6 p-5 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-2xl shadow-xl shadow-indigo-500/20 text-white relative overflow-hidden group">
                    <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
                      <Sparkles className="w-24 h-24" />
                    </div>
                    <div className="relative z-10">
                      <h4 className="font-bold mb-2 text-indigo-100 flex items-center gap-2">
                        <Sparkles className="w-4 h-4" /> Dica Pro
                      </h4>
                      <p className="text-indigo-50 text-sm leading-relaxed opacity-90">
                          Ao anexar um laudo médico (foto), nossa IA extrai automaticamente nuances clínicas que enriquecem as estratégias pedagógicas do PEI.
                      </p>
                    </div>
                </div>
            </div>
          </section>

          {/* Right Column: Result */}
          <section className="min-h-[500px] lg:h-[calc(100vh-10rem)]">
             <ResultDisplay 
                result={result} 
                onUpdateContent={handleUpdateContent}
             />
          </section>
        </div>
      </main>

      {/* History Sidebar */}
      <HistoryList 
        history={history}
        isOpen={isHistoryOpen}
        onClose={() => setIsHistoryOpen(false)}
        onLoad={loadHistoryItem}
        onDelete={deleteHistoryItem}
      />

      {/* Footer */}
      <footer className="bg-white/80 backdrop-blur border-t border-gray-100 mt-auto">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <p className="text-center text-gray-500 text-sm font-medium">
            &copy; {new Date().getFullYear()} Gerador de PEI. Feito com inteligência artificial para educação inclusiva.
          </p>
        </div>
      </footer>
    </div>
  );
}