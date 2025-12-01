import { CategoryQuizClient } from '@/components/CategoryQuizClient';
import { getCategoriesForStaticGeneration } from '@/lib/getCategoriesStatic';

export function generateStaticParams() {
  const categories = getCategoriesForStaticGeneration();
  return categories.map(category => ({
    category,
  }));
}

interface PageProps {
  params: Promise<{
    category: string;
  }>;
}

export default async function CategoryQuizPage({ params }: PageProps) {
  const { category } = await params;
  
  // Category validation is now done client-side in CategoryQuizClient
  // which checks if questions exist for the category
  
  return <CategoryQuizClient category={category} />;
}
