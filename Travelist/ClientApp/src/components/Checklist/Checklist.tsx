import { useState, useEffect } from 'react';
import './checklist.css';

interface ChecklistProps {
    itemsToPack: string[],
    destinationId: number,
};

interface CheckedItems {
    [key: string]: boolean;
}

function Checklist({ itemsToPack, destinationId }: ChecklistProps) {
  const [checkedItems, setCheckedItems] = useState<CheckedItems>({});

  useEffect(() => {
    const savedCheckedItems = JSON.parse(localStorage.getItem(`checkedItems_${destinationId}`) || '{}') as CheckedItems;
    setCheckedItems(savedCheckedItems);
  }, [destinationId]);
  
  const handleCheck = (item: string) => {
    const updatedCheckedItems = {
      ...checkedItems,
      [item]: !checkedItems[item],
    };
    setCheckedItems(updatedCheckedItems);
    localStorage.setItem(`checkedItems_${destinationId}`, JSON.stringify(updatedCheckedItems));
  };

  const generateId = (item: string, id: number) => {
    const sanitizedItem = item.replace(/\s+/g, '-').toLowerCase();
    return `checkbox-${id}-${sanitizedItem}`;
  };
  
  return (
    <ul className="space-y-2">
      {itemsToPack.map((item) => {
        const checkboxId = generateId(item, destinationId);
        const isChecked = !!checkedItems[item];

        return (
          <li key={item} className="list-none">
            <label htmlFor={checkboxId} className={`flex cursor-pointer items-center space-x-3 transition duration-1000 ease-in-out ${isChecked ? 'text-green line-through' : 'text-black'}`}>
              <input
                type="checkbox"
                id={checkboxId}
                checked={isChecked}
                onChange={() => handleCheck(item)}
                className="border-gray accent-green text-green focus:ring-green checkbox-animate h-10 w-10 cursor-pointer rounded transition duration-300 ease-in-out hover:scale-110"
              />
              <span className={`strike-through text-xl ${isChecked ? 'text-green checked' : 'text-black'}`}>{item}</span>
            </label>
          </li>
        );
      })}
    </ul>
  );
}

export default Checklist;