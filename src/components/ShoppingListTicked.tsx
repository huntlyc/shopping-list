import React from 'react';
import {iItem} from './Item';

type ShoppingListProps = {
    items: iItem[];
    deleteAllTicked: () => void;
};

const ShoppingListTicked: React.FC<ShoppingListProps> = ({items, deleteAllTicked}) => {
    const handleClickDeleteAllTicked = () => deleteAllTicked();

    return (
        <section className="ticked-items ui grey">
            <h2>
                Found Items{' '}
                <button className="ui red label" onClick={handleClickDeleteAllTicked}>
                    <i className="trash alternate outline icon" aria-hidden="true"></i>
                    Clear
                </button>
            </h2>
            <ul className="ui relaxed list">
                {items.map((item: iItem) => (
                    <li className="item" key={item.id}>
                        <del data-id={item.id}>{item.name}</del>
                    </li>
                ))}
            </ul>
        </section>
    );
};

export default ShoppingListTicked;
