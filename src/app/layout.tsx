import type { Metadata } from 'next';
import { Inter, JetBrains_Mono, Merriweather } from 'next/font/google';
import { Tooltip } from 'radix-ui';
import './globals.css';

const inter = Inter({
  subsets: ['latin', 'cyrillic'],
  variable: '--font-inter',
});

const jetbrainsMono = JetBrains_Mono({
  subsets: ['latin', 'cyrillic'],
  variable: '--font-jetbrains-mono',
});

const merriweather = Merriweather({
  subsets: ['latin', 'cyrillic'],
  weight: ['300', '400', '700'],
  variable: '--font-merriweather',
});

export const metadata: Metadata = {
  title: 'StoryEngine',
  description: 'IDE for Storytelling',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html
      lang="en"
      className={`${inter.variable} ${jetbrainsMono.variable} ${merriweather.variable} dark`}
    >
      <body>
        <Tooltip.Provider delayDuration={300}>
          {children}
        </Tooltip.Provider>
      </body>
    </html>
  );
}
