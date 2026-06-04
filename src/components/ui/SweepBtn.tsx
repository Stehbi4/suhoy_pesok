import { Link } from 'react-router-dom';
import { ArrowUpRight } from 'lucide-react';

interface Props {
  to?: string;
  href?: string;
  children: string;
  light?: boolean;
  className?: string;
}

const BASE = 'group relative inline-flex items-center gap-2.5 overflow-hidden px-7 py-3 text-[0.78rem] font-semibold uppercase tracking-[0.09em] whitespace-nowrap transition-colors duration-500';
const DARK = 'border border-[rgba(26,26,27,0.22)] text-[#1A1A1B] hover:text-white hover:border-[#f80000]';
const LIGHT = 'border border-[rgba(255,255,255,0.2)] text-[rgba(255,255,255,0.55)] hover:text-white hover:border-[rgba(255,255,255,0.35)]';

export const SweepBtn = ({ to, href, children, light = false, className = '' }: Props) => {
  const cls = `${BASE} ${light ? LIGHT : DARK} ${className}`;
  const inner = (
    <>
      <span
        className="absolute inset-0 origin-left scale-x-0 transition-transform duration-500 ease-[cubic-bezier(0.25,0.46,0.45,0.94)] group-hover:scale-x-100 bg-[#f80000]"
        aria-hidden
      />
      <span className="relative z-10">{children}</span>
      <ArrowUpRight
        className="relative z-10 w-4 h-4 transition-transform duration-500 group-hover:translate-x-0.5 group-hover:-translate-y-0.5"
        strokeWidth={1.5}
      />
    </>
  );

  if (href) {
    return <a href={href} className={cls} target="_blank" rel="noopener noreferrer">{inner}</a>;
  }
  return <Link to={to!} className={cls}>{inner}</Link>;
};
