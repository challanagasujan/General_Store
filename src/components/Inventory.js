import React, { useState, useEffect } from 'react';
import api from '../api';
import '../App.css'; // Ensure to import the CSS file

function Inventory() {
  const [items, setItems] = useState([]);
  const [newItem, setNewItem] = useState({ itemName: '', price: '' });
  const [selectedItem, setSelectedItem] = useState(null);
  const [newPrice, setNewPrice] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    api.getInventory().then(response => setItems(response.data));
  }, []);

  const handleAddItem = () => {
    if (newItem.itemName.trim() === '' || newItem.price.trim() === '') {
      // Show alert or handle the empty input case
      alert('Item name and price cannot be empty.');
      return;
    }
    api.addItem(newItem).then(response => {
      setItems([...items, response.data]);
      setNewItem({ itemName: '', price: '' });
    });
  };

  const handleEditItem = (item) => {
    setSelectedItem(item);
    setNewPrice(item.price);
    setShowModal(true);
  };

  const saveEditItem = () => {
    api.editItem({ itemName: selectedItem.itemName, newPrice }).then(() => {
      setItems(items.map(item => (item.itemName === selectedItem.itemName ? { ...item, price: newPrice } : item)));
      setShowModal(false);
      setSelectedItem(null);
      setNewPrice('');
    });
  };

  const closeModal = () => {
    setShowModal(false);
    setSelectedItem(null);
    setNewPrice('');
  };

  const filteredItems = items.filter(item => item.itemName.toLowerCase().includes(searchQuery.toLowerCase()));

  return (
    <div>
      <h2>Inventory</h2>
      <input
        type="text"
        placeholder="Search Inventory"
        value={searchQuery}
        onChange={e => setSearchQuery(e.target.value)}
        className="search-bar"
      />

      <h3>Add New Item</h3>
      <input
        type="text"
        placeholder="Item Name"
        value={newItem.itemName}
        onChange={e => setNewItem({ ...newItem, itemName: e.target.value })}
      />
      <input
        type="text"
        placeholder="Price"
        value={newItem.price}
        onChange={e => setNewItem({ ...newItem, price: e.target.value })}
      />
      <button onClick={handleAddItem} disabled={newItem.itemName.trim() === '' || newItem.price.trim() === ''}>Add Item</button>
      <h3></h3>
      {showModal && (
        <div className="modal">
          <div className="modal-content">
            <span className="close" onClick={closeModal}>&times;</span>
            <h3>Edit Item</h3>
            <p>{selectedItem.itemName}</p>
            <input
              type="text"
              placeholder="New Price"
              value={newPrice}
              onChange={e => setNewPrice(e.target.value)}
            />
            <button onClick={saveEditItem}>Save</button>
          </div>
        </div>
      )}
      <div className="inventory-list">
        {filteredItems.map((item, index) => (
          <div key={index} className="inventory-item">
            <span>{item.itemName} - {item.price}</span>
            <button onClick={() => handleEditItem(item)}>Edit</button>
          </div>
        ))}
      </div>
    </div>
  );
}

export default Inventory;
