'use client';

import { useState, useEffect } from 'react';
import { IngredientCategory, Ingredient } from '@/lib/ingredients';

interface MagicalShelfProps {
  categories: IngredientCategory[];
  selectedIngredients: string[];
  onToggleIngredient: (ingredient: string) => void;
  maxIngredients?: number;
}

export default function MagicalShelf({
  categories,
  selectedIngredients,
  onToggleIngredient,
  maxIngredients = 6
}: MagicalShelfProps) {
  const [searchTerm, setSearchTerm] = useState('');
  const [expandedCategories, setExpandedCategories] = useState<Set<string>>(new Set());
  const [hoveredIngredient, setHoveredIngredient] = useState<string | null>(null);
  const [useCategorical, setUseCategorical] = useState(true);

  // Auto-expand first category when categories change or view mode changes
  useEffect(() => {
    if (useCategorical && categories.length > 0) {
      setExpandedCategories(new Set([categories[0].name]));
    } else if (!useCategorical) {
      setExpandedCategories(new Set(['All Mystical Ingredients']));
    }
  }, [categories, useCategorical]);

  const toggleCategory = (categoryName: string) => {
    const newExpanded = new Set(expandedCategories);
    if (newExpanded.has(categoryName)) {
      newExpanded.delete(categoryName);
    } else {
      newExpanded.add(categoryName);
    }
    setExpandedCategories(newExpanded);
  };

  const filteredCategories = categories.map(category => ({
    ...category,
    ingredients: category.ingredients.filter(ingredient =>
      ingredient.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      ingredient.associationA?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      ingredient.associationB?.toLowerCase().includes(searchTerm.toLowerCase())
    )
  })).filter(category => category.ingredients.length > 0);

  // Create flat view - all ingredients in one category
  const flatCategory: IngredientCategory = {
    name: 'All Mystical Ingredients',
    color: 'slate',
    icon: '🌟',
    ingredients: filteredCategories.flatMap(cat => cat.ingredients)
  };

  const displayCategories = useCategorical ? filteredCategories : [flatCategory];

  const getIngredientJarSize = (ingredient: Ingredient) => {
    const nameLength = ingredient.name.length;
    if (nameLength < 6) return 'h-16 w-12';
    if (nameLength < 10) return 'h-20 w-14';
    return 'h-24 w-16';
  };

  const getIngredientColor = (ingredient: Ingredient, categoryColor: string) => {
    if (selectedIngredients.includes(ingredient.name)) {
      return 'ring-2 ring-yellow-400 bg-yellow-50 shadow-lg shadow-yellow-200';
    }
    if (hoveredIngredient === ingredient.name) {
      return `ring-2 ring-${categoryColor}-400 bg-${categoryColor}-50 shadow-lg shadow-${categoryColor}-200`;
    }
    return `bg-${categoryColor}-100 hover:bg-${categoryColor}-200 border-${categoryColor}-300`;
  };

  return (
    <section className="border border-border bg-gradient-to-b from-accent/20 to-accent/40 p-8 mb-12 rounded-lg">
      <div className="mb-6">
        <h2 className="font-serif text-2xl font-semibold text-foreground mb-4">
          🔮 Magical Shelf of Holding ({selectedIngredients.length}/{maxIngredients})
        </h2>
        
        {/* Mystical Search */}
        <div className="relative mb-4">
          <input
            type="text"
            placeholder="🔍 Search the mystical ingredients..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full p-3 border border-border rounded-lg bg-background/80 backdrop-blur-sm focus:ring-2 focus:ring-purple-400 focus:border-transparent"
          />
          {searchTerm && (
            <div className="absolute right-3 top-3 text-sm text-foreground/60">
              ✨ {filteredCategories.reduce((acc, cat) => acc + cat.ingredients.length, 0)} found
            </div>
          )}
        </div>

        {/* [DEV] View Toggle - TODO: Remove before launch */}
        <div className="mb-4 p-3 bg-orange-100 border border-orange-300 rounded-lg">
          <label className="flex items-center gap-2 text-sm font-medium text-orange-800">
            <input
              type="checkbox"
              checked={useCategorical}
              onChange={(e) => setUseCategorical(e.target.checked)}
              className="rounded"
            />
            🔬 [DEV] Use Categorical View (uncheck for flat view)
          </label>
        </div>

        {/* Selected Ingredients Display */}
        {selectedIngredients.length > 0 && (
          <div className="mb-6 p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
            <h3 className="text-lg font-medium text-yellow-800 mb-3">🧪 Brewing Cauldron:</h3>
            <div className="flex flex-wrap gap-2">
              {selectedIngredients.map(ingredient => (
                <button
                  key={ingredient}
                  onClick={() => onToggleIngredient(ingredient)}
                  className="px-3 py-1 bg-yellow-200 text-yellow-800 text-sm rounded-full hover:bg-yellow-300 transition-all transform hover:scale-105"
                >
                  {ingredient} ✕
                </button>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Magical Shelves */}
      <div className="space-y-6">
        {displayCategories.map(category => (
          <div key={category.name} className="relative">
            {/* Shelf Header */}
            <button
              onClick={() => toggleCategory(category.name)}
              className={`w-full flex items-center justify-between p-4 rounded-t-lg border-2 border-b-0 transition-all ${
                expandedCategories.has(category.name)
                  ? `bg-${category.color}-100 border-${category.color}-300`
                  : `bg-${category.color}-50 border-${category.color}-200 hover:bg-${category.color}-100`
              }`}
            >
              <div className="flex items-center gap-3">
                <span className="text-2xl">{category.icon}</span>
                <span className="font-medium text-lg">{category.name}</span>
                <span className="text-sm text-foreground/60">({category.ingredients.length})</span>
              </div>
              <span className={`transform transition-transform ${
                expandedCategories.has(category.name) ? 'rotate-180' : ''
              }`}>
                ⌄
              </span>
            </button>

            {/* Shelf Contents */}
            {expandedCategories.has(category.name) && (
              <div className={`border-2 border-t-0 border-${category.color}-300 rounded-b-lg bg-${category.color}-50/50 p-6`}>
                <div className="grid grid-cols-6 md:grid-cols-8 lg:grid-cols-12 gap-4">
                  {category.ingredients.map(ingredient => (
                    <div
                      key={ingredient.name}
                      className="flex flex-col items-center group"
                      onMouseEnter={() => setHoveredIngredient(ingredient.name)}
                      onMouseLeave={() => setHoveredIngredient(null)}
                    >
                      {/* Ingredient Jar */}
                      <button
                        onClick={() => onToggleIngredient(ingredient.name)}
                        disabled={!selectedIngredients.includes(ingredient.name) && selectedIngredients.length >= maxIngredients}
                        className={`
                          ${getIngredientJarSize(ingredient)}
                          ${getIngredientColor(ingredient, category.color)}
                          border-2 rounded-lg transition-all duration-300
                          flex flex-col items-center justify-center p-2 text-xs font-medium
                          disabled:opacity-50 disabled:cursor-not-allowed
                          transform hover:scale-105 hover:-translate-y-1
                          relative overflow-hidden
                        `}
                      >
                        {/* Magic shimmer effect */}
                        <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent transform -skew-x-12 -translate-x-full group-hover:translate-x-full transition-transform duration-1000" />
                        
                        <div className="text-center z-10 leading-tight">
                          {ingredient.name.split(' ').map((word, i) => (
                            <div key={i} className="block">
                              {word}
                            </div>
                          ))}
                        </div>
                      </button>

                      {/* Ingredient Tooltip */}
                      {hoveredIngredient === ingredient.name && (
                        <div className="absolute z-50 mt-2 p-3 bg-black/90 text-white text-sm rounded-lg shadow-lg max-w-xs">
                          <div className="font-semibold">{ingredient.name}</div>
                          {ingredient.bodyPart && (
                            <div className="text-xs opacity-80">Part: {ingredient.bodyPart}</div>
                          )}
                          {ingredient.associationA && (
                            <div className="text-xs opacity-80">✨ {ingredient.associationA}</div>
                          )}
                          {ingredient.associationB && (
                            <div className="text-xs opacity-80">🌟 {ingredient.associationB}</div>
                          )}
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        ))}
      </div>

      {displayCategories.length === 0 && searchTerm && (
        <div className="text-center py-12 text-foreground/60">
          <div className="text-4xl mb-4">🔍</div>
          <div className="text-lg">No mystical ingredients found for "{searchTerm}"</div>
          <div className="text-sm">The magical search reveals nothing...</div>
        </div>
      )}
    </section>
  );
}