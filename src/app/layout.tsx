import type { Metadata } from 'next';
import './globals.css';
import Sidebar from '@/components/Sidebar';
import StatusBar from '@/components/StatusBar';

export const metadata: Metadata = {
  title: '光体文明 · 智能体',
  description: '以光为介质，以意识为结构——光体文明的宇宙模型、光体定义、升维理论与叙事主线',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="zh-CN">
      <body>
        <div className="flex min-h-screen">
          <Sidebar />
          <main className="flex-1 ml-0 md:ml-64 p-5 md:p-8 pb-14 min-h-screen">
            {children}
          </main>
        </div>
        <StatusBar />
      </body>
    </html>
  );
}
