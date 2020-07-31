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

    const isInList = (item: iItem, list: iItem[]) =>
        list.find((searchItem: iItem) => item.name.toLowerCase() === searchItem.name.toLowerCase());
    const deleteFromList = (item: iItem, list: iItem[]): iItem[] => list.filter((curItem) => curItem.id !== item.id);
    const deleteAllTickedItems = () => setActiveItems(activeItems.filter((curItem) => curItem.checked !== false));

    const addNextItem = (siblingID: string) => {
        const blankItem = {
            id: new Date().getTime().toString(),
            checked: false,
            name: '',
        };

        const activeItemsClone = activeItems.slice(0);
        let siblingIndex = activeItemsClone.findIndex((item) => item.id === siblingID);
        siblingIndex++; // Insert after, not before.

        activeItemsClone.splice(siblingIndex, 0, blankItem);

        setActiveItems(activeItemsClone);
    };

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

        // If not a blank item, check for duplication or already checked.
        if (item.name !== '') {
            // If ticked, untick
            const exitingItem = isInList(item, activeItems);
            if (exitingItem) {
                exitingItem.checked = false;

                setActiveItems(activeItemsClone);

                return false;
            }

            // If aleady in active items, TODO scroll to exisiting element
            if (isInList(item, activeItems)) {
                return false;
            }
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

        for (let i = 0; i < itemsFromState.length; i++) {
            const curItem = itemsFromState[i];
            if (curItem.id === item.id) {
                curItem.name = item.name;
                curItem.checked = item.checked;
            }
        }

        setActiveItems(itemsFromState);
    };

    //On load, pull from local storage
    useEffect(() => {
        //Active items
        const storageActiveItems = localStorage.getItem('shopList');
        if (storageActiveItems) {
            setActiveItems(JSON.parse(storageActiveItems));
        }

        //Deprecated: Ticked list - remove if found.
        const storageTickedItems = localStorage.getItem('shopListTicked');
        if (storageTickedItems) {
            localStorage.removeItem('shopListTicked');
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
    }, [activeItems]);

    let untickedItems = activeItems.filter((curItem) => !curItem.checked);
    let tickedItems = activeItems.filter((curItem) => curItem.checked);
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
                                items={untickedItems}
                                updateItem={onItemUpdate}
                                deleteItem={onDeleteActiveItem}
                                addNextItem={addNextItem}
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
