import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import {
  createProduct,
  deleteProduct,
  listProducts,
} from '../actions/productActions';
import LoadingBox from '../components/LoadingBox';
import MessageBox from '../components/MessageBox';
import {
  PRODUCT_CREATE_RESET,
  PRODUCT_DELETE_RESET,
} from '../constants/productConstants';
import Pagination from '../components/Pagination';


export default function ProductListScreen(props) {
  document.title = "List of Products"
  const productList = useSelector((state) => state.productList);
  const { loading, error, products } = productList;
  const [page, setPage] = useState(1);
  const productCreate = useSelector((state) => state.productCreate);
  const {
    loading: loadingCreate,
    error: errorCreate,
    success: successCreate,
    product: createdProduct,
  } = productCreate;


  const productDelete = useSelector((state) => state.productDelete);
  const {
    loading: loadingDelete,
    error: errorDelete,
    success: successDelete,
  } = productDelete;

  const dispatch = useDispatch();
  useEffect(() => {
    if (successCreate) {
      dispatch({ type: PRODUCT_CREATE_RESET });
      props.history.push(`/product/${createdProduct._id}/edit`);
    }
    if (successDelete) {
      dispatch({ type: PRODUCT_DELETE_RESET });
    }
    dispatch(listProducts({page}));
  }, [createdProduct, dispatch, props.history, successCreate, successDelete, page]);

  const deleteHandler = (product) => {
    if (window.confirm('Are you sure to delete?')) {
      dispatch(deleteProduct(product._id));
    }
  };


  return (
    <div className="admin-list">
      <div className="createproduct-btn-container">
       <button 
        type="button" 
        className="primary smallscreens-createproduct-btn"  
        onClick={() => {
          props.history.push(`/products/create`)
        }}
        >
          Create Product
        </button>
      </div>
      

      {loadingDelete && <LoadingBox></LoadingBox>}
      {errorDelete && <MessageBox variant="danger">{errorDelete}</MessageBox>}

      {loadingCreate && <LoadingBox></LoadingBox>}
      {errorCreate && <MessageBox variant="danger">{errorCreate}</MessageBox>}
      {loading ? (
        <LoadingBox></LoadingBox>
      ) : error ? (
        <MessageBox variant="danger">{error}</MessageBox>
      ) : (
        <>
        <table className="table products">
          <thead>
            <tr>
              <th>ID</th>
              <th>NAME</th>
              <th>PRICE</th>
              <th>CATEGORY</th>
              <th>BRAND</th>
              <th>ACTIONS</th>
            </tr>
          </thead>
          <tbody>
            {products.results.map((product) => (
              <tr key={product._id}>
                <td className="smallscreens-table-td-products">{product._id}</td>
                <td className="smallscreens-table-td-products">{product.name}</td>
                <td className="smallscreens-table-td-products">{product.price.toFixed(2)}</td>
                <td className="smallscreens-table-td-products">{product.category}</td>
                <td className="smallscreens-table-td-products">{product.brand}</td>
                <td className="smallscreens-table-td-products">
                  <button
                    type="button"
                    className="small"
                    onClick={() =>
                      props.history.push(`/product/${product._id}/edit`)
                    }
                  >
                    Edit
                  </button>
                  <button
                    type="button"
                    className="small"
                    onClick={() => deleteHandler(product)}
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        {products.pageNumbers &&
        <>
        {products.pageNumbers.length !== 1 &&
        <Pagination pages={products.pageNumbers.length} setCurrentPage={setPage} page={page}/>
        }
        </>
        }
        </>
      )}

    </div>
  );
}
