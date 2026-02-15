
export interface User {
  id: string;
  _id?: string;
  name: string;
  email: string;
}

export interface Snippet {
  id: string;
  _id?: string;
  userId: string;
  user?: User | string; // Helper for populated user
  title: string;
  language: string;
  code: string;
  tags: string[];
  isFavorite: boolean;
  createdAt: number | string;
  updatedAt?: number | string;
  interviewAnswer: string;
  syntax: string | { _id: string; name: string };
  codeStructure?: {
    functions: string[];
    hooks: string[];
    asyncPatterns: string[];
    loops: string[];
    conditionals: string[];
    imports: string[];
    returns: string[];
  };
  syntaxTokens?: string[];
  matchedTokens?: string[]; // For UI display
  relevanceScore?: number;
}

export type AuthContextType = {
  user: User | null;
  login: (email: string, password: string) => Promise<boolean>;
  signup: (name: string, email: string, password: string) => Promise<boolean>;
  logout: () => void;
  isLoading: boolean;
};

export type SnippetContextType = {
  snippets: Snippet[];
  addSnippet: (snippet: Omit<Snippet, 'id' | 'userId' | 'createdAt'>) => void;
  updateSnippet: (id: string, updates: Partial<Snippet>) => void;
  deleteSnippet: (id: string) => void;
  toggleFavorite: (id: string) => void;
};
