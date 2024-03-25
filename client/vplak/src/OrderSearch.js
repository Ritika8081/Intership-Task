import React, { useState } from 'react';
import './App.css';

function OrderSearch() {
  const [searchType, setSearchType] = useState('order_id');
  const [searchValue, setSearchValue] = useState('');
  const [searchResult, setSearchResult] = useState([]);

  const handleSearchTypeChange = (event) => {
    setSearchType(event.target.value);
  };

  const handleSearchInputChange = (event) => {
    setSearchValue(event.target.value);
  };

  const handleSearchOrder = () => {
    fetch('http://localhost:8000/api/orders/search', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ type: searchType, value: searchValue }),
    })
      .then(response => response.json())
      .then(data => {
        console.log(data); // Check the format of data received
        setSearchResult(data); // Update state with response data
      })
      .catch(error => console.error('Error:', error));
  };

  return (
    <div className="order-search-container">
      <h1>Search Order</h1>
      <div className="search-options">
        <h2>by</h2>
        <div className="search-options-radio">
          <input type="radio" id="order_id" name="searchType" value="order_id" checked={searchType === 'order_id'} onChange={handleSearchTypeChange} />
          <label htmlFor="order_id">Order ID</label>

          <input type="radio" id="mobile" name="searchType" value="mobile" checked={searchType === 'mobile'} onChange={handleSearchTypeChange} />
          <label htmlFor="mobile">Mobile</label>

          <input type="radio" id="name" name="searchType" value="name" checked={searchType === 'name'} onChange={handleSearchTypeChange} />
          <label htmlFor="name">Name</label>

          <input type="radio" id="email" name="searchType" value="email" checked={searchType === 'email'} onChange={handleSearchTypeChange} />
          <label htmlFor="email">Email</label>
        </div>

        <input type="text" value={searchValue} onChange={handleSearchInputChange} placeholder="Enter search term" />

        <button onClick={handleSearchOrder}>Search Order</button>
      </div>

      <div className="search-results">
  {searchResult && Array.isArray(searchResult) && searchResult.length > 0 ? (
    <div>
      <h2>Search Results</h2>
      <ul>
        {/* Column headings */}
        <li>
          <div className="heading">Order Date</div>
          <div className="heading">Mode of Payment</div>
          <div className="heading">Customer Detail</div>
          <div className="heading">Payment Status</div>
          <div className="heading">Track</div>
          <div className="heading">Generate Invoice</div>
        </li>

        {/* Data rows */}
        {searchResult.map(order => (
          <li key={order.order_id}>
            <div>{order.order_date}</div>
            <div className="mode-of-payment-button">{order.mode_of_payment}</div>
            <div>{`ID: ${order.buyer_details.cus_id}, Address: ${order.buyer_details.addresss}, Email: ${order.buyer_details.email}, Phone: ${order.buyer_details.phone}, Pincode: ${order.buyer_details.pincode}`}</div>
            <div>{order.payment_status}</div>
            <div><button className="track-button">Track</button></div>
            <div><a className="generate-invoice-link" href="#">Generate Invoice</a></div>
          </li>
        ))}
      </ul>
    </div>
  ): (
          <div>No results found</div>
        )}
        <div className="product-details-container">
    {searchResult && Array.isArray(searchResult) && searchResult.length > 0 && (
      <div>
       
        <ul>
          {searchResult.map(order => (
            <li key={order.order_id}>
              <div>Product Name: {order.product.name}</div>
              <div>Quantity: {order.product.qty}</div>
              <div>Price Rate: {order.product.price_rate}</div>
              <div>Delivery Charge: {order.product.delivery_charge}</div>
              <div>Product Date: {order.product.date}</div>
              <div>Product Status: {order.product.status}</div>
              <div>Discount: {order.product.discount}</div>
            </li>
          ))}
        </ul>
      </div>
    )}
  </div>

      </div>
      
    </div>
  );
}

export default OrderSearch;
