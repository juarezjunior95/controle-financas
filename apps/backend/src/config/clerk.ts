import { createClerkClient, ClerkClient } from '@clerk/express';

let clerk: ClerkClient | null = null;

if (process.env.CLERK_SECRET_KEY) {
  clerk = createClerkClient({
    secretKey: process.env.CLERK_SECRET_KEY,
    publishableKey: process.env.CLERK_PUBLISHABLE_KEY,
  });
} else {
  console.warn('[Clerk] CLERK_SECRET_KEY não definida. Autenticação desabilitada.');
}

export { clerk };
