import { eKeyCache } from 'src/config/keyCache.enum';
import { v4 as uuidv4 } from 'uuid';
export const generateUUID = () => {
  return uuidv4();
};

export const formatCacheKey = (
  keyTemplate: eKeyCache,
  params: Record<string, string | number>,
): string => {
  let result = keyTemplate as string;
  for (const [key, value] of Object.entries(params)) {
    result = result.replace(`{{${key}}}`, String(value));
  }
  return result;
};
