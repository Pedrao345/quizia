import { GoogleGenerativeAI } from '@google/generative-ai';

// A chave da API é carregada da variável de ambiente.
// O "!" no final indica ao TypeScript que a variável não será nula.
const API_KEY = process.env.GEMINI_API_KEY!;

// Inicializa o cliente da API do Gemini
const genAI = new GoogleGenerativeAI(API_KEY);

// Função para gerar as perguntas do questionário
export async function gerarPerguntas(assunto: string): Promise<string> {
  try {
    // Escolhe o modelo Gemini que será utilizado. O modelo "gemini-pro" é bom para texto.
    const model = genAI.getGenerativeModel({ model: "gemini-pro" });

    const prompt = `Crie um questionário com 10 perguntas sobre "${assunto}".
    Cada pergunta deve ter 4 alternativas (A, B, C, D) e indicar a resposta correta.
    Formato esperado:
    1. Pergunta 1
       A) Alternativa A
       B) Alternativa B
       C) Alternativa C
       D) Alternativa D
       Resposta Correta: B

    2. Pergunta 2
       A) Alternativa A
       B) Alternativa B
       C) Alternativa C
       D) Alternativa D
       Resposta Correta: A

    ...e assim por diante para todas as 10 perguntas.`;

    const result = await model.generateContent(prompt);
    const response = await result.response;
    const text = response.text();

    return text;
  } catch (error) {
    console.error("Erro ao gerar perguntas com a API Gemini:", error);
    throw new Error("Não foi possível gerar as perguntas. Tente novamente mais tarde.");
  }
}