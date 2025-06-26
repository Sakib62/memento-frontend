import React from 'react';

export const Heading: React.FC<{ title: string }> = ({ title }) => (
  <h3 className='mb-3 text-lg font-semibold text-gray-700'>{title}</h3>
);

export interface FormInputProps {
  label: string;
  id: string;
  type: string;
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  placeholder: string;
  required?: boolean;
}

export const FormInput: React.FC<FormInputProps> = ({
  label,
  id,
  type,
  value,
  onChange,
  placeholder,
  required = false,
}) => (
  <div>
    <label htmlFor={id} className='block text-sm font-medium text-gray-600'>
      {label}
      {required && <span className='ml-1 text-base text-red-600'>*</span>}
    </label>
    <input
      type={type}
      id={id}
      value={value}
      onChange={onChange}
      className='w-full p-2 mt-1 border border-gray-400 rounded-lg md:w-3/4 focus:ring-2 focus:ring-blue-500 focus:outline-none'
      placeholder={placeholder}
      required={required}
    />
  </div>
);

export interface SubmitButtonProps {
  text: string;
  bgColor: string;
  onClick?: () => void;
  type?: 'submit' | 'button';
  disabled?: boolean;
}

export const SubmitButton: React.FC<SubmitButtonProps> = ({
  text,
  bgColor,
  onClick,
  type = 'submit',
  disabled = false,
}) => (
  <button
    type={type}
    onClick={onClick}
    className={`w-auto px-4 py-2 text-sm font-medium text-white transition-all duration-200 ${bgColor} rounded-lg shadow-sm md:px-6 hover:opacity-90 disabled:opacity-30`}
    disabled={disabled}
  >
    {text}
  </button>
);
