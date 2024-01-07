/* eslint-disable react/jsx-no-bind */
import { useState, ChangeEvent } from 'react';
import { FieldError } from 'react-hook-form';

import Button from '../Button/Button.tsx';

interface ItemsToPackInputProps { 
  value: string;
  onChange: (items: string) => void;
  error?: FieldError;
  placeholder: string;
  label: string;
  id: string;
}

interface ItemToPackProps { 
  title: string,
  removeItem: () => void,
}

function ItemToPack({ title, removeItem, }: ItemToPackProps) { 
  return (
    <div className='my-5 flex w-full justify-between rounded-lg p-2 shadow-sm'>
      <li>
        {title}
      </li><Button className='rounded-lg font-semibold' title='X' theme='gray' handleClick={removeItem} />
    </div>
  );
}

export default function ItemsToPackInput({ value, onChange, error, placeholder, label, id }: ItemsToPackInputProps) { 
  const [currentInput, setCurrentInput] = useState('');
  const itemsArray = value ? value.split(',').map(item => item.trim()).filter(item => item) : [];

  function handleOnChange(e: ChangeEvent<HTMLInputElement>) {
    setCurrentInput(e.target.value);
  }

  function handleItemAdd() {
    if (currentInput.trim().length > 0) { 
      const newItemsArray = [...itemsArray, currentInput.trim()];
      setCurrentInput(''); 
      onChange(newItemsArray.join(', ')); 
    }
  }

  function removeItem(index: number) {
    const newItemsArray = itemsArray.filter((_, i) => i !== index);
    onChange(newItemsArray.join(', '));
  }

  return (
    <div>
      <div className='relative flex flex-col items-end gap-4 sm:flex-row'>
        <div className=' w-full'>
          <label className="mb-2 block text-sm font-bold text-gray-700" htmlFor={id}>
            {label}
          </label>
          <input 
            className='border-gray-hover focus:border-green focus:ring-green  w-full rounded-lg border-2 p-3 focus:outline-none focus:ring-2'
            onChange={handleOnChange} 
            value={currentInput} 
            type="text" 
            placeholder={placeholder}
          />
        </div>

        <Button className=' h-[3.2rem] w-full min-w-[7rem]  rounded-lg sm:w-auto' title='Add Item' theme='black' handleClick={handleItemAdd} />
      </div>
      {itemsArray.length > 0 && (
        <ul>
          {itemsArray.map((item, index) => (
            <ItemToPack 
              removeItem={() => removeItem(index)} 
              key={index} 
              title={item} 
            />
          ))}
        </ul>
      )}
      {error && <p className='text-red font-bold'>{error.message}</p>}
    </div>
  );
}

ItemsToPackInput.defaultProps = {
  error: ''
};