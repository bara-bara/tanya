// pages/index.js

import Head from 'next/head';
import { useState, useCallback } from 'react';

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
        body: JSON.stringify({ promptText: inputText }),
      });

      const data = await apiResponse.json();

      if (apiResponse.ok) {
        setCaption(data.caption);
      } else {
        // التعامل مع الأخطاء التي تأتي من الخادم (باستخدام user_message بالروسية)
        const errorMessage = data.user_message || 'Произошла ошибка на сервере.'; 
        setCaption(`Ошибка: ${errorMessage}`);
      }

    } catch (error) {
      console.error('Fetch Error:', error);
      // رسالة خطأ الشبكة بالروسية
      setCaption('Ошибка сети. Пожалуйста, проверьте ваше соединение.'); 
    } finally {
      setIsLoading(false);
    }
  }, [inputText]);

  return (
    <div className="container">
      <Head>
        {/* العناوين والميتا تاج باللغة الروسية */}
        <title>Генератор Неотразимых Туристических Текстов | Gemini AI</title>
        <meta name="description" content="Генератор суперпривлекательных туристических текстов (Captions) с использованием Gemini AI." />
      </Head>

      <main className="main-content">
        {/* العناوين الرئيسية بالروسية */}
        <h1>Создание Неотразимых Туристических Текстов 🌍✨</h1>
        <p>Введите вашу идею или краткое описание, и пусть ИИ превратит его в неотразимый призыв для туристов!</p>

        <form onSubmit={generateCaption} className="form-area">
          <textarea
            value={inputText}
            onChange={(e) => setInputText(e.target.value)}
            placeholder="Пример: Тихий закат на белом пляже" 
            rows="4"
            disabled={isLoading}
          />
          <button type="submit" disabled={isLoading || !inputText.trim()}>
            {isLoading ? 'Генерируется...' : 'Создать мощный текст!'}
          </button>
        </form>

        {caption && (
          <div className="caption-result">
            <h2>Ваш Привлекательный Текст:</h2> 
            <p className="caption-text">{caption}</p>
          </div>
        )}
      </main>

      <style jsx global>{`
        /* إعادة تعيين بسيطة وتطبيق الخطوط */
        body {
          margin: 0;
          padding: 0;
          font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell, 'Fira Sans', 'Droid Sans', 'Helvetica Neue', sans-serif;
          
          /* تدرج الغروب الدافئ (Warm Sunset Gradient) */
          background: #cc2b5e;  
          background: linear-gradient(to right, #753a88, #cc2b5e); 
          
          color: #f0f8ff; 
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

        /* تعديل لون الزر والعنوان ليناسب الأجواء الدافئة */
        h1 {
          color: #ffcc00; /* لون ذهبي/أصفر لامع */
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
          border: 1px solid #ffcc00;
          background: rgba(0, 0, 0, 0.4);
          color: #f0f8ff;
          resize: vertical;
          font-size: 1em;
          box-sizing: border-box;
        }
        
        textarea:focus {
            outline: 2px solid #ffcc00;
            border-color: #ffcc00;
        }

        button {
          padding: 15px 25px;
          border: none;
          border-radius: 8px;
          background-color: #ffcc00; /* لون الزر الأساسي (ذهبي) */
          color: #333; /* نص داكن على الزر الفاتح */
          font-size: 1.1em;
          cursor: pointer;
          transition: background-color 0.3s ease, transform 0.1s ease;
          font-weight: bold;
        }

        button:hover:not(:disabled) {
          background-color: #e6b800;
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
          border: 2px dashed #ffcc00; /* حدود ذهبية متناسقة */
          border-radius: 10px;
          background: rgba(0, 0, 0, 0.2);
        }

        .caption-result h2 {
          color: #ffcc00;
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
