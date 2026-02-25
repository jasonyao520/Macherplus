import './globals.css';
import { AudioProvider } from '../components/AudioContext';
import { AuthProvider } from '../components/AuthContext';

export const metadata = {
  title: 'Marché+ | Plateforme alimentaire accessible de Côte d\'Ivoire',
  description: 'Connectez fournisseurs et commerçants dans le secteur alimentaire en Côte d\'Ivoire. Audio-first, accessible, simple.',
  keywords: 'marché, Côte d\'Ivoire, fournisseurs, commerçants, alimentaire, accessible, audio',
};

export default function RootLayout({ children }) {
  return (
    <html lang="fr">
      <head>
        <meta name="viewport" content="width=device-width, initial-scale=1, maximum-scale=1" />
        <meta name="theme-color" content="#E07A2F" />
        <link rel="icon" href="/favicon.ico" />
      </head>
      <body>
        <AuthProvider>
          <AudioProvider>
            {children}
          </AudioProvider>
        </AuthProvider>
      </body>
    </html>
  );
}
