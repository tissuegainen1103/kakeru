
// app/components/Canvas.jsx - モダンなキャンバスコンポーネント
'use client';

import { forwardRef, useEffect, useImperativeHandle, useRef, useState } from 'react';

const Canvas = forwardRef(({ width = 400, height = 400 }, ref) => {
  const canvasRef = useRef(null);
  const [isDrawing, setIsDrawing] = useState(false);
  const [ctx, setCtx] = useState(null);
  const [lastPoint, setLastPoint] = useState(null);
  const [brushSize, setBrushSize] = useState(5);
  const [brushColor, setBrushColor] = useState('#000000');
  const [isEraser, setIsEraser] = useState(false);

  // 一般的な色のプリセット
  const colorPresets = [
    '#000000', // 黒
    '#FFFFFF', // 白
    '#FF0000', // 赤
    '#00FF00', // 緑
    '#0000FF', // 青
    '#FFFF00', // 黄色
    '#FF00FF', // マゼンタ
    '#00FFFF', // シアン
    '#FFA500', // オレンジ
    '#800080', // 紫
    '#A52A2A', // 茶色
    '#808080', // グレー
  ];

  // 重要: useImperativeHandle を使用して、DOM要素自体を直接返す
  useImperativeHandle(ref, () => canvasRef.current);

  // キャンバスの初期化
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const context = canvas.getContext('2d');
    // 最初に背景を白で塗りつぶす
    context.fillStyle = 'white';
    context.fillRect(0, 0, width, height);
    setCtx(context);

    // モバイルデバイスでのピンチズーム防止
    document.body.addEventListener('touchstart', preventZoom, { passive: false });
    document.body.addEventListener('touchmove', preventZoom, { passive: false });

    return () => {
      document.body.removeEventListener('touchstart', preventZoom);
      document.body.removeEventListener('touchmove', preventZoom);
    };
  }, []); // 依存配列が空 - 初期化時のみ実行

  // ブラシ設定の変更時に実行
  useEffect(() => {
    if (ctx) {
      ctx.lineWidth = brushSize;
      ctx.lineCap = 'round';
      ctx.lineJoin = 'round';
      ctx.strokeStyle = isEraser ? 'white' : brushColor;
      ctx.globalCompositeOperation = isEraser ? 'destination-out' : 'source-over';
    }
  }, [brushSize, brushColor, isEraser, ctx]); // ブラシ設定が変更されたときのみ実行

  // ピンチズームを防止する関数
  const preventZoom = (e) => {
    if (e.touches && e.touches.length > 1) {
      e.preventDefault();
    }
  };

  const startDrawing = (e) => {
    e.preventDefault(); // デフォルトの動作を防止
    if (!ctx) return;
    
    const { offsetX, offsetY } = getCoordinates(e);
    ctx.beginPath();
    ctx.moveTo(offsetX, offsetY);
    setIsDrawing(true);
    setLastPoint({ x: offsetX, y: offsetY });
  };

  const draw = (e) => {
    if (!isDrawing || !ctx) return;
    e.preventDefault(); // デフォルトの動作を防止
    
    const { offsetX, offsetY } = getCoordinates(e);
    
    // 中間点を補間して滑らかな線を描画（特にモバイルで重要）
    if (lastPoint) {
      ctx.beginPath();
      ctx.moveTo(lastPoint.x, lastPoint.y);
      ctx.lineTo(offsetX, offsetY);
      ctx.stroke();
      setLastPoint({ x: offsetX, y: offsetY });
    }
  };

  const stopDrawing = (e) => {
    if (e) e.preventDefault(); // デフォルトの動作を防止
    if (isDrawing && ctx) {
      ctx.closePath();
      setIsDrawing(false);
      setLastPoint(null);
    }
  };

  // 通常のマウスイベントとタッチイベントの両方に対応
  const getCoordinates = (e) => {
    if (!canvasRef.current) return { offsetX: 0, offsetY: 0 };
    
    if (e.touches && e.touches[0]) {
      const rect = canvasRef.current.getBoundingClientRect();
      return {
        offsetX: e.touches[0].clientX - rect.left,
        offsetY: e.touches[0].clientY - rect.top
      };
    }
    return { offsetX: e.nativeEvent.offsetX, offsetY: e.nativeEvent.offsetY };
  };

  const clearCanvas = () => {
    if (ctx) {
      ctx.fillStyle = 'white';
      ctx.fillRect(0, 0, width, height);
      ctx.strokeStyle = isEraser ? 'white' : brushColor;
    }
  };

  const toggleEraser = () => {
    setIsEraser(!isEraser);
  };

  return (
    <div className="flex flex-col items-center w-full">
      <div className="drawing-tools mb-4 p-4 bg-white dark:bg-gray-800 rounded-lg shadow-md w-full">
        <div className="flex flex-wrap justify-center gap-4 mb-4">
          {/* ブラシ/消しゴム切り替え */}
          <div className="flex rounded-md overflow-hidden">
            <button
              onClick={() => setIsEraser(false)}
              className={`px-3 py-2 ${!isEraser ? 'bg-blue-500 text-white' : 'bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300'}`}
              title="ブラシ"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                <path d="M13.586 3.586a2 2 0 112.828 2.828l-.793.793-2.828-2.828.793-.793zM11.379 5.793L3 14.172V17h2.828l8.38-8.379-2.83-2.828z" />
              </svg>
            </button>
            <button
              onClick={() => setIsEraser(true)}
              className={`px-3 py-2 ${isEraser ? 'bg-blue-500 text-white' : 'bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300'}`}
              title="消しゴム"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-3.293 3.293 3.293 3.293a1 1 0 01-1.414 1.414L10 13.414l-3.293 3.293a1 1 0 01-1.414-1.414l3.293-3.293-3.293-3.293a1 1 0 010-1.414z" clipRule="evenodd" />
              </svg>
            </button>
          </div>
          
          {/* ブラシサイズ選択 */}
          <div className="flex-grow max-w-xs">
            <label htmlFor="brush-size" className="text-sm block mb-1 text-gray-700 dark:text-gray-300">
              ブラシサイズ: {brushSize}px
            </label>
            <input
              id="brush-size"
              type="range"
              min="1"
              max="30"
              value={brushSize}
              onChange={(e) => setBrushSize(parseInt(e.target.value))}
              className="w-full h-2 bg-gray-200 dark:bg-gray-700 rounded-lg appearance-none cursor-pointer"
            />
          </div>
          
          {/* カラーピッカー */}
          <div>
            <label htmlFor="brush-color" className="text-sm block mb-1 text-gray-700 dark:text-gray-300">
              色を選択
            </label>
            <input
              id="brush-color"
              type="color"
              value={brushColor}
              onChange={(e) => setBrushColor(e.target.value)}
              className="w-10 h-10 rounded cursor-pointer"
              disabled={isEraser}
            />
          </div>
          
          {/* キャンバスクリアボタン */}
          <div className="self-end">
            <button
              onClick={clearCanvas}
              className="px-4 py-2 bg-red-500 text-white rounded-md hover:bg-red-600 transition-colors duration-200 flex items-center"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-1" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v6a1 1 0 102 0V8a1 1 0 00-1-1z" clipRule="evenodd" />
              </svg>
              クリア
            </button>
          </div>
        </div>
        
        {/* カラープリセット */}
        <div className="flex flex-wrap justify-center gap-2 mt-2">
          {colorPresets.map((color, index) => (
            <button
              key={index}
              onClick={() => setBrushColor(color)}
              className={`w-6 h-6 rounded-full ${brushColor === color ? 'ring-2 ring-offset-2 ring-blue-500' : ''}`}
              style={{ 
                backgroundColor: color,
                border: color === '#FFFFFF' ? '1px solid #e5e7eb' : 'none'
              }}
              disabled={isEraser}
              title={`色: ${color}`}
            />
          ))}
        </div>
      </div>
      
      <div 
        className="canvas-container relative touch-none rounded-lg shadow-lg overflow-hidden"
        style={{ width, height }}
      >
        <canvas
          ref={canvasRef}
          width={width}
          height={height}
          className="touch-none absolute top-0 left-0"
          onMouseDown={startDrawing}
          onMouseMove={draw}
          onMouseUp={stopDrawing}
          onMouseLeave={stopDrawing}
          onTouchStart={startDrawing}
          onTouchMove={draw}
          onTouchEnd={stopDrawing}
          onTouchCancel={stopDrawing}
        />
      </div>
    </div>
  );
});

Canvas.displayName = 'Canvas';
export default Canvas;