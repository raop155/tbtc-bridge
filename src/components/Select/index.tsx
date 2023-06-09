/* eslint-disable @typescript-eslint/no-explicit-any */
import { Dispatch } from 'react';
import { Listbox } from '@headlessui/react';
import { FaChevronDown } from 'react-icons/fa';

type Props = {
  items: { id: string | number; name: string; disabled: boolean }[];
  label?: string;
  value: any;
  setValue: Dispatch<any>;
};

const Select = ({ items, value, setValue, label }: Props) => {
  return (
    <Listbox value={value} onChange={setValue}>
      <div className='flex-1'>
        {label && <Listbox.Label>{label}</Listbox.Label>}
        <div className='relative'>
          <Listbox.Button className='flex items-center justify-center w-full gap-2 px-4 py-2 text-black bg-white rounded'>
            {value.name} <FaChevronDown />
          </Listbox.Button>
          <Listbox.Options className='absolute w-full overflow-hidden text-black bg-white rounded shadow-2xl top-13'>
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
      </div>
    </Listbox>
  );
};

export default Select;
