import { GoogleGenAI } from "@google/genai";
import { StudentData } from "../types";

const apiKey = process.env.API_KEY;

// Initialize the client once, assuming the key is present in the environment
const ai = new GoogleGenAI({ apiKey: apiKey });

export const generatePEIContent = async (student: StudentData): Promise<string> => {
  if (!apiKey) {
    throw new Error("API Key is missing in environment variables.");
  }

  const promptText = `
    Aja como um pedagogo especializado em educação especial e inclusiva.
    Você deve criar um Plano de Ensino Individualizado (PEI) detalhado e personalizado
    para um aluno com as seguintes características:

    **Dados do Aluno:**
    - Nome: ${student.name}
    - Idade: ${student.age} anos
    - Diagnóstico: ${student.diagnosis}
    ${student.diagnosisFile ? "(Nota: Um documento médico (PDF ou Imagem) foi anexado para análise complementar do diagnóstico e necessidades)." : ""}

    **Observações Comportamentais e de Aprendizagem:**
    - Pontos Fortes: ${student.strengths}
    - Dificuldades: ${student.difficulties}
    - Hiperfocos: ${student.hyperfocus}

    **Instruções para a Geração do PEI:**
    1.  **Objetivo:** Elaborar um plano de intervenção pedagógica eficaz.
    2.  **Estrutura:** Divida o PEI nas seguintes seções obrigatórias, utilizando Markdown para formatação:
        *   **Sumário Executivo:** Resumo do diagnóstico e objetivos principais. Se houver um documento anexo, incorpore as informações relevantes dele aqui.
        *   **Análise Comportamental e de Aprendizagem:** Detalhamento dos pontos fortes, dificuldades e como o hiperfoco pode ser usado a favor do aprendizado.
        *   **Objetivos Pedagógicos de Curto Prazo:** Pelo menos 3 objetivos específicos, mensuráveis, atingíveis, relevantes e temporais (SMART).
        *   **Estratégias de Intervenção:** Sugestões práticas de atividades, recursos e adaptações curriculares para atingir os objetivos. Inclua ideias de como integrar os hiperfocos do aluno no processo de ensino.
        *   **Critérios de Avaliação:** Métodos para monitorar o progresso do aluno.

    **Formato:** O resultado deve ser retornado inteiramente em Markdown, pronto para ser lido e aplicado por um professor ou terapeuta.
    Não inclua introduções conversacionais ("Aqui está o seu PEI..."), entregue apenas o documento.
  `;

  try {
    let contents: any;

    if (student.diagnosisFile && student.diagnosisMimeType) {
      // Multimodal Request (Text + Image/PDF)
      contents = {
        parts: [
          {
            text: promptText
          },
          {
            inlineData: {
              mimeType: student.diagnosisMimeType,
              data: student.diagnosisFile
            }
          }
        ]
      };
    } else {
      // Text-only Request
      contents = promptText;
    }

    // Using 2.5 flash as it handles multimodal inputs (images and PDFs) extremely well and fast
    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: contents,
    });

    return response.text || "Não foi possível gerar o conteúdo.";
  } catch (error) {
    console.error("Error generating PEI:", error);
    throw error;
  }
};