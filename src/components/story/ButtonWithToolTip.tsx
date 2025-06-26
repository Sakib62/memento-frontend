import React from 'react';

interface ButtonWithTooltipProps {
  icon: React.ReactNode;
  tooltipText: string;
  onClick: () => void;
  buttonClass?: string;
}

const ButtonWithTooltip: React.FC<ButtonWithTooltipProps> = ({
  icon,
  tooltipText,
  onClick,
  buttonClass = '',
}) => {
  const defaultClass = 'group';

  return (
    <button onClick={onClick} className={`${defaultClass} ${buttonClass}`}>
      {icon}
      <span className='absolute invisible px-2 py-1 text-sm text-white -translate-x-1/2 bg-black rounded-md opacity-0 group-active:opacity-0 dark:text-black dark:bg-white group-hover:visible group-hover:opacity-100 -top-8 left-1/2'>
        {tooltipText}
      </span>
    </button>
  );
};

export default ButtonWithTooltip;
