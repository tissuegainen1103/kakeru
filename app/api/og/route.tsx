// app/api/og/route.tsx
import { ImageResponse } from 'next/og';

export const runtime = 'edge';

// Base64エンコードされたフォントデータ
// 注意: 実際のフォントファイルをBase64にエンコードした文字列に置き換えてください
const NOTO_SANS_JP_BOLD_BASE64 = `REPLACE_WITH_ACTUAL_BASE64_ENCODED_FONT_DATA`;

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const score = searchParams.get('score') || '??';
    const character = searchParams.get('character') || 'キャラクター';
    const drawingData = searchParams.get('drawing');
    
    // スコアに応じたメッセージとカラー
    let scoreMessage = 'もう少し練習しましょう';
    let scoreColor = '#6B7280'; // グレー
    
    const scoreNum = parseInt(score as string, 10);
    
    if (scoreNum >= 90) {
      scoreMessage = '素晴らしい！プロレベルです！';
      scoreColor = '#10B981'; // 緑
    } else if (scoreNum >= 70) {
      scoreMessage = 'とても上手です！';
      scoreColor = '#3B82F6'; // 青
    } else if (scoreNum >= 50) {
      scoreMessage = '良い感じです！';
      scoreColor = '#6366F1'; // インディゴ
    } else if (scoreNum >= 30) {
      scoreMessage = 'まあまあです。練習しましょう！';
      scoreColor = '#F59E0B'; // 琥珀色
    }
    
    // Base64エンコードされたフォントデータをArrayBufferに変換
    const fontData = Uint8Array.from(atob(NOTO_SANS_JP_BOLD_BASE64), c => c.charCodeAt(0)).buffer;
    
    // OGP画像の生成
    return new ImageResponse(
      (
        <div
          style={{
            display: 'flex',
            fontSize: 60,
            color: 'black',
            background: 'white',
            width: '100%',
            height: '100%',
            flexDirection: 'column',
            justifyContent: 'center',
            alignItems: 'center',
            position: 'relative',
            fontFamily: 'Noto Sans JP'
          }}
        >
          {/* ヘッダー */}
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              position: 'absolute',
              top: 40,
              left: 40,
              right: 40,
              height: 80,
              backgroundColor: '#4A90E2',
              color: 'white',
              borderRadius: 20,
              padding: '0 40px',
            }}
          >
            お絵描き採点サイト - 結果
          </div>
          
          {/* スコア表示 */}
          <div style={{ marginTop: 80, display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
            <div style={{ fontSize: 120, fontWeight: 'bold', marginBottom: 20, color: scoreColor }}>
              {score}点
            </div>
            <div style={{ fontSize: 40, marginBottom: 30, color: scoreColor }}>
              {scoreMessage}
            </div>
            <div style={{ fontSize: 40, marginBottom: 20 }}>
              お題: {character}
            </div>
            <div style={{ fontSize: 36, color: '#666', marginTop: 30 }}>
              あなたも挑戦してみよう！
            </div>
          </div>
          
          {/* フッター */}
          <div
            style={{
              position: 'absolute',
              bottom: 40,
              fontSize: 30,
              color: '#666',
            }}
          >
            お絵描き採点サイト
          </div>
        </div>
      ),
      { 
        width: 1200,
        height: 630,
        fonts: [
          {
            name: 'Noto Sans JP',
            data: fontData,
            style: 'normal',
            weight: 700
          }
        ]
      }
    );
  } catch (error) {
    console.error('Error generating OG image:', error);
    return new Response('Failed to generate image', { status: 500 });
  }
}