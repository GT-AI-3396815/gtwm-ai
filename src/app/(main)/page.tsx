'use client';

import { Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import WorldviewSection from '@/components/WorldviewSection';
import GenerateSection from '@/components/GenerateSection';

function HomeContent() {
  const searchParams = useSearchParams();
  const section = searchParams.get('section') || 'worldview';

  const renderSection = () => {
    switch (section) {
      case 'generate':
        return <GenerateSection />;
      default:
        return <WorldviewSection />;
    }
  };

  return <>{renderSection()}</>;
}

export default function Home() {
  return (
    <Suspense fallback={<div className="text-center py-20 text-text-muted">加载中...</div>}>
      <HomeContent />
    </Suspense>
  );
}
