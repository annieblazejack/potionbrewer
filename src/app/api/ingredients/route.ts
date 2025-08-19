import { NextResponse } from 'next/server';
import { loadIngredients, loadIngredientsDetailed } from '@/lib/ingredients';

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const detailed = searchParams.get('detailed') === 'true';
    
    if (detailed) {
      const categories = loadIngredientsDetailed();
      return NextResponse.json({ categories });
    } else {
      const ingredients = loadIngredients();
      return NextResponse.json({ ingredients });
    }
  } catch (error) {
    console.error('Error loading ingredients:', error);
    return NextResponse.json(
      { error: 'Failed to load ingredients' },
      { status: 500 }
    );
  }
}