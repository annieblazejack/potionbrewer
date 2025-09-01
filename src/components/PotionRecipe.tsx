import ReactMarkdown from 'react-markdown';
import { ReactNode, useEffect, useState } from 'react';

interface PotionRecipeProps {
  recipe: string;
}

export default function PotionRecipe({ recipe }: PotionRecipeProps) {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    if (recipe) {
      // Start fade-in animation when recipe is available
      setIsVisible(true);
    } else {
      // Reset animation state when no recipe
      setIsVisible(false);
    }
  }, [recipe]);

  if (!recipe) return null;

  return (
    <article className={`p-8 transition-opacity duration-500 ${
      isVisible ? 'opacity-100' : 'opacity-0'
    }`}>
      <div className="prose prose-lg max-w-none">
        <ReactMarkdown
          components={{
            h1: ({ children }: { children?: ReactNode }) => (
              <h1 className="font-serif text-4xl font-semibold text-foreground font-caudex-italic text-center mb-12">
                {children}
              </h1>
            ),
            h2: ({ children }: { children?: ReactNode }) => (
              <h2 className="font-serif text-xl font-semibold text-foreground mb-6">
                {children}
              </h2>
            ),
            ul: ({ children }: { children?: ReactNode }) => (
              <ul className="space-y-2 pb-6">
                {children}
              </ul>
            ),
            ol: ({ children }: { children?: ReactNode }) => (
              <ol className="list-decimal space-y-3  pb-6 pl-8">
                {children}
              </ol>
            ),
            li: ({ children, ...props }: { children?: ReactNode; node?: any }) => {
              const isOrdered = props.node?.parent?.type === 'list' && props.node?.parent?.ordered;
              if (isOrdered) {
                return (
                  <li className="font-serif text-foreground/80 pl-6 relative">
                    {children}
                  </li>
                );
              }
              return (
                <li className="font-serif text-foreground/80 pl-4">
                  {children}
                </li>
              );
            },
            p: ({ children }: { children?: ReactNode }) => (
              <p className="font-serif text-foreground/80 mb-4">
                {children}
              </p>
            ),
          }}
        >
          {recipe}
        </ReactMarkdown>
      </div>
    </article>
  );
}
