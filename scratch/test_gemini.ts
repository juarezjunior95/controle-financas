import { GoogleGenAI } from '@google/genai';
import * as dotenv from 'dotenv';
import * as path from 'path';

// Carregar .env da raiz
dotenv.config({ path: path.join(__dirname, '../../.env') });

const apiKey = process.env.GEMINI_API_KEY;

if (!apiKey) {
  console.error('ERRO: GEMINI_API_KEY não encontrada no .env');
  process.exit(1);
}

async function listModels() {
  try {
    const ai = new GoogleGenAI({ apiKey });
    // O SDK @google/genai (novo) tem uma estrutura diferente para listar modelos
    // Vamos tentar buscar a lista se disponível ou testar o 1.5-flash-latest
    console.log('Testando conexão com a API do Gemini...');
    
    // Teste direto com 1.5-flash-latest
    try {
        const response = await ai.models.generateContent({
            model: 'gemini-1.5-flash-latest',
            contents: 'Oi',
        });
        console.log('SUCESSO: gemini-1.5-flash-latest funciona.');
    } catch (e) {
        console.log('FALHA: gemini-1.5-flash-latest não encontrado.');
    }

    // Teste direto com gemini-2.0-flash
    try {
        const response = await ai.models.generateContent({
            model: 'gemini-2.0-flash',
            contents: 'Oi',
        });
        console.log('SUCESSO: gemini-2.0-flash funciona.');
    } catch (e) {
        console.log('FALHA: gemini-2.0-flash não encontrado.');
    }

  } catch (error) {
    console.error('Erro ao conectar:', error);
  }
}

listModels();
