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
    /**
     * On deleting an item, focus onto the previous item for super quick list management.
     * @param curItemID the curently focused item id
     */
    const focusPrevItem = (curItemID: string) => {
        let siblingIndex = items.findIndex((item) => item.id === curItemID);
        if (siblingIndex > 0) {
            let siblingItem = items[--siblingIndex];
            document.getElementById(`${siblingItem.id}_${siblingItem.name}`)?.focus();
        }
    };

    /**
     * Renders an item, wrapps in Draggable for drag-and-drop
     * @param item {iItem} - the item to render
     * @param index {number} - current position in the list of items
     */
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
                        <Item
                            item={item}
                            deleteItem={deleteItem}
                            updateItem={updateItem}
                            addNextItem={addNextItem}
                            focusPrevItem={focusPrevItem}
                        />
                    </li>
                )}
            </Draggable>
        );
    };
    return <ul className="ui relaxed list">{items.map((item: iItem, index: number) => renderItem(item, index))}</ul>;
};

export default ShoppingList;
