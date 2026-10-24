import { motion } from "motion/react";

const GeneratingAnimation = () => {
  return (
    <div className="flex w-full justify-start mb-6">
      <div className="flex items-center gap-3 rounded-2xl border border-white/[0.06] bg-[#1a1b20] px-4 py-3">
        {/* Animated AI indicator */}
        <div className="relative flex h-8 w-8 items-center justify-center">
          <motion.div
            className="absolute inset-0 rounded-full bg-indigo-500/20"
            animate={{ scale: [1, 1.35, 1], opacity: [0.6, 0, 0.6] }}
            transition={{
              duration: 2,
              repeat: Infinity,
              ease: "easeInOut",
            }}
          />

          <motion.div
            className="h-2.5 w-2.5 rounded-full bg-indigo-400 shadow-[0_0_12px_rgba(129,140,248,0.8)]"
            animate={{ scale: [1, 1.2, 1] }}
            transition={{
              duration: 1.2,
              repeat: Infinity,
              ease: "easeInOut",
            }}
          />
        </div>

        {/* Thinking text */}
        <div className="flex items-center gap-1.5">
          <motion.span
            className="text-sm font-medium text-slate-300"
            animate={{ opacity: [0.55, 1, 0.55] }}
            transition={{
              duration: 1.8,
              repeat: Infinity,
              ease: "easeInOut",
            }}
          >
            AI is thinking
          </motion.span>

          <div className="flex items-center gap-0.5">
            {[0, 1, 2].map((dot) => (
              <motion.span
                key={dot}
                className="h-1 w-1 rounded-full bg-indigo-400"
                animate={{ opacity: [0.25, 1, 0.25], y: [0, -3, 0] }}
                transition={{
                  duration: 0.8,
                  repeat: Infinity,
                  delay: dot * 0.18,
                  ease: "easeInOut",
                }}
              />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default GeneratingAnimation;