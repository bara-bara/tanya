// pages/index.js

import Head from 'next/head';
import { useState, useCallback } from 'react';

export default function Home() {
  const [inputText, setInputText] = useState('');
  const [caption, setCaption] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  // حالة جديدة لزر النسخ
  const [copyStatus, setCopyStatus] = useState('Скопировать');

  // دالة لمعالجة إرسال النص واستدعاء API Route
  const generateCaption = useCallback(async (e) => {
    e.preventDefault();
    if (!inputText.trim()) return;

    setIsLoading(true);
    setCaption('');
    setCopyStatus('Скопировать'); // إعادة تعيين حالة النسخ

    try {
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
        const errorMessage = data.user_message || 'Произошла ошибка на сервере.'; 
        setCaption(`Ошибка: ${errorMessage}`);
      }

    } catch (error) {
      console.error('Fetch Error:', error);
      setCaption('Ошибка сети. Пожалуйста, проверьте ваше соединение.'); 
    } finally {
      setIsLoading(false);
    }
  }, [inputText]);
  
  // دالة نسخ النص إلى الحافظة
  const copyToClipboard = useCallback(() => {
    if (caption) {
      navigator.clipboard.writeText(caption)
        .then(() => {
          setCopyStatus('Скопировано! ✅');
          setTimeout(() => setCopyStatus('Скопировать'), 2000); // تعيين حالة النسخ مرة أخرى بعد ثانيتين
        })
        .catch(err => {
          console.error('Could not copy text: ', err);
          setCopyStatus('Ошибка копирования ❌');
        });
    }
  }, [caption]);

  return (
    <div className="container">
      <Head>
        <title>Генератор Неотразимых Туристических Текстов | Gemini AI</title>
        <meta name="description" content="Генератор суперпривлекательных туристических текстов (Captions) с использованием Gemini AI." />
      </Head>

      <main className="main-content">
        <h1>Приветствую тебя, принцесса мира и принцесса России 🌍✨</h1>
        <p>>Напиши любую идею... и позволь своему другу Имрану превратить это в рекламу, которая заставит тебя захотеть путешествовать даже на автозаправочную станцию</p>

        <form onSubmit={generateCaption} className="form-area">
          <textarea
            value={inputText}
            onChange={(e) => setInputText(e.target.value)}
            placeholder="Напиши сюда" 
            rows="4"
            disabled={isLoading}
          />
          <button type="submit" disabled={isLoading || !inputText.trim()}>
            {/* عرض رمز التحميل بدلاً من النص عند التحميل */}
            {isLoading ? <div className="spinner"></div> : 'Создать мощный текст!'}
          </button>
        </form>

        {caption && (
          <div className="caption-result">
            <h2>Ваш Привлекательный Текст:</h2> 
            <p className="caption-text">{caption}</p>
            {/* زر النسخ الجديد */}
            <button 
              onClick={copyToClipboard} 
              className="copy-button"
              disabled={!caption}
            >
              {copyStatus}
            </button>
          </div>
        )}
      </main>

      <style jsx global>{`
        /* ... كود التصميم الأساسي (الخلفية، الألوان، الخطوط) كما هو ... */
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

        h1 {
          color: #ffcc00; /* لون ذهبي/أصفر لامع */
          margin-bottom: 10px;
          font-size: 2.5em;
        }

        p {
          opacity: 0.8;
          margin-bottom: 30px;
        }

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
          display: flex; /* لتوسيط Spinner */
          justify-content: center;
          align-items: center;
        }

        button:hover:not(:disabled) {
          background-color: #e6b800;
          transform: translateY(-2px);
        }

        button:disabled {
          background-color: #aaa;
          cursor: not-allowed;
        }

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
          margin-bottom: 15px; /* مسافة قبل زر النسخ */
        }

        /* تنسيق زر النسخ */
        .copy-button {
            background-color: #00a8e8; /* لون أزرق لزر النسخ لتمييزه */
            color: white;
            width: 50%; /* عرض مناسب لزر النسخ */
            margin: 10px auto 0; /* توسيطه أسفل النص */
        }

        .copy-button:hover:not(:disabled) {
          background-color: #0096cc;
          transform: translateY(-2px);
        }


        /* >>>>>> تنسيق رمز التحميل (Spinner) <<<<<< */
        .spinner {
          border: 4px solid rgba(255, 255, 255, 0.3);
          border-top: 4px solid #fff; /* لون الذهبي للخلفية */
          border-radius: 50%;
          width: 20px;
          height: 20px;
          animation: spin 1s linear infinite;
        }

        @keyframes spin {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
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
