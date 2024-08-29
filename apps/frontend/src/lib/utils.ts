import { type ClassValue, clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}
export const getRoleFromJwt = (jwt?: string): string => {
  const dataFromjwt = jwt ? JSON.parse(atob(jwt.split('.')[1])) : null;
  return dataFromjwt ? dataFromjwt.role : 'UNAUTHORIZED';
};
