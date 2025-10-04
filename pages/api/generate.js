// pages/api/generate.js
import { GoogleGenAI } from "@google/genai";

const apiKey = process.env.GEMINI_API_KEY;

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method Not Allowed' });
  }

  const { promptText } = req.body;

  if (!promptText) {
    return res.status(400).json({ error: 'Missing promptText in request body' });
  }

  if (!apiKey) {
    console.error("ERROR: GEMINI_API_KEY is missing or invalid in Vercel Environment Variables.");
    return res.status(500).json({ 
        error: 'API Key Not Configured. Please check Vercel Environment Variables.',
        user_message: 'Извините, система ИИ настроена некорректно. Попробуйте позже.'
    });
  }
  
  const ai = new GoogleGenAI(apiKey);
  
  // >>>>>> إرشادات النظام الجديدة والمعدلة <<<<<<
  const SYSTEM_INSTRUCTION = `
    Вы — эксперт по созданию неотразимых, продающих текстов для туристических агентств.
    Ваша задача: Превратить предоставленные данные в привлекательный рекламный пост для русскоязычной аудитории.

    СТРОГО ПРАВИЛА ВЫВОДА:
    1.  **Язык:** Только **Русский**.
    2.  **Ограничение:** Общая длина текста не должна превышать **1024 символа** (включая пробелы и эмодзи). Текст должен быть максимально ёмким и эффективным.
    3.  **Стиль:** Эмоциональный, убедительный, роскошный (Premium).
    4.  **Форматирование:**
        * **Исключите** горизонтальные разделители (например, ---) или жирные заголовки (например, ***ЗАГОЛОВОК***).
        * Используйте эмодзи (например, ☀️, 💎, ✈️, 🍽️) в начале пунктов списка для разделения информации, **точно как в примере**.
        * Разделите текст на короткие абзацы/блоки по темам (например, Отдых, Питание, Развлечения, Бонус).
    5.  **Начало:** Начните с мощного, цепляющего вопроса или фразы.
    6.  **Конец:** Завершите четким призывом к действию (Call to Action) и контактной информацией (например, "Пишите нам в WhatsApp!").
  `;
  // >>>>>> نهاية الإرشادات الجديدة <<<<<<

  try {
    const prompt = `Преобразуйте следующий текст/данные в привлекательный, продающий рекламный пост на Русском языке (до 1024 символов) с эмодзи и короткими абзацами, не используя разделители "--**": "${promptText}"`;
    
    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash", 
      contents: prompt,
      config: {
        systemInstruction: SYSTEM_INSTRUCTION,
      },
    });

    const generatedText = response.text.trim();
    res.status(200).json({ caption: generatedText });

  } catch (error) {
    console.error('Gemini API Error:', error.message);
    res.status(500).json({ 
        error: `AI call failed: ${error.message}`,
        user_message: 'При обработке запроса произошла ошибка. Пожалуйста, попробуйте еще раз.'
    });
  }
}
