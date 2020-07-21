import React, {useState, useEffect} from 'react';
import './App.css';
import ShoppingList from './components/ShoppingList';
import ShoppingListTicked from './components/ShoppingListTicked';
import AddItemForm from './components/AddItemForm';
import {iItem} from './components/Item';
import DateInfo from './components/DateInfo';
import {DragDropContext, Droppable} from 'react-beautiful-dnd';

function App() {
    const [activeItems, setActiveItems] = useState<iItem[]>([]);
    const [tickedItems, setTickedItems] = useState<iItem[]>([]);

    const isInList = (item: iItem, list: iItem[]) =>
        list.find((searchItem: iItem) => item.name.toLowerCase() === searchItem.name.toLowerCase());
    const deleteFromList = (item: iItem, list: iItem[]): iItem[] => list.filter((curItem) => curItem.id !== item.id);
    const deleteAllTickedItems = () => setTickedItems([]);

    const reorder = (list: iItem[], startIndex: number, endIndex: number) => {
        const result = Array.from(list);
        const [removed] = result.splice(startIndex, 1);
        result.splice(endIndex, 0, removed);

        return result;
    };

    function onDragEnd(result: any) {
        if (!result.destination) {
            return;
        }

        if (result.destination.index === result.source.index) {
            return;
        }

        const reorderredActiveItems = reorder(activeItems, result.source.index, result.destination.index);

        setActiveItems(reorderredActiveItems);
    }

    const addItemHandler = (item: iItem) => {
        let activeItemsClone = activeItems.slice(0);
        let tickedItemsClone = tickedItems.slice(0);

        // If in ticked items, untick and move into active items
        const exitingItem = isInList(item, tickedItems);
        if (exitingItem) {
            exitingItem.checked = false;
            setTickedItems(deleteFromList(exitingItem, tickedItemsClone));

            activeItemsClone.push(exitingItem);
            setActiveItems(activeItemsClone);

            return false;
        }

        // If aleady in active items, TODO scroll to exisiting element
        if (isInList(item, activeItems)) {
            return false;
        }

        // new item, not in exisiting list, add to active
        activeItemsClone.push(item);
        setActiveItems(activeItemsClone);
    };

    const onDeleteActiveItem = (item: iItem) => {
        setActiveItems(deleteFromList(item, activeItems.slice(0)));
    };

    const onItemUpdate = (item: iItem) => {
        let itemsFromState = activeItems.slice(0);
        let tickedItemsFromState = tickedItems.slice(0);

        for (let i = 0; i < itemsFromState.length; i++) {
            const curItem = itemsFromState[i];
            if (curItem.id === item.id) {
                curItem.name = item.name;
                curItem.checked = item.checked;
            }
        }

        // If ticked switch from active list to ticked list
        if (item.checked) {
            tickedItemsFromState.unshift(item);
            itemsFromState = deleteFromList(item, itemsFromState);
        }

        setActiveItems(itemsFromState);
        setTickedItems(tickedItemsFromState);
    };

    //On load, pull from local storage
    useEffect(() => {
        //Active items
        const storageActiveItems = localStorage.getItem('shopList');
        if (storageActiveItems) {
            setActiveItems(JSON.parse(storageActiveItems));
        }

        //Ticked list
        const storageTickedItems = localStorage.getItem('shopListTicked');
        if (storageTickedItems) {
            setTickedItems(JSON.parse(storageTickedItems));
        }
    }, []);

    // On list update, save to local storage
    useEffect(() => {
        // Active items
        const storageActiveItems = localStorage.getItem('shopList');

        if (storageActiveItems) {
            localStorage.removeItem('shopList');
        }

        localStorage.setItem('shopList', JSON.stringify(activeItems));

        // Ticked items
        const storageTickedItems = localStorage.getItem('shopListTicked');
        if (storageTickedItems) {
            localStorage.removeItem('shopListTicked');
        }

        localStorage.setItem('shopListTicked', JSON.stringify(tickedItems));
    }, [activeItems, tickedItems]);

    return (
        <div className="app">
            <header className="ui segment fixed">
                <h1 className="ui header">Shopping List</h1>
                <DateInfo />
            </header>
            <DragDropContext onDragEnd={onDragEnd}>
                <Droppable droppableId="list">
                    {(provided) => (
                        <div ref={provided.innerRef} {...provided.droppableProps}>
                            <ShoppingList
                                items={activeItems}
                                updateItem={onItemUpdate}
                                deleteItem={onDeleteActiveItem}
                            />
                            {provided.placeholder}
                        </div>
                    )}
                </Droppable>
            </DragDropContext>
            {tickedItems.length > 0 && (
                <>
                    <div className="ui divider"></div>
                    <ShoppingListTicked items={tickedItems} deleteAllTicked={deleteAllTickedItems} />
                </>
            )}
            <AddItemForm addItemHandler={addItemHandler} />
        </div>
    );
}

export default App;
