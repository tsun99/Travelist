import { UseFormRegister, FieldError } from 'react-hook-form';

interface FormInputProps {
  label: string;
  id: string;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  register: UseFormRegister<any>;
  requiredMessage: string;
  placeholder?: string;
  error?: FieldError;
}

export default function FormInput({ label, id, register, requiredMessage, placeholder, error }: FormInputProps) {
  return (
    <div className="form-control py-3">
      <label className="mb-2 block text-sm font-bold text-gray-700" htmlFor={id}>
        {label}
      </label>
      <input
        className="border-gray-hover focus:border-green focus:ring-green w-full rounded-lg border-2 p-3 focus:outline-none focus:ring-2"
        type="text"
        id={id}
        placeholder={placeholder}
        // eslint-disable-next-line react/jsx-props-no-spreading
        {...register(id, {
          required: {
            value: true,
            message: requiredMessage,
          },
        })}
      />
      <p className="error" style={{ color: 'red', fontSize: '14px', textAlign: 'left', fontWeight: 'bold' }}>
        {error?.message}
      </p>
    </div>
  );
}

FormInput.defaultProps = {
  error: '',
  placeholder: '',
};