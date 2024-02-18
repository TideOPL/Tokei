import React, { useState } from "react";
import Image from "next/image";

interface Props {
  className: string;
  width?: number;
  height?: number;
  alt: string;
  src: string;
  fill?: boolean;
  fallback: string;
}

const ImageWithFallback = ({
  className,
  width,
  height,
  alt,
  src,
  fill = false,
  fallback,
}: Props) => {
  const [imgSrc, setImgSrc] = useState(src);

  return (
    <Image
      src={imgSrc}
      className={className}
      width={width}
      height={height}
      alt={alt}
      fill={fill}
      onError={() => {
        setImgSrc(fallback);
      }}
    />
  );
};

export default ImageWithFallback;
