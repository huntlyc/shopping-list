import React, {useState, useEffect} from 'react';
import './App.css';
import ShoppingList from './components/ShoppingList';
import AddItemForm from './components/AddItemForm';
import {iItem} from './components/Item';
import DateInfo from './components/DateInfo';

function App() {
    const [items, setItems] = useState<iItem[]>([]);

    const addItemHandler = (item: iItem) => {
        const itemsFromState = items.slice(0);
        itemsFromState.push(item);
        setItems(itemsFromState);
    };

    const onDeleteItem = (item: iItem) => {
        setItems(items.filter((curItem) => curItem.id !== item.id));
    };

    const onItemUpdate = (item: iItem) => {
        const itemsFromState = items.slice(0);
        for (let i = 0; i < itemsFromState.length; i++) {
            const curItem = itemsFromState[i];
            if (curItem.id === item.id) {
                curItem.name = item.name;
                curItem.checked = item.checked;
            }
        }

        setItems(itemsFromState);
    };

    useEffect(() => {
        const storageItems = localStorage.getItem('shopList');
        if (storageItems) {
            setItems(JSON.parse(storageItems));
        }
    }, []);

    useEffect(() => {
        const storageItems = localStorage.getItem('shopList');

        if (storageItems) {
            localStorage.removeItem('shopList');
        }

        localStorage.setItem('shopList', JSON.stringify(items));
    }, [items]);

    return (
        <div className="app">
            <h2 className="ui header">Shopping List</h2>
            <DateInfo />
            <div className="ui divider"></div>
            <ShoppingList items={items} updateItem={onItemUpdate} deleteItem={onDeleteItem} />
            <div className="ui divider"></div>
            <AddItemForm addItemHandler={addItemHandler} />
        </div>
    );
}

export default App;
