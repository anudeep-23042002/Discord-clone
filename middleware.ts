import { clerkMiddleware } from '@clerk/nextjs/server';

// Define paths to exclude from authentication
const excludedPaths = ['/api/','/servers']; // Add more paths as needed

// Define paths to exclude from protection in auth middleware (e.g., signin, signup)
const noProtectPaths = ['/signin', '/signup']; // Adjust as needed

// Create route matchers for excluded and non-protected paths
const isExcludedPath = (req) => excludedPaths.some(path => req.nextUrl.pathname.startsWith(path));
const isNoProtectPath = (req) => noProtectPaths.some(path => req.nextUrl.pathname.startsWith(path));

// Middleware function
export default clerkMiddleware((auth, req) => {
  // Skip authentication for paths in excludedPaths
  if (isExcludedPath(req)) {
    return;
  }

  // Apply protection for all other routes except those explicitly excluded
  if (!isNoProtectPath(req)) {
    auth().protect();
  }
});

export const config = {
  matcher: [
    // Match all API routes
    '/api/:path*',
    // Match all other routes (excluding static files and Next.js internals)
    '/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)',
  ],
};
