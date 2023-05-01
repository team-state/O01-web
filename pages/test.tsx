import { Inter } from 'next/font/google';

const inter = Inter({ subsets: ['latin'] });

const Test = () => {
  return (
    <main
      className={`flex min-h-screen flex-col items-center justify-between p-24 ${inter.className}`}
    >
      <div>test</div>
    </main>
  );
};

export default Test;
