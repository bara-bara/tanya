// pages/api/generate.js
import { GoogleGenAI } from "@google/genai";

// يجب إجراء هذا الفحص قبل تهيئة المكتبة
const apiKey = process.env.GEMINI_API_KEY;

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method Not Allowed' });
  }

  const { promptText } = req.body;

  if (!promptText) {
    return res.status(400).json({ error: 'Missing promptText in request body' });
  }

  // >>>>>> الفحص الجديد للتحقق من المفتاح <<<<<<
  if (!apiKey) {
    console.error("ERROR: GEMINI_API_KEY is missing or invalid in Vercel Environment Variables.");
    return res.status(500).json({ 
        error: 'API Key Not Configured. Please check Vercel Environment Variables.',
        user_message: 'عذراً، لم يتم إعداد نظام الذكاء الاصطناعي بشكل صحيح على الخادم.' // رسالة لطيفة للمستخدم
    });
  }
  
  // تهيئة Gemini API (تحدث فقط إذا كان المفتاح موجوداً)
  const ai = new GoogleGenAI(apiKey);
  
  // الوصف المحدد لدور Gemini:
  const SYSTEM_INSTRUCTION = "أنت مساعد خبير في صياغة Captions إعلانية للسياحة. مهمتك هي تحويل أي نص أو فكرة يقدمها المستخدم إلى Caption سياحي جذاب، لا يقاوم، يركز على الإثارة، المغامرة، أو الاسترخاء لجذب السياح بطريقة خطيرة ومغرية. يجب أن تكون الإجابات قصيرة ومؤثرة.";


  try {
    const prompt = `حول هذه الفكرة/النص إلى Caption سياحي جذاب لا يقاوم: "${promptText}"`;

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
        user_message: 'حدث خطأ أثناء صياغة الـ Caption. يرجى المحاولة مرة أخرى.'
    });
  }
}
