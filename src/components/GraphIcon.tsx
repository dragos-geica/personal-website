import type { ReactNode } from 'react';

const artwork: Record<string, ReactNode> = {
  experience: <>
    <rect x="7" y="16" width="46" height="30" rx="4" />
    <path d="M22 16v-4a3 3 0 0 1 3-3h10a3 3 0 0 1 3 3v4M7 28h46M26 28v4h8v-4" />
  </>,
  projects: <path d="m17 15-11 10 11 10m26-20 11 10-11 10M35 9 24 41" />,
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
