// app/result/[id]/page.js
import { notFound } from 'next/navigation';

// 結果データを取得するための関数
async function getResult(id) {
  // 本来はここでデータベースから結果を取得
  // この例では、api/score/route.jsで保存したMapから取得
  // 実際のプロジェクトではデータベースアクセスに置き換える
  
  try {
    // API経由で結果を取得
    const response = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000'}/api/result/${id}`, {
      cache: 'no-store' // SSRで毎回最新の結果を取得
    });
    
    if (!response.ok) {
      return null;
    }
    
    return await response.json();
  } catch (error) {
    console.error('Error fetching result:', error);
    return null;
  }
}

// メタデータ生成関数
export async function generateMetadata({ params }) {
  const { id } = params;
  
  try {
    const result = await getResult(id);
    
    if (!result) {
      return {
        title: 'お絵描き採点サイト - 結果が見つかりません',
        description: 'キャラクターを描いて採点しよう！',
      };
    }
    
    const ogUrl = `${process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000'}/api/og?score=${result.score}&character=${encodeURIComponent(result.characterName)}`;
    
    return {
      title: `お絵描きスコア: ${result.score}点 - お絵描き採点サイト`,
      description: `お題「${result.characterName}」を描いて${result.score}点を獲得しました！あなたも挑戦してみよう！`,
      openGraph: {
        images: [
          {
            url: ogUrl,
            width: 1200,
            height: 630,
          },
        ],
      },
      twitter: {
        card: 'summary_large_image',
        images: [ogUrl],
      },
    };
  } catch (error) {
    console.error('Error generating metadata:', error);
    return {
      title: 'お絵描き採点サイト',
      description: 'キャラクターを描いて採点しよう！',
    };
  }
}

export default async function ResultPage({ params }) {
  const { id } = params;
  
  const result = await getResult(id);
  
  if (!result) {
    notFound();
  }
  
  // キャラクター情報のマッピング
  const characterMap = {
    'character1': 'キャラクター1',
    'character2': 'キャラクター2',
    'character3': 'キャラクター3',
  };
  
  const characterName = characterMap[result.characterId] || '不明なキャラクター';
  
  return (
    <div className="container mx-auto px-4 py-8 max-w-3xl">
      <h1 className="text-3xl font-bold text-center mb-8">採点結果</h1>
      
      <div className="bg-white shadow-md rounded-lg p-6">
        <div className="text-center mb-6">
          <div className="text-6xl font-bold">{result.score}</div>
          <div className="text-xl">点</div>
        </div>
        
        <div className="mb-6">
          <h2 className="text-xl font-semibold mb-2">お題:</h2>
          <div className="flex justify-center">
            <img 
              src={`/characters/${result.characterId}.png`}
              alt={characterName}
              className="w-48 h-48 object-contain"
            />
          </div>
          <p className="text-center mt-2">{characterName}</p>
        </div>
        
        <div className="mb-6">
          <h2 className="text-xl font-semibold mb-2">あなたの絵:</h2>
          <div className="flex justify-center">
            <img 
              src={result.drawing}
              alt="あなたの描いた絵"
              className="w-64 h-64 object-contain border border-gray-300"
            />
          </div>
        </div>
        
        <div className="text-center">
          <a
            href="/"
            className="inline-block px-6 py-3 bg-blue-500 text-white rounded-md hover:bg-blue-600"
          >
            トップページに戻る
          </a>
        </div>
      </div>
    </div>
  );
}

