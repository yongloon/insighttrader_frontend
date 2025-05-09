import type { AppProps } from 'next/app';
import '../styles/globals.css'; // Import your global CSS (including Tailwind directives)

/**
 * MyApp Component
 *
 * This is the top-level component that Next.js uses to initialize pages.
 * It wraps every page in your application. You can use this component to:
 * - Persist layout between page changes
 * - Keep state when navigating pages
 * - Inject additional data into pages
 * - Add global CSS (as done here)
 *
 * For the MVP, its primary role is to import global styles.
 *
 * @param {AppProps} props - Props passed to the component, including Component and pageProps.
 * @param {React.ComponentType} props.Component - The active page component.
 * @param {object} props.pageProps - The initial props that were preloaded for the page.
 */
function MyApp({ Component, pageProps }: AppProps) {
  // If you had a global layout component (e.g., for a consistent navbar/sidebar across all pages),
  // you would wrap the <Component {...pageProps} /> with it here.
  // For example:
  // return (
  //   <GlobalLayout>
  //     <Component {...pageProps} />
  //   </GlobalLayout>
  // );

  // For the MVP, we're keeping it simple.
  return <Component {...pageProps} />;
}

export default MyApp;