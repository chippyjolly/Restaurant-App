import React, { useEffect, useState } from 'react';
// import { getMenu } from '../services/menuService'; // We will create this next

function Menu() {
  const [menuItems, setMenuItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    // In a real application, you would fetch data here
    // For now, let's simulate fetching data
    const fetchMenu = async () => {
      try {
        // const data = await getMenu(); // Call the service function
        // setMenuItems(data);
        // Simulate data
        setMenuItems([
          { id: 1, name: 'Pizza Margherita', description: 'Classic pizza with tomato and mozzarella', price: 12.50 },
          { id: 2, name: 'Pasta Carbonara', description: 'Spaghetti with egg, hard cheese, cured pork, and black pepper', price: 15.00 },
          { id: 3, name: 'Caesar Salad', description: 'Romaine lettuce, croutons, Parmesan cheese, and Caesar dressing', price: 9.75 },
        ]);
      } catch (err) {
        setError('Failed to fetch menu items.');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchMenu();
  }, []);

  if (loading) {
    return <div>Loading menu...</div>;
  }

  if (error) {
    return <div>Error: {error}</div>;
  }

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

export default Menu;
