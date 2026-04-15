import { AppProps } from 'next/app';
import Navigation from '../components/Navigation';
import '../styles/globals.css';

function MyApp({ Component, pageProps }: AppProps) {
  return (
    <div>
      <Navigation />
      <main className="min-h-screen bg-gray-50 py-8">
        <Component {...pageProps} />
      </main>
    </div>
  );
}

export default MyApp;