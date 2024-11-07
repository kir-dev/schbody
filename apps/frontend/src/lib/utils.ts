import { type ClassValue, clsx } from 'clsx';
import { decode, JwtPayload } from 'jsonwebtoken';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export const getRoleFromJwt = (jwtToken?: string): string => {
  if (!jwtToken) {
    return 'UNAUTHORIZED';
  }
  try {
    const dataFromjwt = decode(jwtToken);

    if (typeof dataFromjwt === 'string') {
      return 'UNAUTHORIZED';
    }
    const payload: JwtPayload = dataFromjwt as JwtPayload;
    if ((payload.exp || 0) < new Date().getTime() / 1000) {
      return 'UNAUTHORIZED';
    }
    return dataFromjwt?.role || 'UNAUTHORIZED';
  } catch (e) {
    return 'UNAUTHORIZED';
  }
};
