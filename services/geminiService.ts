import { GoogleGenAI } from "@google/genai";
import { Transaction } from "../types";

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

export const analyzeFinancialData = async (transactions: Transaction[]): Promise<string> => {
  if (!process.env.API_KEY) {
    return "API Key tidak ditemukan. Mohon pastikan API Key Google Gemini sudah terkonfigurasi di Environment Variables.";
  }

  // Prepare data for the prompt
  const transactionSummary = transactions.map(t => 
    `- ${t.date}: ${t.description} (${t.type === 'income' ? '+' : '-'}${t.amount.toLocaleString('id-ID')}) [${t.category}]`
  ).join('\n');

  const prompt = `
    Saya memiliki data transaksi keuangan usaha berikut:
    ${transactionSummary}

    Tolong bertindak sebagai penasihat keuangan bisnis senior. Lakukan analisis mendalam mengenai:
    1. Performa setiap unit usaha (Menjahit, Las, Doorsmeer, Pangkas, Pertanian, dll).
    2. Keseimbangan antara pemasukan dan pengeluaran operasional.
    3. Identifikasi unit usaha yang paling menguntungkan (sapi perah) dan yang perlu efisiensi.
    4. KHUSUS untuk setiap unit usaha yang diidentifikasi menguntungkan, berikan strategi pemasaran kreatif atau langkah operasional yang spesifik (tailored) untuk meningkatkan omzet unit tersebut lebih jauh lagi.
    5. Berikan 3 saran strategis umum untuk mengembangkan kesehatan finansial usaha ini secara keseluruhan.
    
    Jawablah dalam Bahasa Indonesia dengan nada yang profesional, solutif, namun mudah dipahami. Gunakan format Markdown untuk struktur yang rapi.
  `;

  try {
    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: prompt,
    });
    
    return response.text || "Maaf, tidak dapat menghasilkan analisis saat ini.";
  } catch (error) {
    console.error("Error calling Gemini API:", error);
    return "Terjadi kesalahan saat menghubungi layanan AI. Silakan coba lagi nanti.";
  }
};