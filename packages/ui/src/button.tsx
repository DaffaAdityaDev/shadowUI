import './styles.css';

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  children: React.ReactNode;
}

export function Button({ children, className = '', ...other }: ButtonProps): JSX.Element {
  return (
    <button 
      type="button" 
      className={`px-4 py-2 bg-red-500 text-white rounded hover:bg-blue-600 ${className}`}
      {...other}
    >
      {children}
    </button>
  );
}

Button.displayName = "Button";