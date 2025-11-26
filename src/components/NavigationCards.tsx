import { Sparkles, LayoutDashboard } from 'lucide-react';
import { motion } from 'framer-motion';

interface NavigationCardsProps {
  onStartBuilding: () => void;
  onDashboard: () => void;
}

export function NavigationCards({ onStartBuilding, onDashboard }: NavigationCardsProps) {
  const cards = [
    {
      icon: Sparkles,
      title: 'Start Building',
      caption: 'Create new strategy',
      isPrimary: true,
      onClick: onStartBuilding,
    },
    {
      icon: LayoutDashboard,
      title: 'Dashboard',
      caption: 'Manage deployed bots',
      isPrimary: false,
      onClick: onDashboard,
    },
  ];

  return (
    <section className="px-4 py-8">
      <div className="flex flex-col gap-4">
        {cards.map((card, index) => {
          const Icon = card.icon;
          return (
            <motion.button
              key={index}
              onClick={card.onClick}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              className={`w-full rounded-xl p-5 transition-all hover:scale-[1.01] hover:shadow-md active:scale-[0.98] focus:outline-none focus:ring-2 focus:ring-black cursor-pointer min-h-[44px] ${
                card.isPrimary
                  ? 'bg-[#feee7d]'
                  : 'bg-white border border-gray-200'
              }`}
            >
              <div className="flex items-center gap-4">
                <div className="shrink-0">
                  <Icon className="w-6 h-6 text-black" />
                </div>
                <div className="flex-1 text-left">
                  <h3 className="text-[20px] leading-tight">{card.title}</h3>
                  <p className="text-[16px] leading-relaxed text-gray-700">
                    {card.caption}
                  </p>
                </div>
              </div>
            </motion.button>
          );
        })}
      </div>
    </section>
  );
}