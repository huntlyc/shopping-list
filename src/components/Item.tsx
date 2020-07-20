import React, {useState, useEffect, useRef} from 'react';

export interface iItem {
    id: string;
    checked: boolean;
    name: string;
}

interface ItemProps {
    item: iItem;
    updateItem: (item: iItem) => void;
    deleteItem: (item: iItem) => void;
}
export const Item: React.FC<ItemProps> = ({item, updateItem, deleteItem}) => {
    const id = item.id;
    const [name, setItemName] = useState<string>('');
    const [checked, setItemChecked] = useState<boolean>(false);
    const checkboxRef = useRef<HTMLInputElement>(null);
    const inputRef = useRef<HTMLInputElement>(null);

    useEffect(() => {
        let isActive = true;
        if (isActive) {
            setItemName(item.name);
            setItemChecked(item.checked);
        }

        return () => {
            isActive = false;
        };
    }, [item]);

    useEffect(() => {
        if (item.name !== name || item.checked !== checked) {
            updateItem({
                id,
                name,
                checked,
            });
        }
    }, [name, checked, updateItem, id, item]);

    const onItemCheckChange = (e: React.FormEvent) => {
        setItemChecked((e.target as HTMLInputElement).checked);
    };

    const onItemNameChange = (e: React.FormEvent) => {
        setItemName((e.target as HTMLInputElement).value);
    };

    const handleDelete = (e: React.FormEvent) => {
        e.preventDefault();
        deleteItem({
            id,
            name,
            checked,
        });
    };

    return (
        <>
            <div className="ui checkbox">
                <input type="checkbox" ref={checkboxRef} checked={item.checked} onChange={onItemCheckChange} />
                <label aria-label="Check/Uncheck Item"></label>
            </div>
            <div className="ui action input">
                <label htmlFor={`${id}_${name}`} className="sr-only">
                    Item
                </label>
                <input id={`${id}_${name}`} type="text" ref={inputRef} value={name} onChange={onItemNameChange} />
                <button className="ui red right icon button" onClick={handleDelete}>
                    <i className="trash alternate outline icon" aria-hidden="true"></i>
                    <span className="sr-only">Delete Item</span>
                </button>
            </div>
        </>
    );
};
