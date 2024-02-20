import { type ClassValue, clsx } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export const getRelativeTime = (timestamp: number): string => {
  const now = Date.now();
  const diffInSeconds = Math.floor((now - timestamp) / 1000);
  const rtf = new Intl.RelativeTimeFormat('en', { numeric: 'auto' });

  const formatTime = (value: number, unit: Intl.RelativeTimeFormatUnit) =>
    rtf.format(-Math.floor(diffInSeconds / value), unit);

  if (diffInSeconds < 60)      return formatTime(1, 'second');
  if (diffInSeconds < 3600)    return formatTime(60, 'minute');
  if (diffInSeconds < 86400)   return formatTime(3600, 'hour');
  if (diffInSeconds < 2592000) return formatTime(86400, 'day');
  if (diffInSeconds < 31536000) return formatTime(2592000, 'month');

  return formatTime(31536000, 'year');
}


export const changeImageSize = (originalUrl: string, newSize: string): string => {
    // Split the URL into parts
    const parts = originalUrl.split('/');

    // Find and replace the part that contains the size information
   for (let i = 0; i < parts.length; i++) {
        if (parts[i]?.includes('library_')) {
            parts[i] = parts[i]?.replace(/(\d+)x(\d+)/, newSize) || "";
            break;
        }
    }

    // Join the parts back together to form the new URL
    const newUrl = parts.join('/');

    return newUrl;
}

export const formatDate = (date: Date): string => {
  const month = date.toLocaleString("en-US", { month: "short" });
  const day = date.getDate();
  const year = date.getFullYear();

  return `${day} ${month}  ${year}`;
}