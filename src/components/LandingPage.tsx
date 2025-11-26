import { Hero } from './Hero';
import { NavigationCards } from './NavigationCards';
import { Footer } from './Footer';

interface LandingPageProps {
  onStartBuilding: () => void;
  onDashboard: () => void;
}

export function LandingPage({ onStartBuilding, onDashboard }: LandingPageProps) {
  return (
    <div className="min-h-screen bg-white flex flex-col">
      {/* Fixed Header */}
      <header className="fixed top-0 left-0 right-0 z-50 bg-white border-b border-gray-200">
        <div className="px-4 py-4">
          <h1 className="text-[24px] leading-tight">HUGR.xyz</h1>
        </div>
      </header>

      {/* Scrollable Content */}
      <main className="flex-1 pt-[72px] pb-8">
        <Hero />
        <NavigationCards
          onStartBuilding={onStartBuilding}
          onDashboard={onDashboard}
        />
      </main>

      {/* Footer */}
      <Footer />
    </div>
  );
}