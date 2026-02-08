
import type{ Snippet } from '../types';

export const SEED_SNIPPETS: Omit<Snippet, 'userId'>[] = [
  {
    id: '1',
    title: 'Custom Hook: useLocalStorage',
    language: 'TypeScript',
    code: `function useLocalStorage<T>(key: string, initialValue: T) {\n  const [storedValue, setStoredValue] = useState<T>(() => {\n    try {\n      const item = window.localStorage.getItem(key);\n      return item ? JSON.parse(item) : initialValue;\n    } catch (error) {\n      return initialValue;\n    }\n  });\n\n  const setValue = (value: T | ((val: T) => T)) => {\n    const valueToStore = value instanceof Function ? value(storedValue) : value;\n    setStoredValue(valueToStore);\n    window.localStorage.setItem(key, JSON.stringify(valueToStore));\n  };\n\n  return [storedValue, setValue] as const;\n}`,
    tags: ['hooks', 'utility', 'react'],
    isFavorite: true,
    createdAt: Date.now() - 10000,
    interviewAnswer: "This hook handles persistent state by syncing with LocalStorage. I use an initializer function in useState to prevent reading from disk on every re-render (lazy initialization). It also handles functional updates, similar to how the standard useState works."
  },
  {
    id: '2',
    title: 'Tailwind Grid Layout',
    language: 'React',
    code: `<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">\n  {items.map(item => (\n    <div key={item.id} className="bg-gray-800 p-4 rounded-xl border border-gray-700 shadow-lg">\n      <h3 className="text-xl font-bold">{item.name}</h3>\n    </div>\n  ))}\n</div>`,
    tags: ['ui', 'tailwind', 'layout'],
    isFavorite: true,
    createdAt: Date.now() - 20000,
    interviewAnswer: "This uses Tailwind's CSS Grid utilities. It's responsive by default: 1 column on mobile, 2 on tablet (md), and 3 on desktop (lg). The 'gap-6' provides consistent spacing between grid items."
  },
  {
    id: '3',
    title: 'Hook: useDebounce',
    language: 'TypeScript',
    code: `function useDebounce<T>(value: T, delay: number): T {\n  const [debouncedValue, setDebouncedValue] = useState<T>(value);\n\n  useEffect(() => {\n    const handler = setTimeout(() => {\n      setDebouncedValue(value);\n    }, delay);\n\n    return () => clearTimeout(handler);\n  }, [value, delay]);\n\n  return debouncedValue;\n}`,
    tags: ['hooks', 'performance'],
    isFavorite: false,
    createdAt: Date.now() - 30000,
    interviewAnswer: "Essential for search inputs to prevent excessive API calls. It resets the timer on every value change via the cleanup function in useEffect, ensuring the state only updates after the user stops typing for the specified delay."
  },
  {
    id: '4',
    title: 'Hook: useClickOutside',
    language: 'TypeScript',
    code: `function useClickOutside(ref: React.RefObject<HTMLElement>, callback: () => void) {\n  useEffect(() => {\n    const handleClick = (event: MouseEvent) => {\n      if (ref.current && !ref.current.contains(event.target as Node)) {\n        callback();\n      }\n    };\n\n    document.addEventListener('mousedown', handleClick);\n    return () => document.removeEventListener('mousedown', handleClick);\n  }, [ref, callback]);\n}`,
    tags: ['hooks', 'ui', 'react'],
    isFavorite: false,
    createdAt: Date.now() - 40000,
    interviewAnswer: "Commonly used for Modals or Dropdowns. It checks if the click target is contained within the element referenced by the ref. If not, the callback is triggered."
  },
  {
    id: '5',
    title: 'Utility: cn (clsx + tailwind-merge)',
    language: 'TypeScript',
    code: `import { type ClassValue, clsx } from 'clsx';\nimport { twMerge } from 'tailwind-merge';\n\nexport function cn(...inputs: ClassValue[]) {\n  return twMerge(clsx(inputs));\n}`,
    tags: ['utility', 'tailwind'],
    isFavorite: true,
    createdAt: Date.now() - 50000,
    interviewAnswer: "Combines clsx (for conditional classes) and tailwind-merge (to resolve conflicts). This is the standard pattern in shadcn/ui to allow overriding default Tailwind styles via props."
  },
  {
    id: '6',
    title: 'API Fetch Wrapper',
    language: 'TypeScript',
    code: `export const fetcher = async (url: string, options: RequestInit = {}) => {\n  const res = await fetch(url, {\n    ...options,\n    headers: {\n      'Content-Type': 'application/json',\n      ...options.headers,\n    },\n  });\n\n  if (!res.ok) {\n    const error = new Error('An error occurred while fetching the data.');\n    throw error;\n  }\n\n  return res.json();\n};`,
    tags: ['utility', 'api', 'async'],
    isFavorite: false,
    createdAt: Date.now() - 60000,
    interviewAnswer: "A generic fetcher for libraries like SWR or React Query. It handles basic error checking by throwing if res.ok is false, which allows the calling hook to catch the error."
  },
  {
    id: '7',
    title: 'Hook: useIntersectionObserver',
    language: 'TypeScript',
    code: `function useIntersectionObserver(ref: React.RefObject<Element>, options: IntersectionObserverInit) {\n  const [entry, setEntry] = useState<IntersectionObserverEntry | null>(null);\n\n  useEffect(() => {\n    const observer = new IntersectionObserver(([entry]) => setEntry(entry), options);\n    if (ref.current) observer.observe(ref.current);\n    return () => observer.disconnect();\n  }, [ref, options]);\n\n  return entry;\n}`,
    tags: ['hooks', 'performance', 'dom'],
    isFavorite: false,
    createdAt: Date.now() - 70000,
    interviewAnswer: "Used for infinite scrolling or lazy-loading images. It uses the native Intersection Observer API to detect when an element enters or leaves the viewport."
  },
  {
    id: '8',
    title: 'Responsive Flexbox Center',
    language: 'CSS',
    code: `.center-container {\n  display: flex;\n  align-items: center;\n  justify-content: center;\n  min-height: 100vh;\n  padding: 1rem;\n}`,
    tags: ['css', 'layout'],
    isFavorite: false,
    createdAt: Date.now() - 80000,
    interviewAnswer: "This CSS pattern uses flexbox to perfectly center content both vertically and horizontally. min-height: 100vh ensures the container takes the full viewport height."
  },
  {
    id: '9',
    title: 'Hook: useMediaQuery',
    language: 'TypeScript',
    code: `function useMediaQuery(query: string): boolean {\n  const [matches, setMatches] = useState(false);\n\n  useEffect(() => {\n    const media = window.matchMedia(query);\n    if (media.matches !== matches) setMatches(media.matches);\n    const listener = () => setMatches(media.matches);\n    media.addListener(listener);\n    return () => media.removeListener(listener);\n  }, [matches, query]);\n\n  return matches;\n}`,
    tags: ['hooks', 'ui', 'responsive'],
    isFavorite: true,
    createdAt: Date.now() - 90000,
    interviewAnswer: "A clean way to handle conditional rendering based on screen size in JS. It listens to window.matchMedia changes for better performance than listening to 'resize' events."
  },
  {
    id: '10',
    title: 'Zod User Schema',
    language: 'TypeScript',
    code: `import { z } from 'zod';\n\nexport const UserSchema = z.object({\n  id: z.string().uuid(),\n  email: z.string().email(),\n  username: z.string().min(3).max(20),\n  role: z.enum(['admin', 'user', 'guest']),\n  createdAt: z.date(),\n});\n\nexport type User = z.infer<typeof UserSchema>;`,
    tags: ['zod', 'validation', 'typescript'],
    isFavorite: false,
    createdAt: Date.now() - 100000,
    interviewAnswer: "Zod provides schema-first validation and automatic TypeScript type inference. This ensures that the data we receive from an API matches our expected structure at runtime."
  },
  {
    id: '11',
    title: 'Framer Motion: Fade In',
    language: 'React',
    code: `const fadeIn = {\n  initial: { opacity: 0, y: 20 },\n  animate: { opacity: 1, y: 0 },\n  exit: { opacity: 0, y: -20 },\n  transition: { duration: 0.3 }\n};\n\n<motion.div {...fadeIn}>\n  Animated Content\n</motion.div>`,
    tags: ['animation', 'framer-motion'],
    isFavorite: false,
    createdAt: Date.now() - 110000,
    interviewAnswer: "Framer Motion simplifies animations in React. The 'initial' state defines the starting point, 'animate' defines the end state, and 'transition' controls the timing and easing of the movement."
  },
  {
    id: '12',
    title: 'Tailwind Aspect Ratio Box',
    language: 'React',
    code: `<div className="relative w-full pb-[56.25%] overflow-hidden rounded-xl">\n  <img \n    src={src} \n    className="absolute inset-0 w-full h-full object-cover" \n    alt="Preview"\n  />\n</div>`,
    tags: ['ui', 'tailwind', 'layout'],
    isFavorite: false,
    createdAt: Date.now() - 120000,
    interviewAnswer: "The classic 'padding-bottom' trick to maintain a 16:9 aspect ratio before the native 'aspect-ratio' property was widely supported. 56.25% is (9 / 16) * 100."
  },
  {
    id: '13',
    title: 'Hook: useWindowSize',
    language: 'TypeScript',
    code: `function useWindowSize() {\n  const [size, setSize] = useState({ width: 0, height: 0 });\n\n  useEffect(() => {\n    const handleResize = () => setSize({ width: window.innerWidth, height: window.innerHeight });\n    window.addEventListener('resize', handleResize);\n    handleResize();\n    return () => window.removeEventListener('resize', handleResize);\n  }, []);\n\n  return size;\n}`,
    tags: ['hooks', 'utility'],
    isFavorite: false,
    createdAt: Date.now() - 130000,
    interviewAnswer: "This hook tracks the window dimensions. It updates state whenever a resize event is fired, allowing components to respond to layout changes dynamically."
  },
  {
    id: '14',
    title: 'Redux Toolkit Slice',
    language: 'TypeScript',
    code: `import { createSlice, PayloadAction } from '@reduxjs/toolkit';\n\nconst counterSlice = createSlice({\n  name: 'counter',\n  initialState: { value: 0 },\n  reducers: {\n    increment: (state) => { state.value += 1; },\n    decrement: (state) => { state.value -= 1; },\n    incrementByAmount: (state, action: PayloadAction<number>) => {\n      state.value += action.payload;\n    },\n  },\n});\n\nexport const { increment, decrement, incrementByAmount } = counterSlice.actions;\nexport default counterSlice.reducer;`,
    tags: ['redux', 'state-management'],
    isFavorite: false,
    createdAt: Date.now() - 140000,
    interviewAnswer: "Redux Toolkit's createSlice simplifies state management by combining actions and reducers. It uses Immer internally, allowing us to write 'mutative' code that is actually processed immutably."
  },
  {
    id: '15',
    title: 'Glassmorphism Card Effect',
    language: 'CSS',
    code: `.glass-card {\n  background: rgba(255, 255, 255, 0.05);\n  backdrop-filter: blur(10px);\n  border: 1px solid rgba(255, 255, 255, 0.1);\n  border-radius: 1.5rem;\n  box-shadow: 0 8px 32px 0 rgba(0, 0, 0, 0.37);\n}`,
    tags: ['css', 'ui', 'glassmorphism'],
    isFavorite: true,
    createdAt: Date.now() - 150000,
    interviewAnswer: "Glassmorphism is achieved by combining semi-transparent background colors with backdrop-filter: blur(). This creates a frosted-glass look that depth to the UI."
  },
  {
    id: '16',
    title: 'React Hook Form Setup',
    language: 'React',
    code: `const { register, handleSubmit, formState: { errors } } = useForm();\n\nconst onSubmit = data => console.log(data);\n\n<form onSubmit={handleSubmit(onSubmit)}>\n  <input {...register("firstName", { required: true })} />\n  {errors.firstName && <span>Required</span>}\n  <input type="submit" />\n</form>`,
    tags: ['forms', 'react'],
    isFavorite: false,
    createdAt: Date.now() - 160000,
    interviewAnswer: "React Hook Form uses uncontrolled components and refs to minimize re-renders compared to traditional controlled components where every keystroke triggers a state update."
  },
  {
    id: '17',
    title: 'Next.js API Route (App Router)',
    language: 'TypeScript',
    code: `import { NextResponse } from 'next/server';\n\nexport async function GET() {\n  return NextResponse.json({\n    message: 'Hello from the API',\n    timestamp: Date.now()\n  });\n}\n\nexport async function POST(request: Request) {\n  const body = await request.json();\n  return NextResponse.json({ received: body });\n}`,
    tags: ['nextjs', 'api'],
    isFavorite: false,
    createdAt: Date.now() - 170000,
    interviewAnswer: "In the Next.js App Router, API routes are defined as named exports (GET, POST, etc.) within route.ts files. NextResponse is used to return JSON data with appropriate headers."
  },
  {
    id: '18',
    title: 'Hook: usePrevious',
    language: 'TypeScript',
    code: `function usePrevious<T>(value: T): T | undefined {\n  const ref = useRef<T>();\n  useEffect(() => {\n    ref.current = value;\n  }, [value]);\n  return ref.current;\n}`,
    tags: ['hooks', 'utility'],
    isFavorite: false,
    createdAt: Date.now() - 180000,
    interviewAnswer: "Useful for comparing current vs previous props or state. Since useEffect runs after the render, the ref stores the 'old' value during the next render cycle."
  },
  {
    id: '19',
    title: 'Simple Accordion Skeleton',
    language: 'React',
    code: `const [isOpen, setIsOpen] = useState(false);\n\nreturn (\n  <div className="border border-white/10 rounded-xl">\n    <button onClick={() => setIsOpen(!isOpen)} className="w-full p-4 flex justify-between">\n      <span>Title</span>\n      <span>{isOpen ? '-' : '+'}</span>\n    </button>\n    {isOpen && <div className="p-4 border-t border-white/10">Content</div>}\n  </div>\n);`,
    tags: ['ui', 'component'],
    isFavorite: false,
    createdAt: Date.now() - 190000,
    interviewAnswer: "A basic state-driven accordion. The visibility of the content is toggled via a boolean state, making it a controlled component for simple UI interactions."
  },
  {
    id: '20',
    title: 'Styled Scrollbar Utility',
    language: 'CSS',
    code: `/* Custom Scrollbar */\n::-webkit-scrollbar {\n  width: 10px;\n}\n::-webkit-scrollbar-track {\n  background: #030712;\n}\n::-webkit-scrollbar-thumb {\n  background: #1e293b;\n  border-radius: 5px;\n}\n::-webkit-scrollbar-thumb:hover {\n  background: #334155;\n}`,
    tags: ['css', 'utility', 'ui'],
    isFavorite: false,
    createdAt: Date.now() - 200000,
    interviewAnswer: "Standard webkit utilities for customizing the scrollbar appearance. It allows us to match the scrollbar with the application's dark theme and overall aesthetic."
  }
];
