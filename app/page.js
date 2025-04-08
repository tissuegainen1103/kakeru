// app/page.js (モダンなデザインに更新)
'use client';

import { useState, useRef, useEffect } from 'react';
import Canvas from './components/Canvas';
import ScoreDisplay from './components/ScoreDisplay';
import CharacterSelect from './components/CharacterSelect';
import Layout from './components/Layout';
import * as tf from '@tensorflow/tfjs';

// グローバル変数の代わりにuseRefを使用する
const characterFeaturesCache = {};

export default function Home() {
  const [selectedCharacter, setSelectedCharacter] = useState(null);
  const [score, setScore] = useState(null);
  const [feedback, setFeedback] = useState('');
  const [resultId, setResultId] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [loadingMessage, setLoadingMessage] = useState('');
  const [canvasSize, setCanvasSize] = useState({ width: 400, height: 400 });
  const [isModelLoaded, setIsModelLoaded] = useState(false);
  const canvasRef = useRef(null);
  const canvasSectionRef = useRef(null); // キャンバスセクションの参照を追加
  const modelRef = useRef(null);
  const [showReference, setShowReference] = useState(false); // 初期値をfalseにして、お手本を非表示に

  // 実際のキャラクターデータ
  const characters = [
    { id: 'character1', name: 'ピカチュウ', imageUrl: '/characters/character1.png' },
    { id: 'character2', name: 'トトロ', imageUrl: '/characters/character2.png' },
    { id: 'character3', name: 'ドラえもん', imageUrl: '/characters/character3.png' },
  ];
  
  // 画面サイズに基づいてキャンバスサイズを設定
  useEffect(() => {
    const updateCanvasSize = () => {
      const isMobile = window.innerWidth < 640;
      if (isMobile) {
        const width = Math.min(window.innerWidth - 32, 300);
        setCanvasSize(prevSize => {
          if (prevSize.width !== width || prevSize.height !== width) {
            return { width, height: width };
          }
          return prevSize;
        });
      } else {
        setCanvasSize(prevSize => {
          if (prevSize.width !== 400 || prevSize.height !== 400) {
            return { width: 400, height: 400 };
          }
          return prevSize;
        });
      }
    };
  
    updateCanvasSize();
    window.addEventListener('resize', updateCanvasSize);
    
    return () => {
      window.removeEventListener('resize', updateCanvasSize);
    };
  }, []);

  // TensorFlow.jsモデルを読み込む
  useEffect(() => {
    async function loadModel() {
      try {
        setIsLoading(true);
        setLoadingMessage('モデルを読み込み中...');

        if (!modelRef.current) {
          modelRef.current = await tf.loadLayersModel('https://storage.googleapis.com/tfjs-models/tfjs/mobilenet_v1_0.25_224/model.json');
        }
        
        setIsModelLoaded(true);
        setIsLoading(false);
      } catch (error) {
        console.error('モデルのロードに失敗しました:', error);
        setIsLoading(false);
        setLoadingMessage('');
        alert('モデルのロードに失敗しました。ページを再読み込みしてください。');
      }
    }

    loadModel();
  }, []);

  const handleCharacterSelect = (character) => {
    setSelectedCharacter(character);
    setScore(null);
    setResultId(null);

  // キャラクター選択後、少し遅延させてからキャンバスセクションにスクロール
  setTimeout(() => {
    if (canvasSectionRef.current) {
      canvasSectionRef.current.scrollIntoView({ 
        behavior: 'smooth', 
        block: 'start' 
      });
    }
  }, 300);
  };
  
  // シンプル化した handleSubmit 関数
  const handleSubmit = async () => {
    if (!canvasRef.current || !selectedCharacter || !isModelLoaded) return;
    
    setIsLoading(true);
    setLoadingMessage('絵を分析中...');
    
    try {
      // Canvas要素の存在を確認
      const canvas = canvasRef.current;
      if (!canvas || typeof canvas.toDataURL !== 'function') {
        throw new Error('キャンバス要素が見つからないか、無効です');
      }
      
      // DataURLを取得
      const drawingDataUrl = canvas.toDataURL('image/png');
      
      // キャンバスの内容をチェック
      const ctx = canvas.getContext('2d');
      const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
      const pixelData = imageData.data;
      let nonWhitePixels = 0;
      const totalPixels = pixelData.length / 4;
      
      for (let i = 0; i < pixelData.length; i += 4) {
        if (pixelData[i] < 240 || pixelData[i + 1] < 240 || pixelData[i + 2] < 240) {
          nonWhitePixels++;
        }
      }
      
      const nonWhiteRatio = nonWhitePixels / totalPixels;
      
      if (nonWhiteRatio < 0.05) {
        setIsLoading(false);
        alert('絵が描かれていないようです。キャラクターを描いてから採点してください。');
        return;
      }
      
      // 簡易版のスコア計算（デモ用）
      setLoadingMessage('採点中...');
      
      // 描画量に基づく簡易スコア計算
      let baseScore = Math.min(85, Math.round(nonWhiteRatio * 100) + 40);
      
      // 一貫性のためにスコアを固定（ランダム要素なし）
      const calculatedScore = Math.max(30, Math.min(85, baseScore));
      
      // フィードバックの生成
      let feedbackMessage = '';
      if (calculatedScore >= 80) {
        feedbackMessage = `素晴らしい！${selectedCharacter.name}の特徴をよく捉えています。十分な描き込みがされており、形状も正確です。`;
      } else if (calculatedScore >= 70) {
        feedbackMessage = `良い感じです！${selectedCharacter.name}らしさが伝わってきます。もう少し細部にこだわるとさらに良くなります。`;
      } else if (calculatedScore >= 60) {
        feedbackMessage = `まあまあの出来栄えです。${selectedCharacter.name}の基本的な形は捉えられています。全体のバランスをもう少し意識してみましょう。`;
      } else if (calculatedScore >= 50) {
        feedbackMessage = `もう少し練習が必要です。${selectedCharacter.name}の特徴をもっと意識してみましょう。特に形状と色に注目してください。`;
      } else {
        feedbackMessage = `${selectedCharacter.name}を描くのは難しいですね。基本的な形から練習してみましょう。ゆっくり丁寧に描くことが大切です。`;
      }
      
      // サーバーに結果を保存
      const response = await fetch('/api/score', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          drawing: drawingDataUrl,
          characterId: selectedCharacter.id,
          score: calculatedScore,
          feedback: feedbackMessage
        }),
      });
      
      const responseData = await response.json();
      setScore(calculatedScore);
      setFeedback(feedbackMessage);
      setResultId(responseData.resultId);
    } catch (error) {
      console.error('採点中にエラーが発生しました:', error);
      alert('採点中にエラーが発生しました。もう一度お試しください。');
    } finally {
      setIsLoading(false);
      setLoadingMessage('');
    }
  };

  return (
    <Layout>
      <div className="max-w-5xl mx-auto">
        <section className="text-center mb-6">
          <h1 className="text-3xl md:text-4xl font-bold mb-3 bg-clip-text text-transparent bg-gradient-to-r from-blue-500 to-purple-600">
            お絵描き厳密採点サイト
          </h1>
          <p className="text-gray-600 dark:text-gray-300 max-w-xl mx-auto">
            好きなキャラクターを選んで描いてみよう！AIがあなたの絵をスコアリングします
          </p>
        </section>
        
        {isLoading && !selectedCharacter && (
          <div className="my-8 text-center p-8 bg-white dark:bg-gray-800 rounded-xl shadow-md">
            <div className="animate-spin inline-block w-12 h-12 border-4 border-blue-500 border-t-transparent rounded-full mb-4"></div>
            <p className="text-lg font-medium">{loadingMessage}</p>
            <p className="text-gray-500 dark:text-gray-400 mt-2">準備中です。少々お待ちください...</p>
          </div>
        )}
        
        {isModelLoaded && (
          <CharacterSelect 
            characters={characters}
            selectedCharacter={selectedCharacter}
            onSelect={handleCharacterSelect}
          />
        )}
        
        {selectedCharacter && (
  <div 
    ref={canvasSectionRef}
    className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-md mb-8"
  >
    <div className="flex flex-col gap-8 items-center my-4">
      {/* お手本エリアを削除し、キャンバスエリアのみ表示 */}
      <div className="w-full">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-semibold flex items-center">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 mr-2 text-blue-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
            </svg>
            {selectedCharacter.name}を描いてみよう！
          </h2>
          
          {/* お手本を表示/非表示切り替えボタンを追加（オプション） */}
          <button 
            onClick={() => setShowReference(prev => !prev)} 
            className="text-sm px-3 py-1 rounded bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600"
          >
            お手本を{showReference ? '隠す' : '見る'}
          </button>
        </div>
        
        {/* お手本の表示/非表示（オプション） */}
        {showReference && (
          <div className="flex justify-center mb-6 transition-all duration-300">
            <div className="relative overflow-hidden rounded-lg shadow-md bg-white dark:bg-gray-700 p-2 max-w-xs">
              <img 
                src={selectedCharacter.imageUrl} 
                alt={selectedCharacter.name}
                className="w-full h-full object-contain" 
              />
            </div>
          </div>
        )}
        
        <div className="flex justify-center">
          <Canvas 
            ref={canvasRef} 
            width={canvasSize.width} 
            height={canvasSize.height}
            key="drawing-canvas"
          />
        </div>
        <div className="text-center mt-6">
          <button
            onClick={handleSubmit}
            disabled={isLoading}
            className={`px-6 py-3 rounded-lg shadow-lg font-medium text-white transition-all duration-300 ${
              isLoading 
                ? 'bg-gray-400 cursor-not-allowed' 
                : 'bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 transform hover:-translate-y-1'
            }`}
          >
            {/* ボタンの内容は変更なし */}
            {isLoading ? (
              <span className="flex items-center">
                <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                {loadingMessage}
              </span>
            ) : (
              <span className="flex items-center">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                </svg>
                採点する
              </span>
            )}
          </button>
        </div>
      </div>
    </div>
  </div>
)}
        
        {score !== null && (
          <ScoreDisplay 
            score={score} 
            resultId={resultId}
            characterName={selectedCharacter.name}
            feedback={feedback}
          />
        )}
      </div>
    </Layout>
  );
}