import { NextRequest, NextResponse } from 'next/server';
import { gerarPerguntas } from '@/lib/gemini';

export async function POST(request: NextRequest) {
  try {
    const { assunto } = await request.json();

    if (!assunto) {
      return NextResponse.json({ error: 'O assunto é obrigatório.' }, { status: 400 });
    }

    // Chama a função que interage com a API do Gemini
    const perguntasGeradas = await gerarPerguntas(assunto);

    // Retorna as perguntas como texto puro
    return NextResponse.json({ perguntas: perguntasGeradas }, { status: 200 });

  } catch (error: any) {
    console.error('Erro na API Route /api/questionario:', error);
    return NextResponse.json(
      { error: error.message || 'Erro interno do servidor ao gerar questionário.' },
      { status: 500 }
    );
  }
}