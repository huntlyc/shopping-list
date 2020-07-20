import React from 'react';
import {iItem, Item} from './Item';

type ShoppingListProps = {
    items: iItem[];
    updateItem: (item: iItem) => void;
    deleteItem: (item: iItem) => void;
};

const ShoppingList: React.FC<ShoppingListProps> = ({items, updateItem, deleteItem}) => {
    return (
        <ul className="ui relaxed list">
            {items.map((item) => (
                <li className="item" key={item.id}>
                    <Item item={item} deleteItem={deleteItem} updateItem={updateItem} />
                </li>
            ))}
        </ul>
    );
};

export default ShoppingList;
