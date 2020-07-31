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
    addNextItem: (siblingID: string) => void;
}
export const Item: React.FC<ItemProps> = ({item, updateItem, deleteItem, addNextItem}) => {
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

            if (item.name === '') {
                if (inputRef.current) {
                    inputRef.current.focus();
                }
            }
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

    const handleEnterPress = (e: React.KeyboardEvent) => {
        e.persist();

        if (e.keyCode === 13 && inputRef && inputRef.current && inputRef.current.getAttribute('data-id')) {
            // Add a new item underneath
            const dataID = inputRef.current.getAttribute('data-id') as string;
            addNextItem(dataID);
            inputRef.current.blur();
        }

        if (e.keyCode === 8 && name === '' && checkboxRef && checkboxRef.current) {
            checkboxRef.current.checked = true;
            setItemChecked(true);
        }
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
                <input
                    id={`${id}_${name}`}
                    data-id={id}
                    type="text"
                    ref={inputRef}
                    value={name}
                    onChange={onItemNameChange}
                    onKeyUp={handleEnterPress}
                />
                <button className="ui red right icon button" onClick={handleDelete}>
                    <i className="trash alternate outline icon" aria-hidden="true"></i>
                    <span className="sr-only">Delete Item</span>
                </button>
                <i className="drag-marker big grey ellipsis vertical icon"></i>
            </div>
        </>
    );
};
