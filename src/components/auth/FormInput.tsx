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
  error?: string;
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
  error,
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
          className={`w-full bg-gray-50 p-3 pl-8 mt-2 text-gray-800 transition-all duration-200 border ${error ? 'border-red-500 focus:border-red-500 focus:ring-red-500' : 'border-gray-300 focus:border-blue-500 focus:ring-blue-500'} rounded-lg shadow-sm focus:ring-1 focus:outline-none `}
          placeholder={placeholder}
          required={required}
        />
      </div>
      <p
        className={`text-sm h-5 ${error ? 'text-red-600' : 'text-transparent'}`}
      >
        {error || 'Placeholder'}
      </p>
    </div>
  );
};

export default FormInput;
