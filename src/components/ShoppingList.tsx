import React from 'react';
import {Item, iItem} from './Item';
import {Draggable} from 'react-beautiful-dnd';

type ShoppingListProps = {
    items: iItem[];
    updateItem: (item: iItem) => void;
    deleteItem: (item: iItem) => void;
    addNextItem: (siblingID: string) => void;
};

const ShoppingList: React.FC<ShoppingListProps> = ({items, updateItem, deleteItem, addNextItem}) => {
    const renderItem = (item: iItem, index: number) => {
        const indexProp = {index};
        return (
            <Draggable key={item.id} draggableId={item.id} index={index}>
                {(provided) => (
                    <li
                        className="item"
                        ref={provided.innerRef}
                        {...provided.draggableProps}
                        {...provided.dragHandleProps}
                        {...indexProp}
                        key={item.id}
                    >
                        <Item item={item} deleteItem={deleteItem} updateItem={updateItem} addNextItem={addNextItem} />
                    </li>
                )}
            </Draggable>
        );
    };
    return <ul className="ui relaxed list">{items.map((item: iItem, index: number) => renderItem(item, index))}</ul>;
};

export default ShoppingList;
