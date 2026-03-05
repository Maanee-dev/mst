import { Html, Head, Main, NextScript } from 'next/document';

export default function Document() {
  return (
    <Html lang="en">
      <Head>
        <script src="https://cdn.tailwindcss.com"></script>
        <link href="https://fonts.googleapis.com/css2?family=Montserrat:wght@300;400;600;700&family=Playfair+Display:ital,wght@0,400;0,700;1,400&display=swap" rel="stylesheet" />
        <style>{`
          :root {
              --bg-parchment: #FCFAF7;
              --text-charcoal: #1A1A1A;
          }
          body { 
              font-family: 'Montserrat', sans-serif; 
              scroll-behavior: smooth;
              background-color: var(--bg-parchment);
              color: var(--text-charcoal);
              -webkit-font-smoothing: antialiased;
          }
          .font-serif { font-family: 'Playfair Display', serif; }
          .glass { background: rgba(252, 250, 247, 0.85); backdrop-filter: blur(12px); -webkit-backdrop-filter: blur(12px); }
          
          /* Custom scrollbar */
          ::-webkit-scrollbar { width: 6px; }
          ::-webkit-scrollbar-track { background: var(--bg-parchment); }
          ::-webkit-scrollbar-thumb { background: #E2E8F0; border-radius: 10px; }

          /* Animation for section entrance */
          .reveal { opacity: 0; transform: translateY(20px); transition: all 1s ease-out; }
          .reveal.active { opacity: 1; transform: translateY(0); }
        `}</style>
      </Head>
      <body className="overflow-x-hidden">
        <Main />
        <NextScript />
      </body>
    </Html>
  );
}