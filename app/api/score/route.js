// app/api/score/route.js (ブラウザベース版)
import { NextResponse } from 'next/server';
import { v4 as uuidv4 } from 'uuid';

// データストア
export const results = new Map();

export async function POST(request) {
  try {
    // クライアントから送信されたデータを取得
    const { drawing, characterId, score } = await request.json();
    
    // 結果を保存
    const resultId = uuidv4();
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