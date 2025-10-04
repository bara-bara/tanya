// pages/api/generate.js
import { GoogleGenAI } from "@google/genai";

const apiKey = process.env.GEMINI_API_KEY;

export default async function handler(req, res) {
  // Проверяем метод запроса
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Метод не разрешён. Используйте POST.' });
  }

  const { promptText } = req.body;

  // Проверяем наличие текста запроса
  if (!promptText) {
    return res.status(400).json({ error: 'Отсутствует promptText в теле запроса.' });
  }

  // Проверяем наличие API ключа
  if (!apiKey) {
    console.error("ОШИБКА: GEMINI_API_KEY отсутствует или неверно настроен в переменных окружения Vercel.");
    return res.status(500).json({ 
      error: 'API-ключ не настроен. Проверьте переменные окружения Vercel.',
      user_message: 'Извините, система искусственного интеллекта временно недоступна. Пожалуйста, попробуйте позже.'
    });
  }

  const ai = new GoogleGenAI(apiKey);

  // >>>>>> СИСТЕМНЫЕ ИНСТРУКЦИИ (SYSTEM_INSTRUCTION) <<<<<<
  const SYSTEM_INSTRUCTION = `
    Вы — эксперт по маркетингу туристических направлений. Ваша задача — превратить любые данные или описание, предоставленные пользователем, в невероятно привлекательный рекламный "Caption" (текст) для русскоязычной аудитории. 
    Следуйте этим правилам:

    1. **Язык:** используйте только **русский язык**.
    2. **Стиль:** эмоциональный, вдохновляющий, вызывающий желание путешествовать.
    3. **Начало:** начинайте с **вопроса, пробуждающего интерес**, или **смелого рекламного заявления**, которое мгновенно вызывает желание поехать.
    4. **Эмодзи (Emojis):** используйте подходящие яркие эмодзи (🏝️ ✨ ✈️ 🐠 🍹 и др.), чтобы сделать текст живым и привлекательным.
    5. **Структура:** разделите ответ на короткие, соблазнительные подзаголовки и абзацы. Каждый должен раскрывать ключевые преимущества.
    6. **Заключение:** завершите убедительным призывом к действию — например, “Забронируйте сейчас!” или “Свяжитесь с нами сегодня!”.
  `;
  // >>>>>> КОНЕЦ СИСТЕМНЫХ ИНСТРУКЦИЙ <<<<<<

  try {
    const prompt = `Преобразуй это туристическое описание в захватывающий рекламный Caption на русском языке: "${promptText}"`;

    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: prompt,
      config: {
        systemInstruction: SYSTEM_INSTRUCTION,
      },
    });

    // Проверяем результат
    const generatedText = response.text?.trim();
    if (!generatedText) {
      throw new Error("Пустой ответ от модели.");
    }

    res.status(200).json({ caption: generatedText });

  } catch (error) {
    console.error('Ошибка Gemini API:', error.message);
    res.status(500).json({
      error: `Ошибка при обращении к AI: ${error.message}`,
      user_message: 'Произошла ошибка при создании рекламного текста. Пожалуйста, попробуйте снова.'
    });
  }
}
