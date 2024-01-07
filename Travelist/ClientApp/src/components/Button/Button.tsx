/* eslint-disable react/button-has-type */
interface ButtonProps { 
  title: string,
  handleClick?: () => void,
  type?: 'button' | 'submit' | 'reset';
  theme: 'green' | 'gray' | 'black',
  className?: string,
  children?: React.ReactNode,
}

const themeClassNames = {
  green: 'bg-green text-white hover:bg-green-hover',
  gray: 'bg-gray text-black hover:bg-gray-hover',
  black: 'bg-black text-white hover:bg-black-hover',
};

export default function Button ({ title, handleClick, type, theme, className, children }: ButtonProps) {
  return (
    <button className={`${themeClassNames[theme]} ${className} rounded-full px-4 py-1 transition-all`} type={type} onClick={handleClick}>
      {title}
      {children}
    </button>
  );
};

Button.defaultProps = {
  type: 'button',
  handleClick: () => { },
  className: '',
  children: null,
};