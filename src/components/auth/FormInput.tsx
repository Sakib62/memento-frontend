import React from 'react';
import { IconType } from 'react-icons';

interface FormInputProps {
  label: string;
  type: string;
  id: string;
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  placeholder: string;
  icon: IconType;
  required?: boolean;
}

const FormInput: React.FC<FormInputProps> = ({
  label,
  type,
  id,
  value,
  onChange,
  placeholder,
  icon: Icon,
  required = true,
}) => {
  return (
    <div>
      <label htmlFor={id} className='block text-sm font-semibold text-gray-700'>
        {label}
      </label>
      <div className='relative'>
        <Icon className='absolute text-xl text-gray-600 -translate-y-1.5 left-2 top-1/2' />
        <input
          type={type}
          id={id}
          value={value}
          onChange={onChange}
          className='w-full p-3 pl-8 mt-2 text-gray-800 transition-all duration-200 border border-gray-600 rounded-lg shadow-sm focus:ring-2 focus:ring-blue-500 focus:outline-none focus:border-blue-500'
          placeholder={placeholder}
          required={required}
        />
      </div>
    </div>
  );
};

export default FormInput;
