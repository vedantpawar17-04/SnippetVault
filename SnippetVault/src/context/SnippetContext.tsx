
import React, { createContext, useContext, useState, useEffect } from 'react';
import type { Snippet, SnippetContextType } from '../types';
import { useAuth } from './AuthContext';
import * as snippetService from '../services/snippetService';

const SnippetContext = createContext<SnippetContextType | undefined>(undefined);

export const SnippetProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { user } = useAuth();
  const [snippets, setSnippets] = useState<Snippet[]>([]);

  useEffect(() => {
    if (user) {
      snippetService.getSnippets()
        .then((data: any[]) => {
          const mapped = data.map(s => ({
            ...s,
            id: s._id,
          }));
          setSnippets(mapped);
        })
        .catch((err) => console.error('Failed to fetch snippets', err));
    } else {
      setSnippets([]);
    }
  }, [user]);

  const addSnippet = async (snippetData: Omit<Snippet, 'id' | 'userId' | 'createdAt'>) => {
    if (!user) return;
    try {
      const newSnippet = await snippetService.createSnippet(snippetData);
      const mapped = { ...newSnippet, id: newSnippet._id };
      setSnippets((prev) => [mapped, ...prev]);
    } catch (error) {
      console.error('Failed to create snippet', error);
    }
  };

  const updateSnippet = async (id: string, updates: Partial<Snippet>) => {
    try {
      // Create a history record in UpdatedSnippet schema first (or in parallel)
      try {
         await snippetService.createUpdatedSnippet(id, updates);
      } catch (historyError) {
         console.error('Failed to save to updated snippets history', historyError);
      }

      // Backend expects updates. 
      // If we update isFavorite separately, we need to handle that.
      // But passing 'updates' directly is fine if keys match.
      const updated = await snippetService.updateSnippet(id, updates);
      const mapped = { ...updated, id: updated._id };
      
      setSnippets((prev) => prev.map((s) => (s.id === id ? mapped : s)));
    } catch (error) {
      console.error('Failed to update snippet', error);
    }
  };

  const deleteSnippet = async (id: string) => {
    try {
      await snippetService.deleteSnippet(id);
      setSnippets((prev) => prev.filter((s) => s.id !== id));
    } catch (error) {
      console.error('Failed to delete snippet', error);
    }
  };

  const toggleFavorite = async (id: string) => {
    const snippet = snippets.find((s) => s.id === id);
    if (snippet) {
      await updateSnippet(id, { isFavorite: !snippet.isFavorite });
    }
  };

  return (
    <div className="flex-grow">
      <SnippetContext.Provider value={{ snippets, addSnippet, updateSnippet, deleteSnippet, toggleFavorite }}>
        {children}
      </SnippetContext.Provider>
    </div>
  );
};

// eslint-disable-next-line react-refresh/only-export-components
export const useSnippets = () => {
  const context = useContext(SnippetContext);
  if (!context) throw new Error('useSnippets must be used within SnippetProvider');
  return context;
};
