import React, { useEffect, useState } from 'react';
import Product from '../components/Product';
import MessageBox from '../components/MessageBox';
import { useDispatch, useSelector } from 'react-redux';
import { listProducts } from '../actions/productActions';
import { PRODUCT_REVIEW_CREATE_FAIL_RESET } from '../constants/productConstants';
import Pagination from '../components/Pagination';
import PromotionsCarousel from '../components/PromotionsCarousel';
import { sliderData } from '../utils';
import Spinner from '../components/Spinner';

export default function HomeScreen() {
  const dispatch = useDispatch();
  const productList = useSelector((state) => state.productList);
  const { loading, error, products } = productList;
  const [page, setPage] = useState(1);
  useEffect(() => {
    dispatch(listProducts({page}));
    dispatch({ type: PRODUCT_REVIEW_CREATE_FAIL_RESET });
  }, [dispatch, page]);

  return (
    <div>
      <div className="carousel__container">
         <PromotionsCarousel slides={sliderData}></PromotionsCarousel>
      </div>
      {loading ? (
        <Spinner type={"large"}></Spinner>
      ) : error ? (
        <MessageBox variant="danger">{error}</MessageBox>
      ) : (
        <>
        <div className="featuredProd__title">Featured products</div>
        <div className="row center">
          {products.results.map((product) => (
            <Product key={product._id} product={product}></Product>
          ))}
        </div>

        <Pagination pages={products.pageNumbers.length} setCurrentPage={setPage} page={page}/>

        </>
      )}
    </div>
  );
}
