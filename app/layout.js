// app/layout.js
import './globals.css';

export const metadata = {
  title: 'お絵描き採点サイト',
  description: 'キャラクターを描いて採点しよう！',
  viewport: {
    width: 'device-width',
    initialScale: 1,
    maximumScale: 1, // ピンチズームを防止
    userScalable: 'no' // ユーザーによるスケールを無効化
  }
};

export default function RootLayout({ children }) {
  return (
    <html lang="ja">
      <head>
        <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no" />
      </head>
      <body>
        {children}
      </body>
    </html>
  );
}