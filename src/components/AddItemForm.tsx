import React, {useRef, useState} from 'react';
import {iItem} from './Item';

type AddItemFormProps = {
    addItemHandler: (item: iItem) => void;
};

const AddItemForm: React.FC<AddItemFormProps> = ({addItemHandler}) => {
    const itemNameRef = useRef<HTMLInputElement>(null);
    const [itemName, setItemName] = useState('');

    const onSubmitHandler = (e: React.FormEvent) => {
        e.preventDefault();

        const newItem: iItem = {
            id: new Date().getTime().toString(),
            checked: false,
            name: itemName,
        };

        addItemHandler(newItem);

        // Clear input and retain focus
        setItemName(''); // Clear the input by seting the name state to: ''
        if (itemNameRef && itemNameRef.current) {
            itemNameRef.current.focus();
        }

        return false;
    };

    const onNameInput = (e: React.FormEvent) => {
        setItemName((e.target as HTMLInputElement).value);
    };

    return (
        <form className="ui segment addItemForm" onSubmit={onSubmitHandler}>
            <div className="ui fluid action input">
                <label htmlFor="newItem" className="sr-only">
                    Item Name
                </label>
                <input
                    onChange={onNameInput}
                    ref={itemNameRef}
                    type="text"
                    name="newItem"
                    id="newItem"
                    value={itemName}
                />
                <button className="ui teal right labeled icon button">
                    <i className="cart plus icon" aria-hidden="true"></i>Add
                </button>
            </div>
        </form>
    );
};

export default AddItemForm;
