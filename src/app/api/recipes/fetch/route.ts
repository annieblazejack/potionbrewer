import { NextRequest } from 'next/server';
import { put } from '@vercel/blob';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const recipeId = searchParams.get('id');

    if (!recipeId) {
      return new Response(JSON.stringify({ error: 'Recipe ID is required' }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' },
      });
    }

    // Fetch the recipe from Vercel Blob
    const response = await fetch(
      `https://yr1wp2qme13y6gl4.public.blob.vercel-storage.com/recipes/${recipeId}.json`
    );

    if (!response.ok) {
      if (response.status === 404) {
        return new Response(JSON.stringify({ error: 'Recipe not found' }), {
          status: 404,
          headers: { 'Content-Type': 'application/json' },
        });
      }
      throw new Error(`Failed to fetch recipe: ${response.statusText}`);
    }

    const recipeData = await response.json();

    return new Response(
      JSON.stringify({
        success: true,
        recipe: recipeData.recipe,
        ingredients: recipeData.ingredients,
        createdAt: recipeData.createdAt,
        id: recipeData.id,
      }),
      {
        status: 200,
        headers: { 'Content-Type': 'application/json' },
      }
    );
  } catch (error) {
    console.error('Error fetching recipe:', error);
    return new Response(JSON.stringify({ error: 'Failed to fetch recipe' }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    });
  }
}
