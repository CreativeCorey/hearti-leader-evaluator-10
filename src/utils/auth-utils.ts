
import { v4 as uuidv4 } from "uuid";

// Get or create an anonymous user ID from localStorage
export const getOrCreateAnonymousId = (): string => {
  const key = "hearti-anonymous-user-id";
  let anonymousId = localStorage.getItem(key);
  
  if (!anonymousId) {
    anonymousId = uuidv4();
    localStorage.setItem(key, anonymousId);
  }
  
  return anonymousId;
};
