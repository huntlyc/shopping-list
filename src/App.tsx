import React, {useState, useEffect} from 'react';
import './App.css';
import ShoppingList from './components/ShoppingList';
import ShoppingListTicked from './components/ShoppingListTicked';
import AddItemForm from './components/AddItemForm';
import {iItem} from './components/Item';
import DateInfo from './components/DateInfo';
import {DragDropContext, Droppable} from 'react-beautiful-dnd';

function App() {
    const [items, setItems] = useState<iItem[]>([]);

    const isItemInList = (item: iItem, list: iItem[]) => {
        return list.find((searchItem: iItem) => item.name.toLowerCase() === searchItem.name.toLowerCase());
    };

    const deleteItemFromList = (item: iItem, list: iItem[]): iItem[] =>
        list.filter((curItem) => curItem.id !== item.id);

    const deleteAllTickedItems = () => {
        const itemsClone = items.slice(0);
        const untickedItems = itemsClone.filter((curItem) => curItem.checked !== true);

        setItems(untickedItems);
    };

    const addNewItemAfterCurrentItem = (siblingID: string) => {
        const blankItem = {
            id: new Date().getTime().toString(),
            checked: false,
            name: '',
        };

        const itemsClone = items.slice(0);
        let siblingIndex = itemsClone.findIndex((item) => item.id === siblingID);
        siblingIndex++; // Insert after, not before.

        itemsClone.splice(siblingIndex, 0, blankItem);

        setItems(itemsClone);
    };

    const changeItemOrder = (list: iItem[], startIndex: number, endIndex: number) => {
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

        const reorderedItems = changeItemOrder(items, result.source.index, result.destination.index);

        setItems(reorderedItems);
    }

    const addItemHandler = (item: iItem) => {
        let itemsClone = items.slice(0);

        // If not a blank item, check for duplication or already checked.
        if (item.name !== '') {
            // If ticked, untick
            const exitingItem = isItemInList(item, items);
            if (exitingItem) {
                exitingItem.checked = false;

                setItems(itemsClone);

                return false;
            }

            // If aleady in active items, TODO scroll to exisiting element.
            if (isItemInList(item, items)) {
                return false;
            }
        }

        // New item, not in exisiting list, add to active.
        itemsClone.push(item);
        setItems(itemsClone);
    };

    const onDeleteActiveItem = (item: iItem) => {
        setItems(deleteItemFromList(item, items.slice(0)));
    };

    const onItemUpdate = (item: iItem) => {
        let itemsClone = items.slice(0);

        const itemIndex = itemsClone.findIndex((curItem) => curItem.id === item.id);
        const curItem = itemsClone[itemIndex];

        curItem.name = item.name;
        curItem.checked = item.checked;

        if (curItem.checked && curItem.name === '') {
            itemsClone.splice(itemIndex, 1);
        }

        setItems(itemsClone);
    };

    //On load, pull from local storage
    useEffect(() => {
        const storageItems = localStorage.getItem('shopList');
        if (storageItems) {
            setItems(JSON.parse(storageItems));
        }

        // !! Deprecated: Ticked list - remove if found.
        const storageTickedItems = localStorage.getItem('shopListTicked');
        if (storageTickedItems) {
            localStorage.removeItem('shopListTicked');
        }
    }, []);

    // On list update, save to local storage.
    useEffect(() => {
        const storageItems = localStorage.getItem('shopList');

        if (storageItems) {
            localStorage.removeItem('shopList');
        }

        localStorage.setItem('shopList', JSON.stringify(items));

        // !! Deprecated: Ticked list - remove if found.
        const storageTickedItems = localStorage.getItem('shopListTicked');
        if (storageTickedItems) {
            localStorage.removeItem('shopListTicked');
        }
    }, [items]);

    // Filter out our list into ticked and unticked lists.
    let tickedItems = items.filter((curItem) => curItem.checked);
    let untickedItems = items.filter((curItem) => !curItem.checked);

    const allItemsTicked = untickedItems.length === 0 && tickedItems.length > 0;
    const emptyList = items.length === 0;

    /**
     * If no items (ticked and unticked) - prefill with a blank item placeholder which will
     * be automatically focused for input.
     **/
    if (emptyList) {
        const blankItem = {
            id: new Date().getTime().toString(),
            checked: false,
            name: '',
        };
        setItems([blankItem]);
    }

    return (
        <div className="app">
            <header className="ui segment fixed">
                <h1 className="ui header">Shopping List</h1>
                <DateInfo />
            </header>
            {allItemsTicked ? (
                <>
                    <h4 className="ui heading">All Ticked - Did you remember the treats?!</h4>
                    <img className="img--cat" src={process.env.PUBLIC_URL + '/toffo.jpg'} alt="Toffo" />
                </>
            ) : (
                <DragDropContext onDragEnd={onDragEnd}>
                    <Droppable droppableId="list">
                        {(provided) => (
                            <div ref={provided.innerRef} {...provided.droppableProps}>
                                <ShoppingList
                                    items={untickedItems}
                                    updateItem={onItemUpdate}
                                    deleteItem={onDeleteActiveItem}
                                    addNextItem={addNewItemAfterCurrentItem}
                                />
                                {provided.placeholder}
                            </div>
                        )}
                    </Droppable>
                </DragDropContext>
            )}
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
