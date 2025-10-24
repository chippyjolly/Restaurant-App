import React, { useEffect, useState } from "react";


function Menu() {
    const [menuItems, setMenuItems] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {

        const fetchMenu = async () => {
            try {
                setMenuItems([
                    { id: 1, name: 'Pizza Margherita', descrption: 'Classic pizza with tomato and mozzarella', price: 12.50 },
                    { id: 2, name: 'Pasta Carbonara', descrption: 'Spaghetti with egg, hard cheese, cured pork, and black pepper', price: 15.00 },
                    { id: 3, name: 'Caesar Salad', descrption: 'Romaine lettuce, croutons, Parmesan cheese, and Caesar dressing', price: 9.75 },
                ]);
            } catch (error) {
                setError('Failed to fetch menu items.');
                console.error(err);
            } finally {
                setLoading(false);
            }
        };
        fetchMenu();
    }, []);

    if (loading) {
        return <div>Loading Menu...</div>;
    }
    if (error) {
        return (
            <div className="menu-page">
                <h1>Our Menu</h1>
                <div className="menu-list">
                    {menuItems.map(item => (
                        <div key={item.id} className="menu-item">
                            <h2>{item.name}</h2>
                            <p>{item.description}</p>
                            <p>${item.price.toFixed(2)}</p>
                        </div>
                    ))}
                </div>
            </div>
        );
    }
}

export default Menu;