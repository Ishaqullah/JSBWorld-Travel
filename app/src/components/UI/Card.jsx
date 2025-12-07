import { motion } from 'framer-motion';

export default function Card({ 
  children, 
  hover = false, 
  glass = false,
  className = '',
  ...props 
}) {
  const baseClasses = 'rounded-xl overflow-hidden';
  const glassClasses = glass ? 'glass' : 'bg-white shadow-lg';
  const hoverClasses = hover ? 'card-hover cursor-pointer' : '';

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className={`${baseClasses} ${glassClasses} ${hoverClasses} ${className}`}
      {...props}
    >
      {children}
    </motion.div>
  );
}
