import { motion } from 'framer-motion';

export default function Button({ 
  children, 
  variant = 'primary', 
  size = 'md', 
  loading = false, 
  icon: Icon,
  iconPosition = 'left',
  className = '',
  ...props 
}) {
  const baseClasses = 'inline-flex items-center justify-center font-semibold transition-all duration-300 transform focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed';
  
  const variants = {
    primary: 'btn-primary',
    secondary: 'btn-secondary',
    outline: 'btn-outline',
    ghost: 'btn-ghost',
  };

  const sizes = {
    sm: 'px-4 py-2 text-sm rounded-lg',
    md: 'px-6 py-3.5 text-base rounded-xl',
    lg: 'px-8 py-4 text-lg rounded-xl',
  };

  return (
    <motion.button
      whileHover={{ scale: props.disabled || loading ? 1 : 1.05 }}
      whileTap={{ scale: props.disabled || loading ? 1 : 0.95 }}
      className={`${baseClasses} ${variants[variant]} ${sizes[size]} ${className}`}
      disabled={loading}
      {...props}
    >
      {loading ? (
        <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-current"></div>
      ) : (
        <>
          {Icon && iconPosition === 'left' && <Icon className="mr-2" size={20} />}
          {children}
          {Icon && iconPosition === 'right' && <Icon className="ml-2" size={20} />}
        </>
      )}
    </motion.button>
  );
}
