"use client";
import { motion, type HTMLMotionProps } from "framer-motion";

type Props = HTMLMotionProps<"div"> & { delay?: number };

export default function FadeIn({ children, delay = 0, ...rest }: Props) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.15 }}
      transition={{ duration: 0.6, ease: "easeOut", delay }}
      {...rest}
    >
      {children}
    </motion.div>
  );
}
