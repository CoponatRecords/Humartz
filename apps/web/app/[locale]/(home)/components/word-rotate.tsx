"use client";

import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

interface WordRotateProps {
  words: string[];
}

const wordVariants = {
  initial: {
    y: "100%",
    opacity: 0,
  },
  animate: {
    y: "0%",
    opacity: 1,
  },
  exit: {
    y: "-100%",
    opacity: 0,
  },
};

export function WordRotate({ words }: WordRotateProps) {
  const [index, setIndex] = useState(0);

  useEffect(() => {
    if (!words || words.length === 0) return;

    const interval = setInterval(() => {
      setIndex((prev) => (prev + 1) % words.length);
    }, 2800);

    return () => clearInterval(interval);
  }, [words]);

  if (!words || words.length === 0) return null;

  return (
    <span className="relative inline-block h-[1.2em] overflow-visible align-top leading-[1.2em]">
      <AnimatePresence mode="wait">
        <motion.span
          key={words[index]}
          variants={wordVariants}
          initial="initial"
          animate="animate"
          exit="exit"
          transition={{
            duration: 0.75,
            ease: [0.22, 1, 0.36, 1],
            opacity: { duration: 0.65 },
          }}
          className="absolute left-0 top-0 whitespace-nowrap font-semibold tracking-tight text-primary"
        >
          {words[index]}
        </motion.span>
      </AnimatePresence>

      {/* Invisible placeholder for layout stability */}
      <span className="invisible font-semibold tracking-tight">
        {words.reduce((a, b) => (a.length > b.length ? a : b), "")}
      </span>
    </span>
  );
}
