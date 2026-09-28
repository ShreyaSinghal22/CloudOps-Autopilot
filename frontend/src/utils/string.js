// src/utils/string.js

/**
 * Takes a full name and returns up to two uppercase initials.
 * Example: "Alex Johnson" -> "AJ"
 */
export function initials(name) {
  if (!name) return '';
  return name
    .split(' ')
    .map((part) => part[0])
    .join('')
    .slice(0, 2)
    .toUpperCase();
}

