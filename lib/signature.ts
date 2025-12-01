/**
 * Cryptographic signature utilities for share URLs
 * Prevents tampering with share link parameters
 * 
 * NOTE: This is a client-side integrity check for a static site (GitHub Pages).
 * Since there's no backend, the secret is embedded in the client code.
 * This prevents casual URL tampering but determined attackers can forge signatures.
 * For a static site deployment, this provides reasonable protection against
 * common tampering attempts while maintaining the no-backend architecture.
 */

// Secret key for signing (in production, this should be an environment variable)
// For static site deployment, this is embedded but prevents casual tampering
const SIGNATURE_SECRET = process.env.NEXT_PUBLIC_SIGNATURE_SECRET || 'js-quizzy-share-secret-key-2024';

/**
 * Generate a cryptographic signature for share URL parameters
 * @param userId - User ID
 * @param score - Score string (e.g., "18/20")
 * @param timestamp - Timestamp in milliseconds
 * @returns Promise resolving to base64-encoded signature
 */
export async function signShareUrl(
  userId: string,
  score: string,
  timestamp: number
): Promise<string> {
  // Create the message to sign: userId + score + timestamp + secret
  const message = `${userId}|${score}|${timestamp}|${SIGNATURE_SECRET}`;
  
  // Use Web Crypto API for HMAC-SHA256
  const encoder = new TextEncoder();
  const data = encoder.encode(message);
  const key = await crypto.subtle.importKey(
    'raw',
    encoder.encode(SIGNATURE_SECRET),
    { name: 'HMAC', hash: 'SHA-256' },
    false,
    ['sign']
  );
  
  const signature = await crypto.subtle.sign('HMAC', key, data);
  
  // Convert to base64url for URL-safe encoding
  const bytes = new Uint8Array(signature);
  let binary = '';
  for (let i = 0; i < bytes.length; i++) {
    binary += String.fromCharCode(bytes[i]);
  }
  return btoa(binary)
    .replace(/\+/g, '-')
    .replace(/\//g, '_')
    .replace(/=/g, '');
}

/**
 * Verify a cryptographic signature for share URL parameters
 * @param userId - User ID
 * @param score - Score string (e.g., "18/20")
 * @param timestamp - Timestamp in milliseconds
 * @param signature - Base64-encoded signature to verify
 * @returns Promise resolving to true if signature is valid
 */
export async function verifyShareUrl(
  userId: string,
  score: string,
  timestamp: number,
  signature: string
): Promise<boolean> {
  try {
    // Generate expected signature
    const expectedSignature = await signShareUrl(userId, score, timestamp);
    
    // Compare signatures (constant-time comparison)
    if (expectedSignature.length !== signature.length) {
      return false;
    }
    
    let result = 0;
    for (let i = 0; i < expectedSignature.length; i++) {
      result |= expectedSignature.charCodeAt(i) ^ signature.charCodeAt(i);
    }
    
    return result === 0;
  } catch (error) {
    console.error('Signature verification error:', error);
    return false;
  }
}

/**
 * Check if a timestamp is still valid (not too old)
 * @param timestamp - Timestamp in milliseconds
 * @param maxAge - Maximum age in milliseconds (default: 1 year)
 * @returns true if timestamp is valid
 */
export function isTimestampValid(timestamp: number, maxAge: number = 365 * 24 * 60 * 60 * 1000): boolean {
  const now = Date.now();
  const age = now - timestamp;
  return age >= 0 && age <= maxAge;
}

