import ReactMarkdown from 'react-markdown';
import { ReactNode, useEffect, useState } from 'react';
import ShareRecipeModal from './ShareRecipeModal';

interface PotionRecipeProps {
  recipe: string;
  ingredients: string[];
  onBrewAgain?: () => void;
}

export default function PotionRecipe({
  recipe,
  ingredients,
  onBrewAgain,
}: PotionRecipeProps) {
  const [isVisible, setIsVisible] = useState(false);
  const [showShareModal, setShowShareModal] = useState(false);

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
    <div className="w-full flex justify-center">
      <div className="max-w-4xl w-full">
        <article
          className={`p-8 transition-opacity duration-500 ${
            isVisible ? 'opacity-100' : 'opacity-0'
          }`}
        >
          <div className="prose prose-lg max-w-none">
            <ReactMarkdown
              components={{
                h1: ({ children }: { children?: ReactNode }) => (
                  <h1 className="font-mono text-4xl font-semibold text-foreground text-center mb-12">
                    {children}
                  </h1>
                ),
                h2: ({ children }: { children?: ReactNode }) => (
                  <h2 className="font-mono text-xl font-semibold text-foreground mb-6">
                    {children}
                  </h2>
                ),
                ul: ({ children }: { children?: ReactNode }) => (
                  <ul className="space-y-2 pb-6">{children}</ul>
                ),
                ol: ({ children }: { children?: ReactNode }) => (
                  <ol className="list-decimal space-y-3  pb-6 pl-8">
                    {children}
                  </ol>
                ),
                // eslint-disable-next-line @typescript-eslint/no-explicit-any
                li: ({
                  children,
                  ...props
                }: {
                  children?: ReactNode;
                  node?: any;
                }) => {
                  const isOrdered =
                    props.node?.parent?.type === 'list' &&
                    props.node?.parent?.ordered;
                  if (isOrdered) {
                    return (
                      <li className="font-mono text-foreground/80 pl-6 relative">
                        {children}
                      </li>
                    );
                  }
                  return (
                    <li className="font-mono text-foreground/80 pl-4">
                      {children}
                    </li>
                  );
                },
                p: ({ children }: { children?: ReactNode }) => (
                  <p className="font-mono text-foreground/80 mb-4">
                    {children}
                  </p>
                ),
              }}
            >
              {recipe}
            </ReactMarkdown>
          </div>
        </article>

        {/* Action Buttons */}
        {onBrewAgain && (
          <div className="flex justify-center gap-4 mt-12">
            <button
              onClick={onBrewAgain}
              className="cursor-pointer bg-white text-black hover:bg-gray-100 font-semibold py-4 px-8 text-lg transition-all duration-300 border border-gray-300 hover:border-gray-400 shadow-lg hover:shadow-xl backdrop-blur-sm ring-2 ring-gray-500/20 hover:scale-105 transform hover:shadow-blue-500/25"
            >
              Brew Again
            </button>
            <button
              onClick={() => setShowShareModal(true)}
              className="cursor-pointer bg-gray-700 text-white hover:bg-gray-600 font-semibold py-4 px-8 text-lg transition-all duration-300 border border-gray-600 hover:border-gray-500 shadow-lg hover:shadow-xl backdrop-blur-sm ring-2 ring-gray-500/20 hover:scale-105 transform"
            >
              Share Recipe
            </button>
          </div>
        )}

        {/* Share Recipe Modal */}
        <ShareRecipeModal
          isVisible={showShareModal}
          onClose={() => setShowShareModal(false)}
          recipe={recipe}
          ingredients={ingredients}
        />
      </div>
    </div>
  );
}
