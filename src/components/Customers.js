import React, { useState, useEffect } from 'react';
import api from '../api';
import '../App.css'; // Ensure to import the CSS file

function Customers() {
  const [customers, setCustomers] = useState([]);
  const [newCustomer, setNewCustomer] = useState({ customerName: '' });
  const [purchases, setPurchases] = useState([]);
  const [selectedCustomer, setSelectedCustomer] = useState(null);
  const [purchaseDetails, setPurchaseDetails] = useState({ itemName: '', quantity: '' });
  const [inventoryItems, setInventoryItems] = useState([]); // To store inventory items
  const [showModal, setShowModal] = useState(false);
  const [searchQuery, setSearchQuery] = useState(''); // State for search query

  useEffect(() => {
    api.getCustomers().then(response => setCustomers(response.data));
    api.getInventory().then(response => setInventoryItems(response.data)); // Fetch inventory items
  }, []);

  const handleAddCustomer = () => {
    if (newCustomer.customerName.trim() === '') {
      // Show alert or handle the empty input case
      alert('Customer name cannot be empty.');
      return;
    }
    api.addCustomer(newCustomer).then(response => {
      setCustomers([...customers, response.data]);
      setNewCustomer({ customerName: '' });
    });
  };

  const handleViewPurchases = (customerName) => {
    setSelectedCustomer(customerName);
    api.getCustomerPurchases(customerName).then(response => setPurchases(response.data));
    setShowModal(true);
  };

  const handlePurchaseChange = (e) => {
    setPurchaseDetails({
      ...purchaseDetails,
      [e.target.name]: e.target.value
    });
  };

  const handleAddPurchase = (customerName) => {
    const { itemName, quantity } = purchaseDetails;
    api.addPurchase({ customerName, itemName, quantity }).then(() => {
      // Refetch purchases and customer details
      api.getCustomerPurchases(customerName).then(response => setPurchases(response.data));
      api.getCustomers().then(response => {
        const updatedCustomers = response.data;
        setCustomers(updatedCustomers);
        // Update the due amount for the selected customer
        const updatedCustomer = updatedCustomers.find(c => c.customerName === customerName);
        if (updatedCustomer) {
          setSelectedCustomer(updatedCustomer.customerName);
          setPurchaseDetails({ itemName: '', quantity: '' });
        }
      });
    });
  };

  const closeModal = () => {
    setShowModal(false);
    setSelectedCustomer(null);
  };

  const filteredCustomers = customers.filter(customer =>
    customer.customerName.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div>
      <h2>Customers</h2>

      {/* Search Bar */}
      <input
        type="text"
        className="search-bar"
        placeholder="Search Customers"
        value={searchQuery}
        onChange={e => setSearchQuery(e.target.value)}
      />

      <h3>Add New Customer</h3>
      <input
        type="text"
        placeholder="Customer Name"
        value={newCustomer.customerName}
        onChange={e => setNewCustomer({ ...newCustomer, customerName: e.target.value })}
      />
      <button onClick={handleAddCustomer} disabled={newCustomer.customerName.trim() === ''}>Add Customer</button>
      <h3></h3>
      {showModal && (
        <div className="modal">
          <div className="modal-content">
            <span className="close" onClick={closeModal}>&times;</span>
            <h3>Purchases for {selectedCustomer}</h3>
            <div className="purchase-list">
              {purchases.map((purchase, index) => (
                <div key={index} className="purchase-item">
                  <span>{purchase.itemName} - {purchase.quantity} - {purchase.totalPrice}</span>
                </div>
              ))}
            </div>
            <h3>Add Purchase</h3>
            <select
              name="itemName"
              value={purchaseDetails.itemName}
              onChange={handlePurchaseChange}
            >
              <option value="">Select Item</option>
              {inventoryItems.map((item, index) => (
                <option key={index} value={item.itemName}>{item.itemName}</option>
              ))}
            </select>
            <input
              type="number"
              name="quantity"
              placeholder="Quantity"
              value={purchaseDetails.quantity}
              onChange={handlePurchaseChange}
            />
            <button onClick={() => handleAddPurchase(selectedCustomer)}>Add Purchase</button>
          </div>
        </div>
      )}

      <div className="customer-list">
        {filteredCustomers.map((customer, index) => (
          <div key={index} className="customer-item">
            <span>{customer.customerName} - {customer.totalDue}</span>
            <button onClick={() => handleViewPurchases(customer.customerName)}>View Purchases</button>
          </div>
        ))}
      </div>
    </div>
  );
}

export default Customers;
