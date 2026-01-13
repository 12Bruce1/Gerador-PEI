import React, { useRef } from 'react';
import { StudentData, AppStatus } from '../types';
import { User, Brain, Heart, Sparkles, Activity, FileText, Upload, X, FileImage, FileType } from 'lucide-react';

interface StudentFormProps {
  data: StudentData;
  onChange: (data: StudentData) => void;
  onSubmit: () => void;
  status: AppStatus;
}

export const StudentForm: React.FC<StudentFormProps> = ({ data, onChange, onSubmit, status }) => {
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    onChange({
      ...data,
      [name]: name === 'age' ? parseInt(value) || 0 : value
    });
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        const base64String = reader.result as string;
        // Remove the "data:*/*;base64," prefix for the API
        const base64Data = base64String.split(',')[1];
        
        onChange({
          ...data,
          diagnosisFile: base64Data,
          diagnosisMimeType: file.type
        });
      };
      reader.readAsDataURL(file);
    }
  };

  const removeFile = () => {
    if (fileInputRef.current) fileInputRef.current.value = '';
    onChange({
      ...data,
      diagnosisFile: undefined,
      diagnosisMimeType: undefined
    });
  };

  const isFormValid = data.name && (data.diagnosis || data.diagnosisFile) && data.strengths && data.difficulties;

  return (
    <div className="bg-white/80 backdrop-blur-xl rounded-3xl shadow-xl shadow-brand-500/5 border border-white/20 p-6 md:p-8 transition-all hover:shadow-2xl hover:shadow-brand-500/10">
      <div className="mb-8">
        <h2 className="text-2xl font-bold text-gray-800 flex items-center gap-3">
          <div className="bg-brand-100 p-2 rounded-xl">
             <User className="w-6 h-6 text-brand-600" />
          </div>
          Dados do Aluno
        </h2>
        <p className="text-gray-500 text-sm mt-2 ml-1">Preencha as informações essenciais para personalizar o PEI.</p>
      </div>

      <div className="space-y-8">
        {/* Row 1: Name and Age */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <div className="md:col-span-3 group">
            <label className="block text-sm font-semibold text-gray-700 mb-2">Nome Completo</label>
            <input
              type="text"
              name="name"
              value={data.name}
              onChange={handleChange}
              placeholder="Ex: Maria da Silva"
              className="w-full px-5 py-3 rounded-xl bg-white border border-gray-200 focus:ring-4 focus:ring-brand-500/10 focus:border-brand-500 outline-none transition-all placeholder:text-gray-400 font-medium"
            />
          </div>
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">Idade</label>
            <input
              type="number"
              name="age"
              min={1}
              max={100}
              value={data.age}
              onChange={handleChange}
              className="w-full px-5 py-3 rounded-xl bg-white border border-gray-200 focus:ring-4 focus:ring-brand-500/10 focus:border-brand-500 outline-none transition-all font-medium"
            />
          </div>
        </div>

        {/* Diagnosis Section */}
        <div className="bg-gray-50/50 rounded-2xl p-5 border border-gray-100">
          <label className="block text-sm font-semibold text-gray-700 mb-3 flex items-center gap-2">
            <Activity className="w-4 h-4 text-brand-500" />
            Diagnóstico Clínico
          </label>
          
          <div className="space-y-4">
            <textarea
              name="diagnosis"
              value={data.diagnosis}
              onChange={handleChange}
              rows={2}
              placeholder="Descreva o diagnóstico (Ex: TEA Nível 1, TDAH...) ou anexe um documento."
              className="w-full px-5 py-3 rounded-xl bg-white border border-gray-200 focus:ring-4 focus:ring-brand-500/10 focus:border-brand-500 outline-none transition-all resize-none"
            />

            {/* File Upload Area */}
            <div className="relative">
              {!data.diagnosisFile ? (
                <div 
                  onClick={() => fileInputRef.current?.click()}
                  className="border-2 border-dashed border-gray-300 rounded-xl p-6 text-center cursor-pointer hover:border-brand-400 hover:bg-brand-50/50 transition-all group"
                >
                  <div className="bg-white p-3 rounded-full w-12 h-12 flex items-center justify-center mx-auto mb-3 shadow-sm group-hover:scale-110 transition-transform">
                     <Upload className="w-5 h-5 text-brand-500" />
                  </div>
                  <p className="text-sm font-medium text-gray-700">Clique para anexar laudo médico</p>
                  <p className="text-xs text-gray-400 mt-1">Suporta Imagens (JPG, PNG) e PDF - A IA lerá o documento</p>
                </div>
              ) : (
                <div className="flex items-center justify-between bg-white border border-brand-200 rounded-xl p-4 shadow-sm">
                  <div className="flex items-center gap-3">
                    <div className={`p-2 rounded-lg ${data.diagnosisMimeType === 'application/pdf' ? 'bg-red-50' : 'bg-brand-50'}`}>
                      {data.diagnosisMimeType === 'application/pdf' ? (
                        <FileType className="w-5 h-5 text-red-500" />
                      ) : (
                        <FileImage className="w-5 h-5 text-brand-600" />
                      )}
                    </div>
                    <div>
                        <p className="text-sm font-semibold text-gray-800">
                          {data.diagnosisMimeType === 'application/pdf' ? 'Documento PDF Anexado' : 'Imagem Anexada'}
                        </p>
                        <p className="text-xs text-green-600 font-medium">Pronto para análise</p>
                    </div>
                  </div>
                  <button 
                    onClick={removeFile}
                    className="p-2 hover:bg-red-50 text-gray-400 hover:text-red-500 rounded-lg transition-colors"
                  >
                    <X className="w-5 h-5" />
                  </button>
                </div>
              )}
              <input 
                ref={fileInputRef}
                type="file" 
                accept="image/png, image/jpeg, image/webp, application/pdf" 
                onChange={handleFileChange}
                className="hidden" 
              />
            </div>
          </div>
        </div>

        <div className="border-t border-gray-100 pt-6">
            <h2 className="text-xl font-bold text-gray-800 flex items-center gap-3 mb-6">
               <div className="bg-amber-100 p-2 rounded-xl">
                 <Brain className="w-5 h-5 text-amber-600" />
               </div>
               Perfil de Aprendizagem
            </h2>
            
            <div className="space-y-6">
                {/* Strengths */}
                <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2 flex items-center gap-2">
                    <Sparkles className="w-4 h-4 text-amber-500" />
                    Pontos Fortes
                </label>
                <textarea
                    name="strengths"
                    value={data.strengths}
                    onChange={handleChange}
                    rows={3}
                    placeholder="Habilidades, talentos e facilidades do aluno."
                    className="w-full px-5 py-3 rounded-xl bg-white border border-gray-200 focus:ring-4 focus:ring-brand-500/10 focus:border-brand-500 outline-none transition-all"
                />
                </div>

                {/* Difficulties */}
                <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2 flex items-center gap-2">
                    <Heart className="w-4 h-4 text-rose-500" />
                    Dificuldades e Desafios
                </label>
                <textarea
                    name="difficulties"
                    value={data.difficulties}
                    onChange={handleChange}
                    rows={3}
                    placeholder="Desafios comportamentais ou de aprendizagem."
                    className="w-full px-5 py-3 rounded-xl bg-white border border-gray-200 focus:ring-4 focus:ring-brand-500/10 focus:border-brand-500 outline-none transition-all"
                />
                </div>

                {/* Hyperfocus */}
                <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2 flex items-center gap-2">
                    <Brain className="w-4 h-4 text-indigo-500" />
                    Hiperfocos e Interesses
                </label>
                <textarea
                    name="hyperfocus"
                    value={data.hyperfocus}
                    onChange={handleChange}
                    rows={2}
                    placeholder="Temas de alto interesse (ex: Dinossauros, Minecraft)."
                    className="w-full px-5 py-3 rounded-xl bg-white border border-gray-200 focus:ring-4 focus:ring-brand-500/10 focus:border-brand-500 outline-none transition-all resize-none"
                />
                </div>
            </div>
        </div>

        <button
          onClick={onSubmit}
          disabled={status === AppStatus.LOADING || !isFormValid}
          className={`w-full py-4 px-6 rounded-xl text-white font-bold text-lg shadow-xl shadow-brand-500/20 transform transition-all flex items-center justify-center gap-2
            ${status === AppStatus.LOADING 
                ? 'bg-gray-400 cursor-not-allowed' 
                : isFormValid 
                    ? 'bg-gradient-to-r from-brand-600 to-indigo-600 hover:from-brand-500 hover:to-indigo-500 hover:scale-[1.01] active:scale-[0.99]' 
                    : 'bg-gray-300 cursor-not-allowed text-gray-500'
            }`}
        >
          {status === AppStatus.LOADING ? (
            <>
              <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              Analisando e Gerando...
            </>
          ) : (
            <>
              <FileText className="w-5 h-5" />
              Gerar PEI Profissional
            </>
          )}
        </button>
        {!isFormValid && (
            <p className="text-center text-sm text-red-400 font-medium bg-red-50 py-2 rounded-lg border border-red-100">
                Preencha o nome, diagnóstico (ou anexe arquivo) e perfil de aprendizagem.
            </p>
        )}
      </div>
    </div>
  );
};