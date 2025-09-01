import { NextRequest } from 'next/server';
import OpenAI from 'openai';

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export async function POST(request: NextRequest) {
  try {
    const { ingredients } = await request.json();

    if (!ingredients || ingredients.length < 2) {
      return new Response(
        JSON.stringify({ error: 'At least 2 ingredients are required' }),
        { 
          status: 400,
          headers: { 'Content-Type': 'application/json' }
        }
      );
    }

    const prompt = `Write a saucy, scrappy recipe for a potion. It can be a little scornful of the reader. It should feel very North Carolina, charged with a feeling of Southern woods and suburban grime. The voice is Kate McKinnon meets Flannery O'Connor - they love the South, in all its haunted, complicated mess. It should be rooted in place, and maybe a little nostalgic. This isn't a storybook potion, but something unsettling and quiet in a believable way. Don't be afraid to be grotesque, and to suggest something out of frame. Think hard about the purpose of the potion and how it relates to the ingredients. The use for the potion must be very clear. Be sassy and sarcastic but still concise. Don't lean into negative stereotypes of the South. The ingredients are the following: ${ingredients.join(
      ', '
    )}.

Please provide a response in markdown format with the following structure:

# Potion Name

## Ingredients

- 1 Dragon Scale (crushed)
- 3 drops Phoenix Feather essence

## Instructions

1. Heat cauldron to exactly 350°F
2. Add ingredients in clockwise motion
3. Stir until mixture turns iridescent

## Effects

- Grants temporary flight for 1 hour
- Enhances magical resistance

## Side Effects

- May cause slight dizziness
- Temporary blue glow around eyes

## Warnings

- Do not consume on empty stomach
- Keep away from direct sunlight

Important!: Return the response in markdown format as shown above. Do not wrap it in any additional formatting or code blocks.

Make it creative and fantastical!`;

    const stream = await openai.chat.completions.create({
      model: 'gpt-4o',
      messages: [
        {
          role: 'system',
          content:
            'You are a master alchemist creating magical potion recipes. Always respond with markdown formatted recipes.',
        },
        {
          role: 'user',
          content: prompt,
        },
      ],
      temperature: 0.8,
      stream: true,
    });

    const encoder = new TextEncoder();
    const readable = new ReadableStream({
      async start(controller) {
        try {
          for await (const chunk of stream) {
            const content = chunk.choices[0]?.delta?.content;
            if (content) {
              controller.enqueue(encoder.encode(content));
            }
          }
          controller.close();
        } catch (error) {
          console.error('Error in stream:', error);
          controller.error(error);
        }
      },
    });

    return new Response(readable, {
      headers: {
        'Content-Type': 'text/plain; charset=utf-8',
        'Transfer-Encoding': 'chunked',
      },
    });
  } catch (error) {
    console.error('Error generating potion:', error);
    return new Response(
      JSON.stringify({ error: 'Failed to brew potion. The cauldron seems to be broken!' }),
      { 
        status: 500,
        headers: { 'Content-Type': 'application/json' }
      }
    );
  }
}
