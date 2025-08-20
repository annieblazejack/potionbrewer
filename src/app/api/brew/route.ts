import { NextRequest, NextResponse } from 'next/server';
import OpenAI from 'openai';

const openai = new OpenAI({
  apiKey: process.env.OPENROUTER_API_KEY,
  baseURL: process.env.OPENROUTER_API_BASE,
});

export async function POST(request: NextRequest) {
  try {
    const { ingredients } = await request.json();

    if (!ingredients || ingredients.length < 2) {
      return NextResponse.json(
        { error: 'At least 2 ingredients are required' },
        { status: 400 }
      );
    }

    const prompt = `Create a magical potion recipe using these ingredients: ${ingredients.join(
      ', '
    )}.

Please provide a response in the following JSON format:
{
  "name": "Potion Name",
  "ingredients": [
    "1 Dragon Scale (crushed)",
    "3 drops Phoenix Feather essence"
  ],
  "instructions": [
    "Heat cauldron to exactly 350°F",
    "Add ingredients in clockwise motion"
  ],
  "effects": [
    "Grants temporary flight for 1 hour",
    "Enhances magical resistance"
  ],
  "sideEffects": [
    "May cause slight dizziness",
    "Temporary blue glow around eyes"
  ],
  "warnings": [
    "Do not consume on empty stomach",
    "Keep away from direct sunlight"
  ]
}

Important!: Do NOT wrap the result in markdown. Just return the JSON itself with no
extra wrapper text.

Make it creative and fantastical!`;

    const completion = await openai.chat.completions.create({
      model: process.env.OPENROUTER_MODEL || 'openai/gpt-3.5-turbo',
      messages: [
        {
          role: 'system',
          content:
            'You are a master alchemist creating magical potion recipes. Always respond with valid JSON only.',
        },
        {
          role: 'user',
          content: prompt,
        },
      ],
      temperature: 0.8,
      max_tokens: 10000,
    });

    const recipe = completion.choices[0]?.message?.content;

    if (!recipe) {
      throw new Error('No recipe generated');
    }

    console.log({ recipe });

    // Try to parse as JSON, fallback to text if needed
    let parsedRecipe;
    try {
      parsedRecipe = JSON.parse(recipe);
    } catch {
      // If JSON parsing fails, create a structured response
      parsedRecipe = {
        name: 'Mystery Potion',
        ingredients: ingredients.map((ing) => `1 ${ing}`),
        instructions: [
          'Add ingredients to cauldron',
          'Stir counterclockwise',
          'Let simmer for 10 minutes',
        ],
        effects: ['Unknown magical effects'],
        sideEffects: ['Unpredictable results'],
        warnings: ['Use at your own risk'],
        rawResponse: recipe,
      };
    }

    return NextResponse.json(parsedRecipe);
  } catch (error) {
    console.error('Error generating potion:', error);
    return NextResponse.json(
      { error: 'Failed to brew potion. The cauldron seems to be broken!' },
      { status: 500 }
    );
  }
}
