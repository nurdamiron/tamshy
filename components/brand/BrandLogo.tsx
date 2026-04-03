import Image from 'next/image';

const PRESET: Record<'xs' | 'sm' | 'md' | 'lg' | 'xl', number> = {
  xs: 24,
  sm: 32,
  md: 40,
  lg: 48,
  xl: 64,
};

type BrandLogoProps = {
  size?: keyof typeof PRESET | number;
  className?: string;
  priority?: boolean;
};

export default function BrandLogo({ size = 'md', className = '', priority = false }: BrandLogoProps) {
  const px = typeof size === 'number' ? size : PRESET[size];
  return (
    <Image
      src="/logo.png"
      alt="Tamshy"
      width={px}
      height={px}
      className={`object-contain select-none ${className}`}
      priority={priority}
    />
  );
}
