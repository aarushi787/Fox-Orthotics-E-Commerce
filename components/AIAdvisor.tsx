import React, { useState, useCallback } from "react";

import { Product } from "../types";
import ProductCard from "./ProductCard";
import { AIIcon } from "./icons";

interface AIAdvisorProps {
  products: Product[];
  wishlist: number[];
  onToggleWishlist: (productId: number) => void;
  onAddToCart: (product: Product, quantity: number) => void;
  onClose: () => void;
}

interface AIResult {
  assistantResponse: string;
  recommendedSkus: string[];
}

const AIAdvisor: React.FC<AIAdvisorProps> = ({
  products,
  wishlist,
  onToggleWishlist,
  onAddToCart,
  onClose,
}) => {
  const [query, setQuery] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [result, setResult] = useState<AIResult | null>(null);

  const handleFindProducts = useCallback(
    async (attempt = 1) => {
      if (!query.trim()) {
        setError("Please enter your query.");
        return;
      }

      setIsLoading(true);
      setError(null);
      setResult(null);

      try {
        const response = await fetch("/api/ai/recommend", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ query, products }),
        });

        if (!response.ok) {
          const txt = await response.text();
          let errMsg = `HTTP error! status: ${response.status}`;
          try {
            const j = JSON.parse(txt);
            errMsg = j.message || j.error || errMsg;
          } catch (e) {
            if (txt) errMsg = txt;
          }
          const error = new Error(errMsg);
          (error as any).status = response.status;
          throw error;
        }

        const parsedResult = await response.json();
        setResult(parsedResult);
      } catch (err) {
        console.error(err);
        // automatic single retry for transient errors
        if (attempt < 2) {
          // small delay before retrying
          setTimeout(() => handleFindProducts(attempt + 1), 250);
          return;
        }

        const msg = (err && (err as Error).message) || "Something went wrong while finding products.";
        // keep message simple (no alarm about backend running)
        setError(msg);
      } finally {
        setIsLoading(false);
      }
    },
    [query]
  );

  // no explicit retry button; handler remains to be called by the primary button

  const recommendedProducts = result
    ? products.filter((p) => result.recommendedSkus.includes(p.sku))
    : [];

  return (
    <div className="fixed inset-0 bg-black bg-opacity-60 z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-xl shadow-2xl w-full max-w-4xl max-h-[90vh] flex flex-col overflow-hidden">
        
        {/* Header */}
        <div className="flex-shrink-0 p-6 flex justify-between items-center border-b">
          <div className="flex items-center gap-3">
            <div className="bg-brand-accent-light p-2 rounded-full">
              <AIIcon className="w-6 h-6 text-brand-accent" />
            </div>
            <h2 className="text-xl font-bold text-gray-900">AI Product Finder</h2>
          </div>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 text-3xl"
          >
            &times;
          </button>
        </div>

        {/* Main Body */}
        <div className="flex-grow overflow-y-auto p-6">
          {/* Input UI */}
          {!result && !isLoading && (
            <div className="flex flex-col items-center justify-center h-full text-center">
              <h3 className="text-lg font-semibold text-gray-800 mb-2">
                How can I help you today?
              </h3>
              <p className="text-gray-500 mb-6 max-w-md">
                Describe your condition or what you're looking for, and I'll find
                the best products for you.
              </p>

              <textarea
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Enter your query here..."
                className="w-full max-w-lg h-32 p-3 border border-gray-300 rounded-lg 
                           focus:ring-2 focus:ring-brand-accent focus:border-brand-accent"
                disabled={isLoading}
              />

              {error && (
                <div className="mt-2 text-sm">
                  <p className="text-red-500">{error}</p>
                </div>
              )}
            </div>
          )}

          {/* Loading UI */}
          {isLoading && (
            <div className="flex flex-col items-center justify-center h-full text-center">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-brand-accent"></div>
              <p className="mt-4 text-gray-600 font-medium">Thinking...</p>
              <p className="text-sm text-gray-500">
                Analyzing your needs to find the perfect match.
              </p>
            </div>
          )}

          {/* Result UI */}
          {result && (
            <div>
              {/* AI Explanation */}
              <div className="bg-slate-50 p-4 rounded-lg mb-6 border">
                <h4 className="font-bold text-gray-800 mb-2">
                  AI Recommendation:
                </h4>
                <p className="text-gray-700 whitespace-pre-wrap">
                  {result.assistantResponse}
                </p>
              </div>

              {/* Recommended Product Cards */}
              <h4 className="font-bold text-gray-800 mb-4">
                Recommended Products ({recommendedProducts.length})
              </h4>

              {recommendedProducts.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {recommendedProducts.map((product) => (
                    <ProductCard
                      key={product.id}
                      product={product}
                      isWishlisted={wishlist.includes(product.id)}
                      onToggleWishlist={onToggleWishlist}
                      onAddToCart={onAddToCart}
                    />
                  ))}
                </div>
              ) : (
                <p className="text-gray-600">
                  No specific products were recommended based on your query.
                </p>
              )}
            </div>
          )}
        </div>

        {/* Bottom Button */}
        {!result && (
          <div className="flex-shrink-0 p-6 border-t bg-gray-50">
            <button
              onClick={handleFindProducts}
              disabled={isLoading}
              className="w-full bg-brand-blue text-white font-bold py-3 px-4 rounded-lg 
                         hover:bg-brand-blue-dark transition-colors 
                         disabled:bg-gray-400 disabled:cursor-not-allowed flex items-center justify-center gap-2"
            >
              {isLoading ? "Searching..." : "Find Products"}
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default AIAdvisor;
