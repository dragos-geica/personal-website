import type { ReactNode } from 'react';

const artwork: Record<string, ReactNode> = {
  academics: <>
    <path d="m3 16 27-11 27 11-27 12L3 16Z" />
    <path d="M15 22v13c8 7 22 8 30 0V22M30 16l22 4v17" />
    <path d="M52 34v5" strokeWidth="3.4" />
  </>,
  research: <>
    <path d="m28 8 8 5-11 18-8-5 11-18Zm4 2 4-7 5 3-4 7M20 28l-2 4m-6 5 18 3m0-20a13 13 0 0 1 5 24" />
    <path d="M34 18a17 17 0 0 1 5 26M15 38a12 12 0 0 0 16 5M17 45h26l2 4H12l2-3 3-1Z" />
  </>,
  projects: <path d="m17 15-11 10 11 10m26-20 11 10-11 10M35 9 24 41" />,
  'data-tools': <>
    <ellipse cx="30" cy="10" rx="16" ry="6" />
    <path d="M14 10v29c0 4 7 6 16 6s16-2 16-6V10M14 20c0 4 7 6 16 6s16-2 16-6M14 30c0 4 7 6 16 6s16-2 16-6" />
  </>,
  music: <>
    <path d="M12 29v-6a18 18 0 0 1 36 0v6M12 30h4v14h-4a3 3 0 0 1-3-3v-8a3 3 0 0 1 3-3Zm36 0h-4v14h4a3 3 0 0 0 3-3v-8a3 3 0 0 0-3-3Z" />
    <rect x="15" y="27" width="5" height="20" rx="2" />
    <rect x="40" y="27" width="5" height="20" rx="2" />
  </>,
  reading: <>
    <path d="M30 13c-5-6-13-7-20-4v27c7-3 15-1 20 4 5-5 13-7 20-4V9c-7-3-15-2-20 4v27Z" />
    <path d="m10 13-4 1v27c9-3 17-3 24 2 7-5 15-5 24-2V14l-4-1" />
  </>,
  travel: <>
    <path d="M7 32c-2-1-1-3 1-3l8 2L44 11c4-3 10-6 13-3s-3 8-7 11L20 39c-3 2-5 2-8 0l-5-7Z" />
    <path d="m31 20-15-8c-3-1-6 0-8 2l16 11m10 6 4 14c1 3 4 0 5-3l1-18M17 40l-2 5m7-6-1 6" />
  </>,
  interests: <path d="M24 5c1.4 8 4 10.6 12 12-8 1.4-10.6 4-12 12-1.4-8-4-10.6-12-12 8-1.4 10.6-4 12-12Zm15 18c1.1 6.1 3 8 9 9-6 1-7.9 2.9-9 9-1-6.1-3-8-9-9 6-1 8-2.9 9-9Zm8-17c.7 4.3 2.1 5.7 6.4 6.4-4.3.8-5.7 2.2-6.4 6.5-.8-4.3-2.2-5.7-6.5-6.5 4.3-.7 5.7-2.1 6.5-6.4Z" fill="currentColor" stroke="none" />,
};

export default function GraphIcon({ id }: { id: string }) {
  return (
    <svg className="graph-icon" viewBox="0 0 60 52" fill="none" stroke="currentColor"
      strokeWidth="2.35" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      {artwork[id]}
    </svg>
  );
}
