import { useState } from 'react';
import { Listbox } from '@headlessui/react';
import { FaChevronDown } from 'react-icons/fa';

type Props = {
  items: { id: string | number; name: string; disabled: boolean }[];
  label?: string;
};

const Select = ({ items, label }: Props) => {
  const [selectedPerson, setSelectedPerson] = useState(items[0] || '');

  return (
    <Listbox value={selectedPerson} onChange={setSelectedPerson}>
      {label && <Listbox.Label>{label}</Listbox.Label>}
      <div className='relative'>
        <Listbox.Button className='flex items-center justify-center w-full gap-2 px-4 py-2 mb-1 text-black bg-white rounded'>
          {selectedPerson.name} <FaChevronDown />
        </Listbox.Button>
        <Listbox.Options className='absolute w-full overflow-hidden text-black bg-white rounded shadow-xs'>
          {items?.length > 0 &&
            items.map((item) => {
              const { id, name, disabled } = item;
              return (
                <Listbox.Option key={id} value={item} disabled={disabled}>
                  {({ selected }) => (
                    <div
                      className={`px-4 py-1 cursor-pointer hover:bg-blue-700 hover:text-white ${
                        selected && 'bg-blue-700 text-white'
                      }`}
                    >
                      {name}
                    </div>
                  )}
                </Listbox.Option>
              );
            })}
        </Listbox.Options>
      </div>
    </Listbox>
  );
};

export default Select;
