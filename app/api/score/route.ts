// app/api/score/route.ts
import { NextResponse } from 'next/server';
import { v4 as uuidv4 } from 'uuid';

// データストアの型を定義
type ResultEntry = {
  score: number;
  drawing: string;
  characterId: string;
  createdAt: string;
};

// データストアをグローバル変数として宣言
declare global {
  var globalResults: Map<string, ResultEntry> | undefined;
}

// グローバルスコープで結果を管理
function getResultsStore(): Map<string, ResultEntry> {
  if (!global.globalResults) {
    global.globalResults = new Map();
  }
  return global.globalResults;
}

export async function POST(request: Request) {
  try {
    // クライアントから送信されたデータを取得
    const { drawing, characterId, score } = await request.json();
    
    // 結果を保存
    const resultId = uuidv4();
    const results = getResultsStore();
    results.set(resultId, {
      score,
      drawing,
      characterId,
      createdAt: new Date().toISOString()
    });
    
    return NextResponse.json({ score, resultId });
  } catch (error) {
    console.error('Error storing result:', error);
    return NextResponse.json(
      { error: 'Failed to store result' },
      { status: 500 }
    );
  }
}

// オプションで他のメソッドも追加可能
export async function GET() {
  const results = getResultsStore();
  return NextResponse.json(Array.from(results.entries()));
}