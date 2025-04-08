// app/components/ScoreDisplay.jsx - モダンなスコア表示コンポーネント
'use client';
'use client';

export default function ScoreDisplay({ score, resultId, characterName, feedback }) {
  const resultUrl = `${window.location.origin}/result/${resultId}`;

  function getScoreColor(score) {
    if (score >= 80) return 'text-green-600 dark:text-green-500';
    if (score >= 70) return 'text-amber-600 dark:text-amber-500';
    if (score >= 60) return 'text-amber-700 dark:text-amber-400';
    if (score >= 50) return 'text-orange-600 dark:text-orange-400';
    return 'text-red-600 dark:text-red-400';
  }
  
  function getGradeLabel(score) {
    if (score >= 90) return { label: 'S', color: 'bg-gradient-to-r from-amber-500 to-yellow-600 dark:from-amber-600 dark:to-yellow-500' };
    if (score >= 80) return { label: 'A', color: 'bg-gradient-to-r from-green-600 to-emerald-700 dark:from-green-700 dark:to-emerald-600' };
    if (score >= 70) return { label: 'B', color: 'bg-gradient-to-r from-amber-600 to-amber-700 dark:from-amber-700 dark:to-amber-600' };
    if (score >= 60) return { label: 'C', color: 'bg-gradient-to-r from-amber-700 to-orange-700 dark:from-amber-600 dark:to-orange-600' };
    if (score >= 50) return { label: 'D', color: 'bg-gradient-to-r from-orange-600 to-red-600 dark:from-orange-600 dark:to-red-500' };
    return { label: 'E', color: 'bg-gradient-to-r from-red-600 to-red-700 dark:from-red-600 dark:to-red-500' };
  }
  
  function getScoreText(score) {
    if (score >= 80) return '素晴らしい評価です。';
    if (score >= 70) return 'とても上手に描けています。';
    if (score >= 60) return '良い感じです。';
    if (score >= 50) return 'まあまあの出来栄えです。';
    return 'もう少し練習が必要です。';
  }
  
  const grade = getGradeLabel(score);
  const scoreColor = getScoreColor(score);
  const scoreText = getScoreText(score);

  return (
    <div className="w-full max-w-2xl mx-auto mt-10 overflow-visible rounded-lg shadow-md dark:shadow-gray-800 transition-all duration-300">
      <div className="relative bg-amber-50 dark:bg-gray-800 pt-12 pb-8 px-6 rounded-t-lg z-10 overflow-visible">
        <div className="absolute -top-8 left-1/2 transform -translate-x-1/2 z-20">
          <div className="relative">
            <div className={`w-16 h-16 rounded-full flex items-center justify-center text-white text-2xl font-bold shadow-md ${grade.color}`}>
              {grade.label}
            </div>
          </div>
        </div>
        
        <div className="text-center">
          <h2 className="text-2xl font-bold mb-2 text-amber-900 dark:text-amber-200">採点結果</h2>
          <p className="text-amber-700 dark:text-amber-400 mb-6 text-sm">「{characterName}」の評価</p>
          
          <div className="flex justify-center items-baseline mb-4">
            <div className={`text-6xl font-bold ${scoreColor}`}>{score}</div>
            <div className="text-xl ml-2 mb-1 text-gray-600 dark:text-gray-400">点</div>
          </div>
          
          <p className="text-base font-medium mb-3 text-amber-800 dark:text-amber-300 px-4 py-2 rounded-md bg-amber-100/50 dark:bg-amber-900/30 inline-block">
            {scoreText}
          </p>
        </div>
      </div>
      
      {/* フィードバック部分 */}
      {feedback && (
        <div className="p-6 border-t border-amber-200 dark:border-gray-700 bg-white dark:bg-gray-900">
          <h3 className="text-base font-semibold mb-3 flex items-center text-amber-700 dark:text-amber-400">
            <div className="p-1 bg-amber-100 dark:bg-amber-900/50 rounded-md mr-2">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-amber-600 dark:text-amber-500" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
              </svg>
            </div>
            フィードバック
          </h3>
          <p className="text-gray-700 dark:text-gray-300 bg-amber-50 dark:bg-gray-800 p-4 rounded-md border border-amber-100 dark:border-gray-700">
            {feedback}
          </p>
        </div>
      )}
      
      {/* 共有ボタン */}
      <div className="p-6 bg-white dark:bg-gray-900 border-t border-amber-200 dark:border-gray-700 rounded-b-lg">
        <p className="text-center text-sm font-medium text-amber-700 dark:text-amber-400 mb-4">結果をシェアする</p>
        <div className="flex flex-wrap justify-center gap-3">
          <button 
            onClick={() => {
              navigator.clipboard.writeText(resultUrl);
              alert('URLをコピーしました！');
            }}
            className="flex items-center px-4 py-2 bg-amber-100 text-amber-800 dark:bg-amber-900/40 dark:text-amber-300 rounded-md hover:bg-amber-200 dark:hover:bg-amber-900/60 transition-colors duration-200"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" viewBox="0 0 20 20" fill="currentColor">
              <path d="M8 3a1 1 0 011-1h2a1 1 0 110 2H9a1 1 0 01-1-1z" />
              <path d="M6 3a2 2 0 00-2 2v11a2 2 0 002 2h8a2 2 0 002-2V5a2 2 0 00-2-2 3 3 0 01-3 3H9a3 3 0 01-3-3z" />
            </svg>
            URLをコピー
          </button>
          
          <a
            href={`https://twitter.com/intent/tweet?text=お絵描き採点サイトで${score}点を獲得しました！&url=${encodeURIComponent(resultUrl)}`}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 transition-colors duration-200"
          >
            <svg className="h-5 w-5 mr-2" fill="currentColor" viewBox="0 0 24 24">
              <path d="M23.953 4.57a10 10 0 01-2.825.775 4.958 4.958 0 002.163-2.723c-.951.555-2.005.959-3.127 1.184a4.92 4.92 0 00-8.384 4.482C7.69 8.095 4.067 6.13 1.64 3.162a4.822 4.822 0 00-.666 2.475c0 1.71.87 3.213 2.188 4.096a4.904 4.904 0 01-2.228-.616v.06a4.923 4.923 0 003.946 4.827 4.996 4.996 0 01-2.212.085 4.936 4.936 0 004.604 3.417 9.867 9.867 0 01-6.102 2.105c-.39 0-.779-.023-1.17-.067a13.995 13.995 0 007.557 2.209c9.053 0 13.998-7.496 13.998-13.985 0-.21 0-.42-.015-.63A9.935 9.935 0 0024 4.59z" />
            </svg>
            Twitterでシェア
          </a>
        </div>
      </div>
    </div>
  );
}