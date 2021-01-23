import React from 'react';
import {iItem} from './Item';

type ShoppingListProps = {
    items: iItem[];
    tickedItems: iItem[];
    deleteAllTicked: () => void;
};

const ShoppingListTicked: React.FC<ShoppingListProps> = ({items, tickedItems, deleteAllTicked}) => {
    const handleClickDeleteAllTicked = () => deleteAllTicked();

    const foundCountStr = () => {
        let nonBlankItems = items.filter(item => item.name.trim() !== '');

        return `${tickedItems.length}/${nonBlankItems.length + tickedItems.length}`

    };

    return (
        <section className="ticked-items ui grey">
            <h2>
                Found Items {foundCountStr()}
            </h2>
            <ul className="ui relaxed list">
                {tickedItems.map((item: iItem) => (
                    <li className="item" key={item.id}>
                        <del data-id={item.id}>{item.name}</del>
                    </li>
                ))}
            </ul>
                <button className="ui large red button" onClick={handleClickDeleteAllTicked}>
                    <i className="trash alternate outline icon" aria-hidden="true"></i>
                    Clear
                </button>
        </section>
    );
};

export default ShoppingListTicked;
