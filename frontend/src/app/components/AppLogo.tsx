'use client';

type Props = {
  /** Use compact size inside fixed full-screen views (e.g. roadmap) */
  compact?: boolean;
  /** Use large size for hero (e.g. above MBA Roadmap on landing) */
  large?: boolean;
  className?: string;
};

const sizeClasses = {
  /* Compact: small on mobile to avoid overlapping card, large from sm+ */
  compact: 'h-12 w-12 sm:h-48 sm:w-48 md:h-56 md:w-56',
  default: 'h-28 w-28 sm:h-32 sm:w-32',
  large: 'h-64 w-64 sm:h-80 sm:w-80',
};

export function AppLogo({ compact, large, className = '' }: Props) {
  const size = large ? sizeClasses.large : compact ? sizeClasses.compact : sizeClasses.default;
  return (
    <img
      src="/logo.png"
      alt="ITM Business School"
      className={`object-contain object-center ${size} ${className}`}
      width={large ? 320 : compact ? 224 : 128}
      height={large ? 320 : compact ? 224 : 128}
    />
  );
}
