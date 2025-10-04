// pages/index.js

import Head from 'next/head';
import { useState, useCallback } from 'react';

// تم حذف: import { GoogleGenAI } from "@google/genai";
// تم حذف: const ai = new GoogleGenAI(process.env.GEMINI_API_KEY);
// تم حذف: const SYSTEM_INSTRUCTION = "..."
// هذا هو التعديل الضروري لحل مشكلة 'client-side exception'

export default function Home() {
  const [inputText, setInputText] = useState('');
  const [caption, setCaption] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  // دالة لمعالجة إرسال النص واستدعاء API Route
  const generateCaption = useCallback(async (e) => {
    e.preventDefault();
    if (!inputText.trim()) return;

    setIsLoading(true);
    setCaption('');

    try {
      // الاتصال بـ API Route الجديد (/api/generate)
      const apiResponse = await fetch('/api/generate', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        // إرسال النص المدخل إلى الـ API Route
        body: JSON.stringify({ promptText: inputText }),
      });

      const data = await apiResponse.json();

      if (apiResponse.ok) {
        setCaption(data.caption);
      } else {
        // التعامل مع الأخطاء التي تأتي من الخادم
        setCaption(`خطأ: ${data.error || 'فشل الاتصال بالخادم.'}`);
      }

    } catch (error) {
      console.error('Fetch Error:', error);
      setCaption('حدث خطأ في الشبكة. يرجى التحقق من اتصالك.');
    } finally {
      setIsLoading(false);
    }
  }, [inputText]);

  return (
    <div className="container">
      <Head>
        <title>جاذب السياح | مولد Captions لا تُقاوم</title>
        <meta name="description" content="مولد Captions سياحية فائقة الجاذبية باستخدام Gemini AI." />
      </Head>

      <main className="main-content">
        <h1>صياغة Captions سياحية لا تُقاوم 🌍✨</h1>
        <p>أدخل فكرتك أو وصف بسيط، ودع الذكاء الاصطناعي يحولها إلى نداء لا يقاوم للسياح!</p>

        <form onSubmit={generateCaption} className="form-area">
          <textarea
            value={inputText}
            onChange={(e) => setInputText(e.target.value)}
            placeholder="مثال: غروب شمس هادئ على شاطئ أبيض"
            rows="4"
            disabled={isLoading}
          />
          <button type="submit" disabled={isLoading || !inputText.trim()}>
            {isLoading ? 'جاري الصياغة...' : 'صِغ لي Caption خطير!'}
          </button>
        </form>

        {caption && (
          <div className="caption-result">
            <h2>الـ Caption الجذاب الخاص بك:</h2>
            <p className="caption-text">{caption}</p>
          </div>
        )}
      </main>

      {/* احتفظ بقسم <style jsx global> كما هو تماماً، فهو يحتوي على التصميم الرائع */}
      <style jsx global>{`
        /* إعادة تعيين بسيطة وتطبيق الخطوط */
        body {
          margin: 0;
          padding: 0;
          font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell, 'Fira Sans', 'Droid Sans', 'Helvetica Neue', sans-serif;
          background: #0f2027;  /* خلفية داكنة متناسقة */
          background: linear-gradient(to right, #2c5364, #203a43, #0f2027); /* تدرج لوني عميق ورائع */
          color: #f0f8ff; /* لون نص فاتح للتباين */
          min-height: 100vh;
        }

        .container {
          display: flex;
          justify-content: center;
          align-items: flex-start;
          padding: 40px 20px;
          min-height: 100vh;
        }

        .main-content {
          background: rgba(255, 255, 255, 0.1);
          padding: 40px;
          border-radius: 15px;
          box-shadow: 0 8px 32px 0 rgba(31, 38, 135, 0.37);
          backdrop-filter: blur(4px);
          -webkit-backdrop-filter: blur(4px);
          border: 1px solid rgba(255, 255, 255, 0.18);
          max-width: 700px;
          width: 100%;
          text-align: center;
        }

        h1 {
          color: #4CAF50; /* لون مميز للعناوين */
          margin-bottom: 10px;
          font-size: 2.5em;
        }

        p {
          opacity: 0.8;
          margin-bottom: 30px;
        }

        /* منطقة الإدخال والزر */
        .form-area {
          display: flex;
          flex-direction: column;
          gap: 15px;
        }

        textarea {
          width: 100%;
          padding: 15px;
          border-radius: 8px;
          border: 1px solid #4CAF50;
          background: rgba(0, 0, 0, 0.4);
          color: #f0f8ff;
          resize: vertical;
          font-size: 1em;
          box-sizing: border-box; /* لضمان أن العرض يشمل البادينغ */
        }
        
        textarea:focus {
            outline: 2px solid #4CAF50;
            border-color: #4CAF50;
        }

        button {
          padding: 15px 25px;
          border: none;
          border-radius: 8px;
          background-color: #4CAF50; /* لون الزر الأساسي */
          color: white;
          font-size: 1.1em;
          cursor: pointer;
          transition: background-color 0.3s ease, transform 0.1s ease;
          font-weight: bold;
        }

        button:hover:not(:disabled) {
          background-color: #45a049;
          transform: translateY(-2px);
        }

        button:disabled {
          background-color: #aaa;
          cursor: not-allowed;
        }

        /* منطقة النتيجة */
        .caption-result {
          margin-top: 40px;
          padding: 20px;
          border: 2px dashed #4CAF50;
          border-radius: 10px;
          background: rgba(0, 0, 0, 0.2);
        }

        .caption-result h2 {
          color: #4CAF50;
          font-size: 1.5em;
          margin-bottom: 10px;
        }

        .caption-text {
          font-size: 1.2em;
          font-weight: 500;
          color: #f0f8ff;
          line-height: 1.6;
        }

        /* استجابة للهواتف الصغيرة */
        @media (max-width: 600px) {
          .main-content {
            padding: 20px;
          }
          h1 {
            font-size: 2em;
          }
        }
      `}</style>
    </div>
  );
}
