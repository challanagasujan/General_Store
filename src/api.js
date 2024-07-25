// src/api.js
import axios from 'axios';

const api = {
  getInventory: () => axios.get('http://localhost:4000/inventory'),
  getCustomers: () => axios.get('http://localhost:4000/customers'),
  getCustomerPurchases: customerName => axios.get(`http://localhost:4000/customer/${customerName}`),
  addItem: item => axios.post('http://localhost:4000/add-item', item),
  addCustomer: customer => axios.post('http://localhost:4000/add-customer', customer),
  addPurchase: purchase => axios.post('http://localhost:4000/add-purchase', purchase),
  editItem: item => axios.put('http://localhost:4000/edit-item', item)
};

export default api;