import React from 'react';
import { iItem, Item } from './Item';

type ShoppingListProps = {
    items: iItem[];
    updateItem: (item:iItem) => void;
    deleteItem: (item:iItem) => void;
};


const ShoppingList:React.FC<ShoppingListProps> = ({items, updateItem, deleteItem}) => {
    return(
        <div className="ui relaxed list">
            {items.map((item) => <div className="item" key={item.id}><Item item={item} deleteItem={deleteItem} updateItem={updateItem} /></div>)}
        </div>
    )
}

export default ShoppingList;