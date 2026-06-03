'use client';

import Image from 'next/image';
import { isBlobImageSrc, isNextImageSrc } from '@/shared/lib/product-image';

interface ProductImageProps {
  src: string;
  alt: string;
  fill?: boolean;
  className?: string;
}

export function ProductImage({ src, alt, fill = true, className }: ProductImageProps) {
  if (isNextImageSrc(src)) {
    return <Image src={src} alt={alt} fill={fill} className={className} />;
  }

  if (isBlobImageSrc(src)) {
    return (
      // eslint-disable-next-line @next/next/no-img-element
      <img src={src} alt={alt} className={className ?? 'object-cover w-full h-full'} />
    );
  }

  return null;
}
