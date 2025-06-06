'use client'; // Indica que este componente é um Client Component

import { useState } from 'react';

// Define a estrutura esperada para uma pergunta.
// Usaremos isso para tipar os dados que virão da API.
interface Pergunta {
  id: number;
  pergunta: string;
  alternativas: {
    A: string;
    B: string;
    C: string;
    D: string;
  };
  respostaCorreta: string;
}

export default function PaginaInicial() {
  const [assunto, setAssunto] = useState<string>('');
  const [perguntas, setPerguntas] = useState<Pergunta[] | null>(null);
  const [carregando, setCarregando] = useState<boolean>(false);
  const [erro, setErro] = useState<string | null>(null);

  const handleGerarQuestionario = async () => {
    setCarregando(true);
    setErro(null);
    setPerguntas(null); // Limpa perguntas anteriores

    try {
      const response = await fetch('/api/questionario', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ assunto }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Erro ao gerar questionário.');
      }

      const data = await response.json();
      // A API retorna as perguntas como uma string de texto.
      // Precisamos parsear essa string para um formato utilizável.
      const perguntasParseadas = parsearPerguntas(data.perguntas);
      setPerguntas(perguntasParseadas);

    } catch (error: any) {
      console.error('Erro ao chamar a API:', error);
      setErro(error.message || 'Ocorreu um erro desconhecido ao gerar o questionário.');
    } finally {
      setCarregando(false);
    }
  };

  // Função auxiliar para parsear o texto retornado pela API do Gemini
  const parsearPerguntas = (texto: string): Pergunta[] => {
    const perguntasArray: Pergunta[] = [];
    const linhas = texto.split('\n').filter(line => line.trim() !== ''); // Remove linhas vazias

    let perguntaAtual: Partial<Pergunta> = {};
    let perguntaId = 1;

    for (const linha of linhas) {
      // Ex: "1. Qual a capital do Brasil?"
      if (/^\d+\.\s/.test(linha)) {
        // Se já tiver uma pergunta incompleta, adiciona ao array (caso haja um erro de formatação da IA)
        if (perguntaAtual.pergunta && Object.keys(perguntaAtual.alternativas || {}).length === 4 && perguntaAtual.respostaCorreta) {
          perguntasArray.push(perguntaAtual as Pergunta);
        }
        perguntaAtual = {
          id: perguntaId++,
          pergunta: linha.replace(/^\d+\.\s/, '').trim(),
          alternativas: {
            A: '',
            B: '',
            C: '',
            D: ''
          },
        };
      } else if (/^[A-D]\)\s/.test(linha)) { // Ex: "A) Brasília"
        const alternativaLetra = linha.substring(0, 1) as 'A' | 'B' | 'C' | 'D';
        const alternativaTexto = linha.substring(linha.indexOf(')') + 1).trim();
        if (perguntaAtual.alternativas) {
          perguntaAtual.alternativas[alternativaLetra] = alternativaTexto;
        }
      } else if (/^Resposta Correta:\s/.test(linha)) { // Ex: "Resposta Correta: B"
        perguntaAtual.respostaCorreta = linha.replace('Resposta Correta:', '').trim();
        // Após encontrar a resposta correta, a pergunta está completa.
        if (perguntaAtual.pergunta && Object.keys(perguntaAtual.alternativas || {}).length === 4) {
          perguntasArray.push(perguntaAtual as Pergunta);
        }
      }
    }
    // Adiciona a última pergunta se estiver completa
    if (perguntaAtual.pergunta && Object.keys(perguntaAtual.alternativas || {}).length === 4 && perguntaAtual.respostaCorreta) {
      perguntasArray.push(perguntaAtual as Pergunta);
    }

    // Filtra para garantir que apenas perguntas completas e bem formadas sejam retornadas
    return perguntasArray.filter(p =>
        p.pergunta &&
        p.alternativas &&
        Object.keys(p.alternativas).length === 4 &&
        p.respostaCorreta &&
        ['A', 'B', 'C', 'D'].includes(p.respostaCorreta)
    );
  };


  return (
    <main className="flex-grow flex items-center justify-center p-6">
      <div className="bg-white p-8 rounded-lg shadow-xl w-full max-w-md text-center">
        <h1 className="text-3xl font-bold mb-6 text-indigo-700">
          Gerador de Questionário
        </h1>
        <p className="text-lg text-gray-700 mb-8">
          Informe um assunto para gerar 10 questões com 4 alternativas!
        </p>

        {!perguntas && ( // Mostra o formulário se não houver perguntas geradas
          <div className="mt-8">
            <input
              type="text"
              placeholder="Ex: História do Brasil, Física Quântica..."
              className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
              value={assunto}
              onChange={(e) => setAssunto(e.target.value)}
              disabled={carregando} // Desabilita enquanto carrega
            />
            <button
              className="mt-4 w-full bg-indigo-600 text-white p-3 rounded-md hover:bg-indigo-700 transition duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
              onClick={handleGerarQuestionario}
              disabled={carregando || assunto.trim() === ''} // Desabilita se vazio ou carregando
            >
              {carregando ? 'Gerando...' : 'Gerar Questionário'}
            </button>
            {erro && <p className="text-red-500 mt-4">{erro}</p>}
          </div>
        )}

        {perguntas && perguntas.length > 0 && ( // Mostra o questionário se perguntas foram geradas
          <div className="text-left mt-8">
            <h2 className="text-2xl font-semibold mb-4 text-indigo-700">Seu Questionário</h2>
            {perguntas.map((p, index) => (
              <div key={p.id} className="mb-6 p-4 border border-gray-200 rounded-md bg-gray-50">
                <p className="font-bold text-gray-800 mb-2">
                  {index + 1}. {p.pergunta}
                </p>
                <ul className="space-y-2">
                  {Object.entries(p.alternativas).map(([letra, textoAlt]) => (
                    <li key={letra} className="text-gray-700">
                      <input
                        type="radio"
                        id={`pergunta-${p.id}-alternativa-${letra}`}
                        name={`pergunta-${p.id}`}
                        value={letra}
                        className="mr-2"
                        // Adicionar a lógica de seleção de resposta aqui no futuro
                      />
                      <label htmlFor={`pergunta-${p.id}-alternativa-${letra}`}>
                        {letra} {textoAlt}
                      </label>
                    </li>
                  ))}
                </ul>
                {/* Por enquanto, para depuração, podemos mostrar a resposta correta */}
                {/* <p className="mt-2 text-sm text-green-600">Resposta Correta: {p.respostaCorreta}</p> */}
              </div>
            ))}
            <button className="mt-6 w-full bg-green-600 text-white p-3 rounded-md hover:bg-green-700 transition duration-300">
              Enviar Respostas
            </button>
          </div>
        )}
      </div>
    </main>
  );
}