// Image Generation Page + Server API (OpenRouter)
// Files included in this single document:
// 1) app/image/page.tsx         <- React client page
// 2) app/api/openrouter/generate/route.ts <- Next.js server API route (PUT your API key into .env.local)

/*
  INSTALL
  Run in your project root:

  npm install axios framer-motion lucide-react clsx file-saver
  npm install @radix-ui/react-dialog @radix-ui/react-scroll-area @radix-ui/react-dropdown-menu

  ENV
  Create a file .env.local at the project root and add:

  OPENROUTER_API_KEY="YOUR_OPENROUTER_API_KEY"
  OPENROUTER_MODEL="<author>/<model-slug>"  # e.g. "stability/realistic-vision" or the model you choose

  NOTE: The server route reads the key and model from process.env. This avoids exposing the key in client JS.

  HOW IT WORKS
  - Client (page.tsx) sends POST /api/openrouter/generate with { prompt, style, size, n }
  - Server route (route.ts) forwards to OpenRouter API and returns an array of image URLs (or base64) to client
  - Client displays grid, allows download, save prompt to Recent Prompts (localStorage)

  If you *really* want to hardcode the API key into the page (not recommended), put it into the page file where indicated, but prefer .env.local.
*/

// =========================
// 1) app/image/page.tsx
// =========================

'use client';

import React, { useEffect, useRef, useState } from 'react';
import { useTheme } from 'next-themes';
import { useRouter } from 'next/navigation';
import {
  Home,
  Image,
  Shuffle,
  Download,
  Trash2,
  Plus,
  Sun,
  Menu
} from 'lucide-react';
import clsx from 'clsx';
import axios from 'axios';
import { saveAs } from 'file-saver';

// --- types
type GeneratedImage = { id: string; url?: string; b64?: string };

type PromptItem = {
  id: string;
  text: string;
  style?: string;
  pinned?: boolean;
  createdAt: number;
};

const PROMPTS_KEY = 'genix_recent_prompts_v1';

const STYLES = [
  'Casual Photo',
  '3D Render',
  'Anime',
  'Realistic',
  'Pixel Art',
  'Cinematic',
  'Concept Art'
];

const SIZES = ['512x512', '768x768', '1024x1024'];

// helper localStorage
const loadPrompts = (): PromptItem[] => {
  try {
    const raw = localStorage.getItem(PROMPTS_KEY);
    if (!raw) return [];
    return JSON.parse(raw) as PromptItem[];
  } catch {
    return [];
  }
};
const savePrompts = (items: PromptItem[]) => localStorage.setItem(PROMPTS_KEY, JSON.stringify(items));

// random prompt generator (simple, extendable)
const randomPromptsPool = [
  'A cozy coffee shop interior with warm lighting, cinematic 35mm lens',
  'Futuristic city skyline at dusk, neon signs, ultra-detailed 3D render',
  'A smiling corgi wearing aviator sunglasses, photorealistic',
  'Epic fantasy landscape with floating islands and waterfalls, concept art',
  'Cute anime girl holding a glowing orb in a forest at night',
  'Pixel art village street with lanterns and cobblestone',
  'A product shot of a sleek smartwatch on marble, studio lighting'
];

const getRandomPrompt = () => randomPromptsPool[Math.floor(Math.random() * randomPromptsPool.length)];

