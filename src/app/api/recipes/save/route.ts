import { NextRequest } from 'next/server';
import { put } from '@vercel/blob';
import { v4 as uuidv4 } from 'uuid';

export async function POST(request: NextRequest) {
  try {
    const { recipe, ingredients } = await request.json();

    if (!recipe || !ingredients) {
      return new Response(
        JSON.stringify({ error: 'Recipe and ingredients are required' }),
        { 
          status: 400,
          headers: { 'Content-Type': 'application/json' }
        }
      );
    }

    // Generate a unique ID for the recipe
    const recipeId = uuidv4();
    
    // Create the recipe data to store
    const recipeData = {
      recipe,
      ingredients,
      createdAt: new Date().toISOString(),
      id: recipeId
    };

    // Store the recipe in Vercel Blob
    const blob = await put(`recipes/${recipeId}.json`, JSON.stringify(recipeData), {
      access: 'public',
      contentType: 'application/json',
    });

    return new Response(
      JSON.stringify({ 
        success: true, 
        recipeId,
        url: blob.url 
      }),
      { 
        status: 200,
        headers: { 'Content-Type': 'application/json' }
      }
    );
  } catch (error) {
    console.error('Error saving recipe:', error);
    return new Response(
      JSON.stringify({ error: 'Failed to save recipe' }),
      { 
        status: 500,
        headers: { 'Content-Type': 'application/json' }
      }
    );
  }
}
