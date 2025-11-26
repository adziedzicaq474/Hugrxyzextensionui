import { motion } from 'framer-motion';

export function Hero() {
  return (
    <section className="px-4 py-12">
      <motion.div
        className="space-y-6"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <div className="space-y-4">
          <h1 className="text-3xl font-semibold leading-tight tracking-tight">
            Automate DeFi like a Pro
          </h1>
          <p className="text-base leading-relaxed text-gray-700">
            Build, test, and deploy strategies in minutes.
          </p>
        </div>
      </motion.div>
    </section>
  );
}