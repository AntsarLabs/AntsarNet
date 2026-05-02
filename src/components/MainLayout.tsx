import React from 'react';
import { GlobalBackground } from './GlobalBackground';
import { TopHeader } from './TopHeader';
import { BottomNav } from './BottomNav';
import { Footer } from './Footer';

interface MainLayoutProps {
  children: React.ReactNode;
  showHeader?: boolean;
  showBackground?: boolean;
  showFooter?: boolean;
  showBottomNav?: boolean;
  headerClassName?: string;
}

export const MainLayout: React.FC<MainLayoutProps> = ({
  children,
  showHeader = true,
  showBackground = true,
  showFooter = true,
  showBottomNav = true,
  headerClassName = ""
}) => {
  return (
    <div className="min-h-screen w-full flex flex-col text-foreground font-sans selection:bg-pink-500/30 overflow-x-hidden relative">
      {showBackground && <GlobalBackground />}

      <div className="relative z-10 flex flex-col min-h-screen">
        {showHeader && (
          <div className={headerClassName}>
            <TopHeader />
          </div>
        )}

        <main className="flex-1 w-full flex flex-col relative">
          {children}
        </main>

        {showBottomNav && <BottomNav />}
        {showFooter && <Footer />}
      </div>
    </div>
  );
};
