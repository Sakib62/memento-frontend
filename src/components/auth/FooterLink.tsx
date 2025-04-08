import React from 'react';
import { useNavigate } from 'react-router-dom';

interface FooterLinkProps {
  text: string;
  linkText: string;
  linkTo: string;
}

const FooterLink: React.FC<FooterLinkProps> = ({ text, linkText, linkTo }) => {
  const navigate = useNavigate();

  return (
    <p className='mt-4 text-center text-gray-500 text-md'>
      {text}{' '}
      <button
        onClick={() => navigate(linkTo)}
        className='font-semibold text-blue-600 transition-colors duration-200 hover:text-blue-800 hover:underline'
      >
        {linkText}
      </button>
    </p>
  );
};

export default FooterLink;
