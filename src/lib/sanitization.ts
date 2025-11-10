import xss from "xss";
import validator from "validator";

/**
 * Sanitize string input to prevent XSS attacks
 */
export const sanitizeString = (input: string | undefined | null): string => {
  if (!input) return "";
  
  // Remove any script tags and dangerous HTML
  const sanitized = xss(input, {
    whiteList: {}, // No HTML tags allowed
    stripIgnoreTag: true,
    stripIgnoreTagBody: ["script", "style"],
  });
  
  return sanitized.trim();
};

/**
 * Sanitize HTML content while allowing safe tags
 */
export const sanitizeHTML = (input: string | undefined | null): string => {
  if (!input) return "";
  
  // Allow only safe HTML tags for rich text content
  const sanitized = xss(input, {
    whiteList: {
      p: ["style"],
      br: [],
      strong: [],
      b: [],
      em: [],
      i: [],
      u: [],
      ul: [],
      ol: [],
      li: [],
      span: ["style"],
      div: ["style"],
      h1: [],
      h2: [],
      h3: [],
      h4: [],
      h5: [],
      h6: [],
    },
    stripIgnoreTag: true,
    stripIgnoreTagBody: ["script", "style"],
  });
  
  return sanitized.trim();
};

/**
 * Validate and sanitize email
 */
export const sanitizeEmail = (email: string | undefined | null): string => {
  if (!email) return "";
  
  const sanitized = sanitizeString(email);
  
  if (!validator.isEmail(sanitized)) {
    throw new Error("Invalid email format");
  }
  
  return validator.normalizeEmail(sanitized) || sanitized;
};

/**
 * Validate and sanitize URL
 */
export const sanitizeURL = (url: string | undefined | null): string => {
  if (!url) return "";
  
  const sanitized = sanitizeString(url);
  
  if (!validator.isURL(sanitized)) {
    throw new Error("Invalid URL format");
  }
  
  return sanitized;
};

/**
 * Sanitize number input
 */
export const sanitizeNumber = (input: any): number | null => {
  if (input === null || input === undefined || input === "") return null;
  
  const num = Number(input);
  
  if (isNaN(num)) {
    throw new Error("Invalid number format");
  }
  
  return num;
};

/**
 * Sanitize boolean input
 */
export const sanitizeBoolean = (input: any): boolean => {
  if (typeof input === "boolean") return input;
  if (typeof input === "string") {
    return input.toLowerCase() === "true" || input === "1";
  }
  return Boolean(input);
};

/**
 * Sanitize an array of strings
 */
export const sanitizeStringArray = (arr: any[]): string[] => {
  if (!Array.isArray(arr)) return [];
  
  return arr.map((item) => {
    if (typeof item === "string") {
      return sanitizeString(item);
    }
    return "";
  }).filter(item => item.length > 0);
};

/**
 * Sanitize object recursively
 */
export const sanitizeObject = (obj: any): any => {
  if (!obj || typeof obj !== "object") return obj;
  
  if (Array.isArray(obj)) {
    return obj.map(item => sanitizeObject(item));
  }
  
  const sanitized: any = {};
  
  for (const key in obj) {
    if (obj.hasOwnProperty(key)) {
      const value = obj[key];
      
      if (typeof value === "string") {
        sanitized[key] = sanitizeString(value);
      } else if (typeof value === "object") {
        sanitized[key] = sanitizeObject(value);
      } else {
        sanitized[key] = value;
      }
    }
  }
  
  return sanitized;
};

/**
 * Validate string length
 */
export const validateLength = (
  input: string,
  fieldName: string,
  minLength: number,
  maxLength: number
): void => {
  if (input.length < minLength) {
    throw new Error(`${fieldName} must be at least ${minLength} characters long`);
  }
  
  if (input.length > maxLength) {
    throw new Error(`${fieldName} must not exceed ${maxLength} characters`);
  }
};
