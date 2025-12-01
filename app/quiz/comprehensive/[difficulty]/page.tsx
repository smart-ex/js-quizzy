import { ComprehensiveQuizClient } from '@/components/ComprehensiveQuizClient';

export function generateStaticParams() {
  return [
    { difficulty: 'easy' },
    { difficulty: 'medium' },
    { difficulty: 'hard' },
  ];
}

interface PageProps {
  params: Promise<{
    difficulty: string;
  }>;
}

export default async function ComprehensiveQuizPage({ params }: PageProps) {
  const { difficulty } = await params;
  
  // Difficulty validation is done client-side in ComprehensiveQuizClient
  // which checks if questions exist for the difficulty level
  
  return <ComprehensiveQuizClient difficulty={difficulty} />;
}

