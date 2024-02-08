import React, { useState } from "react";
import Image from "next/image";

interface Props {
  className: string;
  width: number;
  height: number;
  alt: string;
  src: string;
  fallback: string;
}

const ImageWithFallback = ({
  className,
  width,
  height,
  alt,
  src,
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
      onError={() => {
        setImgSrc(fallback);
      }}
    />
  );
};

export default ImageWithFallback;
