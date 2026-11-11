export default function NodeOutline({ className = 'branch-node-outline' }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 100 100" aria-hidden="true">
      <path d="M 99 50 A 49 49 0 0 0 1 50" pathLength={1} />
      <path d="M 99 50 A 49 49 0 0 1 1 50" pathLength={1} />
    </svg>
  );
}
