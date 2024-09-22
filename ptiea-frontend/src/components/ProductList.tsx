import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { CTable, CTableHead, CTableRow, CTableHeaderCell, CTableBody, CTableDataCell } from '@coreui/react';
import { Modal, Button, Form } from 'react-bootstrap';
import { toast, ToastContainer } from 'react-toastify';
import Pagination from 'react-paginate';
import 'react-toastify/dist/ReactToastify.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import '@coreui/coreui/dist/css/coreui.min.css';

interface Product {
  id: number;
  product_name: string;
  category: string;
  price: number;
  discount: number | null;
}

const ProductList: React.FC = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [filteredProducts, setFilteredProducts] = useState<Product[]>([]);
  const [newProduct, setNewProduct] = useState<Product>({
    id: 0,
    product_name: '',
    category: '',
    price: 0,
    discount: null,
  });
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [productToDelete, setProductToDelete] = useState<Product | null>(null);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [showFormModal, setShowFormModal] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [pageNumber, setPageNumber] = useState(0);

  const productsPerPage = 5;
  const pagesVisited = pageNumber * productsPerPage;

  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    try {
      const response = await axios.get('http://localhost:8000/api/products');
      setProducts(response.data);
      setFilteredProducts(response.data); // Set initial filtered products
    } catch (error) {
      console.error('Error fetching products:', error);
    }
  };

  const createProduct = async () => {
    try {
      const response = await axios.post('http://localhost:8000/api/products', newProduct);
      setProducts([...products, response.data]);
      setFilteredProducts([...products, response.data]); // Update filtered list
      setNewProduct({ id: 0, product_name: '', category: '', price: 0, discount: null });
      setShowFormModal(false);  // Close the modal after creation
      toast.success('Product created successfully!');
    } catch (error) {
      console.error('Error creating product:', error);
      toast.error('Error creating product');
    }
  };

  const updateProduct = async () => {
    if (editingProduct) {
      try {
        const response = await axios.put(`http://localhost:8000/api/products/${editingProduct.id}`, editingProduct);
        setProducts(products.map((product) => product.id === editingProduct.id ? response.data : product));
        setFilteredProducts(products.map((product) => product.id === editingProduct.id ? response.data : product));
        setEditingProduct(null);
        setShowFormModal(false);  // Close the modal after update
        toast.success('Product updated successfully!');
      } catch (error) {
        console.error('Error updating product:', error);
        toast.error('Error updating product');
      }
    }
  };

  const confirmDelete = async () => {
    if (productToDelete) {
      try {
        await axios.delete(`http://localhost:8000/api/products/${productToDelete.id}`);
        setProducts(products.filter((product) => product.id !== productToDelete.id));
        setFilteredProducts(filteredProducts.filter((product) => product.id !== productToDelete.id));
        toast.success('Product deleted successfully!');
        setShowDeleteModal(false);  // Close modal after delete
      } catch (error) {
        console.error('Error deleting product:', error);
        toast.error('Error deleting product');
      }
    }
  };

  const handleShowDeleteModal = (product: Product) => {
    setProductToDelete(product);
    setShowDeleteModal(true);
  };

  const handleEditProduct = (product: Product) => {
    setEditingProduct(product);
    setShowFormModal(true);
  };

  // Filter products based on search term
  useEffect(() => {
    const filtered = products.filter((product) => 
      product.product_name.toLowerCase().includes(searchTerm.toLowerCase()) || 
      product.category.toLowerCase().includes(searchTerm.toLowerCase())
    );
    setFilteredProducts(filtered);
    setPageNumber(0); // Reset to first page after filtering
  }, [searchTerm, products]);

  // Pagination logic
  const displayProducts = filteredProducts.slice(pagesVisited, pagesVisited + productsPerPage);
  const pageCount = Math.ceil(filteredProducts.length / productsPerPage);
  const changePage = ({ selected }: { selected: number }) => {
    setPageNumber(selected);
  };

  return (
    <div className="container mt-4">
      <h2>Product List</h2>

      <Button
        variant="success"
        className="mb-3"
        onClick={() => {
          // Reset form for new product
          setNewProduct({ id: 0, product_name: '', category: '', price: 0, discount: null });
          setEditingProduct(null);  // Clear the editing state
          setShowFormModal(true);  // Show the modal
        }}
      >
        Add New Product
      </Button>

      <Form.Group controlId="search" className="mb-3">
        <Form.Control 
          type="text" 
          placeholder="Search products..." 
          value={searchTerm} 
          onChange={(e) => setSearchTerm(e.target.value)} 
        />
      </Form.Group>

      {/* CTable for listing products */}
      <CTable bordered>
        <CTableHead>
          <CTableRow>
            <CTableHeaderCell>ID</CTableHeaderCell>
            <CTableHeaderCell>Product Name</CTableHeaderCell>
            <CTableHeaderCell>Category</CTableHeaderCell>
            <CTableHeaderCell>Price</CTableHeaderCell>
            <CTableHeaderCell>Discount</CTableHeaderCell>
            <CTableHeaderCell>Actions</CTableHeaderCell>
          </CTableRow>
        </CTableHead>
        <CTableBody>
          {displayProducts.map((product) => (
            <CTableRow key={product.id}>
              <CTableDataCell>{product.id}</CTableDataCell>
              <CTableDataCell>{product.product_name}</CTableDataCell>
              <CTableDataCell>{product.category}</CTableDataCell>
              <CTableDataCell>
                {`$${!isNaN(parseFloat(String(product.price))) ? parseFloat(String(product.price)).toFixed(2) : '0.00'}`}
              </CTableDataCell>
              <CTableDataCell>{product.discount ? `${product.discount}%` : 'No Discount'}</CTableDataCell>
              <CTableDataCell>
                <Button variant="warning" size="sm" className="me-2" onClick={() => handleEditProduct(product)}>
                  Edit
                </Button>
                <Button variant="danger" size="sm" onClick={() => handleShowDeleteModal(product)}>
                  Delete
                </Button>
              </CTableDataCell>
            </CTableRow>
          ))}
        </CTableBody>
      </CTable>

      {/* Pagination */}
      <Pagination
        previousLabel={'← Previous'}
        nextLabel={'Next →'}
        pageCount={pageCount}
        onPageChange={changePage}
        containerClassName={'pagination'}
        previousLinkClassName={'previous-page'}
        nextLinkClassName={'next-page'}
        disabledClassName={'pagination-disabled'}
        activeClassName={'pagination-active'}
      />

      {/* Modal for delete confirmation */}
      <Modal show={showDeleteModal} onHide={() => setShowDeleteModal(false)}>
        <Modal.Header closeButton>
          <Modal.Title>Confirm Delete</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          Are you sure you want to delete <strong>{productToDelete?.product_name}</strong>?
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowDeleteModal(false)}>
            Cancel
          </Button>
          <Button variant="danger" onClick={confirmDelete}>
            Delete
          </Button>
        </Modal.Footer>
      </Modal>

      {/* Modal for create/edit form */}
      <Modal show={showFormModal} onHide={() => setShowFormModal(false)}>
        <Modal.Header closeButton>
          <Modal.Title>{editingProduct ? 'Edit Product' : 'Create New Product'}</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form>
            <Form.Group className="mb-3">
              <Form.Label>Product Name</Form.Label>
              <Form.Control
                type="text"
                placeholder="Enter product name"
                value={editingProduct ? editingProduct.product_name : newProduct.product_name}
                onChange={(e) =>
                  editingProduct
                    ? setEditingProduct({ ...editingProduct, product_name: e.target.value })
                    : setNewProduct({ ...newProduct, product_name: e.target.value })
                }
              />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Category</Form.Label>
              <Form.Control
                type="text"
                placeholder="Enter category"
                value={editingProduct ? editingProduct.category : newProduct.category}
                onChange={(e) =>
                  editingProduct
                    ? setEditingProduct({ ...editingProduct, category: e.target.value })
                    : setNewProduct({ ...newProduct, category: e.target.value })
                }
              />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Price</Form.Label>
              <Form.Control
                type="number"
                placeholder="Enter price"
                value={editingProduct ? editingProduct.price : newProduct.price}
                onChange={(e) => {
                  const value = parseFloat(e.target.value);
                  editingProduct
                    ? setEditingProduct({ ...editingProduct, price: isNaN(value) ? 0 : value })
                    : setNewProduct({ ...newProduct, price: isNaN(value) ? 0 : value });
                }}
              />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Discount</Form.Label>
              <Form.Control
                type="number"
                placeholder="Enter discount"
                value={editingProduct ? editingProduct.discount || '' : newProduct.discount || ''}
                onChange={(e) => {
                  const value = parseFloat(e.target.value);
                  editingProduct
                    ? setEditingProduct({ ...editingProduct, discount: isNaN(value) ? null : value })
                    : setNewProduct({ ...newProduct, discount: isNaN(value) ? null : value });
                }}
              />
            </Form.Group>
          </Form>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowFormModal(false)}>
            Cancel
          </Button>
          <Button variant="success" onClick={editingProduct ? updateProduct : createProduct}>
            {editingProduct ? 'Update Product' : 'Create Product'}
          </Button>
        </Modal.Footer>
      </Modal>

      <ToastContainer />
    </div>
  );
};

export default ProductList;