export default function ImageGenPage() {
  const { theme, setTheme } = useTheme();
  const isDark = theme === 'dark';
  const router = useRouter();

  // UI state
  const [prompt, setPrompt] = useState('');
  const [style, setStyle] = useState(STYLES[0]);
  const [size, setSize] = useState(SIZES[0]);
  const [count, setCount] = useState(1);
  const [isLoading, setIsLoading] = useState(false);
  const [images, setImages] = useState<GeneratedImage[]>([]);

  // recent prompts
  const [prompts, setPrompts] = useState<PromptItem[]>(() => (typeof window !== 'undefined' ? loadPrompts() : []));

  const fileInputRef = useRef<HTMLInputElement | null>(null);

  useEffect(() => savePrompts(prompts), [prompts]);

  // add prompt to recent
  const pushPrompt = (text: string, style?: string) => {
    const p: PromptItem = { id: Date.now().toString(), text, style, pinned: false, createdAt: Date.now() };
    setPrompts(prev => [p, ...prev].slice(0, 50));
  };

  const handleRandom = () => {
    const r = getRandomPrompt();
    setPrompt(r);
  };

  const handleDownload = (img: GeneratedImage) => {
    if (img.url) {
      saveAs(img.url, `genix-${img.id}.png`);
    } else if (img.b64) {
      const byteString = atob(img.b64.split(',')[1] || img.b64);
      const ab = new ArrayBuffer(byteString.length);
      const ia = new Uint8Array(ab);
      for (let i = 0; i < byteString.length; i++) ia[i] = byteString.charCodeAt(i);
      const blob = new Blob([ab], { type: 'image/png' });
      saveAs(blob, `genix-${img.id}.png`);
    }
  };

  const handleGenerate = async () => {
    if (!prompt.trim()) return;
    setIsLoading(true);
    setImages([]);

    // save prompt locally
    pushPrompt(prompt, style);

    try {
      // send to server route which forwards to OpenRouter
      const res = await axios.post('/api/openrouter/generate', {
        prompt,
        style,
        size,
        n: count
      });

      // server returns array of { id, url?, b64? }
      const data: GeneratedImage[] = res.data?.images ?? [];
      setImages(data);
    } catch (err: any) {
      console.error('Generation error', err?.response?.data ?? err.message ?? err);
      alert('Generation failed. Check console for details.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleUsePrompt = (p: PromptItem) => {
    setPrompt(p.text);
    setStyle(p.style ?? STYLES[0]);
  };

  const togglePinPrompt = (id: string) => {
    setPrompts(prev => prev.map(x => x.id === id ? { ...x, pinned: !x.pinned } : x).sort((a,b) => (b.pinned?1:0) - (a.pinned?1:0)));
  };

  const deletePrompt = (id: string) => setPrompts(prev => prev.filter(x => x.id !== id));

  const clearAllPrompts = () => { if (confirm('Clear all saved prompts?')) setPrompts([]); };

  return (
    <div className={clsx('min-h-screen w-full p-4', isDark ? 'bg-[#0b1020] text-white' : 'bg-white text-gray-900')}>
      <header className="max-w-5xl mx-auto flex items-center justify-between gap-3 mb-6">
        <div className="flex items-center gap-3">
          <button onClick={() => router.push('/')} className="p-2 rounded-md hover:bg-black/5"><Home /></button>
          <h1 className="text-2xl font-bold">GenixAI — Image Generator</h1>
        </div>

        <div className="flex items-center gap-2">
          <button onClick={() => setTheme(isDark ? 'light' : 'dark')} className="p-2 rounded-md hover:bg-black/5" title="Toggle theme"><Sun /></button>
        </div>
      </header>

      <main className="max-w-5xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Left: Controls */}
        <section className={clsx('col-span-1 md:col-span-1 p-4 rounded-2xl border', isDark ? 'bg-gray-900/40 border-gray-800' : 'bg-white/80 border-gray-200')}>
          <h2 className="text-lg font-semibold mb-3">Create image</h2>

          <label className="block text-sm mb-1">Prompt</label>
          <textarea value={prompt} onChange={(e) => setPrompt(e.target.value)} rows={6} className="w-full p-3 rounded-md bg-transparent border" placeholder="Describe the image you want..." />

          <div className="mt-3 grid grid-cols-2 gap-2">
            <div>
              <label className="text-sm">Style</label>
              <select value={style} onChange={e => setStyle(e.target.value)} className="w-full p-2 rounded-md border mt-1 bg-transparent">
                {STYLES.map(s => <option key={s} value={s}>{s}</option>)}
              </select>
            </div>

            <div>
              <label className="text-sm">Size</label>
              <select value={size} onChange={e => setSize(e.target.value)} className="w-full p-2 rounded-md border mt-1 bg-transparent">
                {SIZES.map(s => <option key={s} value={s}>{s}</option>)}
              </select>
            </div>

            <div>
              <label className="text-sm">Count</label>
              <input type="number" value={count} min={1} max={4} onChange={e => setCount(Number(e.target.value))} className="w-full p-2 rounded-md border mt-1 bg-transparent" />
            </div>

            <div>
              <label className="block text-sm invisible">Random</label>
              <button onClick={handleRandom} className="w-full p-2 rounded-md border">Random Prompt <Shuffle className="inline-block ml-2" /></button>
            </div>
          </div>

          <div className="mt-4 flex gap-2">
            <button onClick={handleGenerate} disabled={isLoading} className="flex-1 px-4 py-2 rounded-lg bg-purple-600 text-white font-semibold">{isLoading ? 'Generating...' : 'Generate'}</button>
            <button onClick={() => { setPrompt(''); setImages([]); }} className="px-4 py-2 rounded-lg border">Clear</button>
          </div>

          <div className="mt-4 text-sm text-gray-400">Tip: Add camera lens, lighting, mood and color details for better results.</div>
        </section>

        {/* Middle: Gallery */}
        <section className="col-span-1 md:col-span-2">
          <div className="p-4 rounded-2xl border mb-4 flex items-center justify-between" style={{ background: isDark ? 'rgba(255,255,255,0.02)' : 'rgba(0,0,0,0.02)' }}>
            <div>
              <h3 className="font-semibold">Generated images</h3>
              <div className="text-sm text-gray-400">Download or save the ones you like.</div>
            </div>

            <div className="flex items-center gap-2">
              <button onClick={() => { setImages([]); }} className="p-2 rounded-md border"><Trash2 /></button>
              <button onClick={() => { if (images.length) images.forEach(img => img.url && saveAs(img.url)); }} className="p-2 rounded-md border"><Download /></button>
            </div>
          </div>

          <div className={clsx('grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4')}>
            {images.length === 0 ? (
              <div className="col-span-full p-8 rounded-2xl border text-center text-gray-500">No images yet — generate something.</div>
            ) : images.map(img => (
              <div key={img.id} className="p-2 rounded-lg border bg-transparent">
                <div className="rounded-lg overflow-hidden bg-black/5" style={{ minHeight: 200 }}>
                  {img.url ? (
                    // external URL
                    // eslint-disable-next-line @next/next/no-img-element
                    <img src={img.url} alt="generated" className="w-full h-48 object-cover" />
                  ) : img.b64 ? (
                    // base64
                    // eslint-disable-next-line @next/next/no-img-element
                    <img src={img.b64} alt="generated" className="w-full h-48 object-cover" />
                  ) : (
                    <div className="w-full h-48 flex items-center justify-center text-gray-400">No preview</div>
                  )}
                </div>
                <div className="mt-2 flex items-center justify-between">
                  <div className="text-sm text-gray-400">ID: {img.id}</div>
                  <div className="flex gap-2">
                    <button onClick={() => handleDownload(img)} className="p-2 rounded-md border"><Download /></button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Right (hidden on small screens): Recent Prompts drawer replica */}
        <aside className="hidden md:block">
          <div className={clsx('p-4 rounded-2xl border', isDark ? 'bg-gray-900/40 border-gray-800' : 'bg-white/80 border-gray-200')}>
            <div className="flex items-center justify-between mb-3">
              <h4 className="font-semibold">Recent Prompts</h4>
              <div className="flex gap-2">
                <button onClick={() => { setPrompts([]); }} className="p-1 rounded-md border text-sm">Clear</button>
                <button onClick={() => { setPrompt(''); setImages([]); }} className="p-1 rounded-md border text-sm">New</button>
              </div>
            </div>

            <div className="space-y-2 max-h-[60vh] overflow-y-auto">
              {prompts.length === 0 ? <div className="text-sm text-gray-400">No prompts yet.</div> : prompts.map(p => (
                <div key={p.id} className={clsx('p-3 rounded-lg border', p.pinned ? 'bg-yellow-50' : 'bg-transparent') }>
                  <div className="flex items-start justify-between gap-2">
                    <div className="flex-1 mr-2">
                      <div className="text-sm font-medium truncate">{p.text}</div>
                      <div className="text-xs text-gray-400">{new Date(p.createdAt).toLocaleString()}</div>
                    </div>
                    <div className="flex flex-col gap-1">
                      <button onClick={() => handleUsePrompt(p)} title="Use prompt" className="p-1 rounded-md border"><Plus /></button>
                      <button onClick={() => togglePinPrompt(p.id)} title="Pin" className="p-1 rounded-md border"><Image /></button>
                      <button onClick={() => deletePrompt(p.id)} title="Delete" className="p-1 rounded-md border"><Trash2 /></button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </aside>
      </main>
    </div>
  );
}

// =========================
// 2) app/api/openrouter/generate/route.ts
// =========================

/*
  Note: This is a Next.js Route Handler (App Router). Place this file at:
  app/api/openrouter/generate/route.ts

  It expects environment variables in .env.local:
    OPENROUTER_API_KEY
    OPENROUTER_MODEL

  The OpenRouter API is evolving; this handler attempts a generic image generation call
  to OpenRouter's /api/v1/generation endpoint. Depending on the exact model you choose,
  the expected request body or response shape may vary. If a model requires a different
  schema, adapt below accordingly (see https://openrouter.ai/docs).
*/

// route.ts (CommonJS/ESM depending on Next version) - using Next 13+ app router style

// Paste this file to: app/api/openrouter/generate/route.ts

/* Example content for route.ts: */

/*
import { NextResponse } from 'next/server';
import axios from 'axios';

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { prompt, style, size, n } = body;

    const API_KEY = process.env.OPENROUTER_API_KEY || '';
    const MODEL = process.env.OPENROUTER_MODEL || '';

    if (!API_KEY) return NextResponse.json({ error: 'Missing OPENROUTER_API_KEY in server env' }, { status: 400 });
    if (!MODEL) return NextResponse.json({ error: 'Missing OPENROUTER_MODEL in server env' }, { status: 400 });

    // Construct a model-agnostic payload. Some providers expect 'input' or 'prompt'.
    const payload = {
      model: MODEL,
      input: `${prompt} -- style: ${style} -- high detail -- size: ${size}`,
      // model-specific options may be required here
      // you might also need: { image: { size, samples: n } } depending on model
    };

    const resp = await axios.post('https://openrouter.ai/api/v1/generation', payload, {
      headers: {
        Authorization: `Bearer ${API_KEY}`,
        'Content-Type': 'application/json'
      },
      timeout: 120000
    });

    // resp.data structure depends on model/provider. Try to extract images from common fields
    const out = resp.data || {};

    // Best-effort extraction
    const images: any[] = [];
    // If provider returns base64 images in out.output or out.data
    if (out.output && Array.isArray(out.output)) {
      for (const item of out.output) {
        if (item.type === 'image' && item.data) images.push({ id: item.id ?? Date.now().toString(), b64: item.data });
      }
    }

    // OpenRouter sometimes returns 'generations' or 'images' or 'data'
    if (out.generations && Array.isArray(out.generations)) {
      for (const g of out.generations) {
        if (g.image_url) images.push({ id: g.id ?? Date.now().toString(), url: g.image_url });
        if (g.base64) images.push({ id: g.id ?? Date.now().toString(), b64: g.base64 });
      }
    }

    // fallback: if out.data contains urls
    if (out.data && Array.isArray(out.data)) {
      for (const d of out.data) {
        if (d.url) images.push({ id: d.id ?? Date.now().toString(), url: d.url });
        if (d.b64) images.push({ id: d.id ?? Date.now().toString(), b64: d.b64 });
      }
    }

    // If none found, try to look for a top-level 'url' or 'image'
    if (images.length === 0) {
      if (out.url) images.push({ id: Date.now().toString(), url: out.url });
      if (out.image) images.push({ id: Date.now().toString(), b64: out.image });
    }

    return NextResponse.json({ images });
  } catch (err: any) {
    console.error('openrouter generate err', err?.response?.data ?? err.message ?? err);
    return NextResponse.json({ error: 'Generation failed', details: err?.response?.data ?? err?.message ?? '' }, { status: 500 });
  }
}
*/

// ========== End of document ==========
