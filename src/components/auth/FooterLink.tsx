import React from 'react';
import { Link } from 'react-router-dom';

interface FooterLinkProps {
  text: string;
  linkText: string;
  linkTo: string;
}

const FooterLink: React.FC<FooterLinkProps> = ({ text, linkText, linkTo }) => {
  return (
    <p className='mt-4 text-center text-gray-500 text-md'>
      {text}{' '}
      <Link
        to={linkTo}
        className='font-semibold text-blue-600 transition-colors duration-200 hover:text-blue-800 hover:underline'
        replace={true}
      >
        {linkText}
      </Link>
    </p>
  );
};

export default FooterLink;
