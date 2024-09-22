import React from 'react';
import './App.css';
import ProductList from './components/ProductList';  // Import komponen baru
// index.tsx atau App.tsx
import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap/dist/js/bootstrap.bundle.min.js';
import '@coreui/coreui/dist/css/coreui.min.css';
import { Helmet } from 'react-helmet';


function App() {
  return (
    <div className="App">
      <Helmet>
      <title>PTIEA-PROJECT</title>  {/* Nama tab yang ingin kamu tampilkan */}
      </Helmet>
      <header className="App-header">
      
        <h1>Welcome to PTIEA PROJECT</h1>
        <ProductList />  {/* Tampilkan daftar produk */}
      </header>
    </div>
  );
}

export default App;
