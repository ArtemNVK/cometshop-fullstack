import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Link, useParams } from 'react-router-dom';
import { listProducts } from '../actions/productActions';
import LoadingBox from '../components/LoadingBox';
import MessageBox from '../components/MessageBox';
import Product from '../components/Product';
import Rating from '../components/Rating';
import { prices, ratings } from '../utils';
import Pagination from '../components/Pagination';
import { BsFilterLeft } from 'react-icons/bs';
import Spinner from '../components/Spinner';
 
export default function SearchScreen(props) {
  document.title = "Search"
  const {
    name = 'all',
    category = 'all',
    min = 0,
    max = 0,
    rating = 0,
    order = 'newest',
  } = useParams();
  const dispatch = useDispatch();
  const productList = useSelector((state) => state.productList);
  const { loading, error, products } = productList; 
  const productCategoryList = useSelector((state) => state.productCategoryList);
  const {
    loading: loadingCategories,
    error: errorCategories,
    categories,
  } = productCategoryList;
  const [page, setPage] = useState(1);
  const [isFiltersOpen, setIsFiltersOpen] = useState(false);


  useEffect(() => {
    dispatch(
      listProducts({
        page,
        name: name !== 'all' ? name : '',
        category: category !== 'all' ? category : '',
        min,
        max,
        rating,
        order,
      })
    );
  }, [category, dispatch, max, min, name, order, rating, page]);
  const getFilterUrl = (filter) => {
    const filterCategory = filter.category || category;
    const filterName = filter.name || name;
    const filterRating = filter.rating || rating;
    const sortOrder = filter.order || order;
    const filterMin = filter.min ? filter.min : filter.min === 0 ? 0 : min;
    const filterMax = filter.max ? filter.max : filter.max === 0 ? 0 : max;
    return `/search/category/${filterCategory}/name/${filterName}/min/${filterMin}/max/${filterMax}/rating/${filterRating}/order/${sortOrder}`;
  };

  return (
    <div className="search-screen-container">
      <div className="row top">
        <div className="col-1 categoriesAndFilters">
          <h3>Department</h3>
          <div>
            {loadingCategories ? (
              <LoadingBox></LoadingBox>
            ) : errorCategories ? (
              <MessageBox variant="danger">{errorCategories}</MessageBox>
            ) : (
              <ul>
                <li>
                  <Link
                    className={'all' === category ? 'selected-filter' : ''}
                    to={getFilterUrl({ category: 'all' })}
                  >
                    All
                  </Link>
                </li>
                {categories.map((c) => (
                  <li key={c}>
                    <Link
                      className={c === category ? 'selected-filter' : ''}
                      to={getFilterUrl({ category: c })}
                    >
                      {c}
                    </Link>
                  </li>
                ))}
              </ul>
            )}
          </div>
          <div>
            <h3>Price</h3>
            <ul>
              {prices.map((p) => (
                <li key={p.name}>
                  <Link
                    to={getFilterUrl( `${p.min}-${p.max}` === `${min}-${max}` ? { min: '0', max: '0'} : { min: p.min, max: p.max })}
                    className={
                      `${p.min}-${p.max}` === `${min}-${max}` ? 'selected-filter' : ''
                    }
                  >
                    {p.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
          <div>
            <h3>Avg. Customer Review</h3>
            <ul>
              {ratings.map((r) => (

                <li key={r.name}>
                  <Link
                    to={getFilterUrl(`${r.rating}` === `${rating}` ? {rating: '0'} : {rating: r.rating})}
                    className={`${r.rating}` === `${rating}` ? 'selected-filter' : ''}
                  >
                    <Rating caption={' & up'} rating={r.rating}></Rating>
                  </Link>
                </li>

              ))}
            </ul>
          </div>
        </div>

                {/* Smallscreens filters */}
        <div className="smallscreens-filterBtnSort-container">
          <button className="smallscreens-filters-btn" onClick={() => setIsFiltersOpen(true)}><BsFilterLeft></BsFilterLeft></button>
          <div className="smallscreens-sortBy-container">
            <select
              value={order}
              onChange={(e) => {
                props.history.push(getFilterUrl({ order: e.target.value }));
              }}
            >
              <option value="newest">Newest Arrivals</option>
              <option value="lowest">Price: Low to High</option>
              <option value="highest">Price: High to Low</option>
              <option value="toprated">Avg. Customer Reviews</option>
            </select>
          </div>
        </div>
        <div className={isFiltersOpen ? "smallscreens-searchscreen-filters-container active" : "smallscreens-searchscreen-filters-container"}>      
          <div className="smallscreens-searchscreen-filters">
            <button className="smallscreens-searchscreen-filters-close" onClick={() => setIsFiltersOpen(false)}>Close</button>
            <h3>Department</h3>
            <div>
              {loadingCategories ? (
                <LoadingBox></LoadingBox>
              ) : errorCategories ? (
                <MessageBox variant="danger">{errorCategories}</MessageBox>
              ) : (
                <ul>
                  <li>
                    <Link
                      className={'all' === category ? 'selected-filter' : ''}
                      to={getFilterUrl({ category: 'all' })}
                    >
                      All
                    </Link>
                  </li>
                  {categories.map((c) => (
                    <li key={c}>
                      <Link
                        className={c === category ? 'selected-filter' : ''}
                        to={getFilterUrl({ category: c })}
                      >
                        {c}
                      </Link>
                    </li>
                  ))}
                </ul>
              )}
            </div>
            <div>
              <h3>Price</h3>
              <ul>
                {prices.map((p) => (
                  <li key={p.name}>
                    <Link
                      to={getFilterUrl( `${p.min}-${p.max}` === `${min}-${max}` ? { min: '0', max: '0'} : { min: p.min, max: p.max })}
                      className={
                        `${p.min}-${p.max}` === `${min}-${max}` ? 'selected-filter' : ''
                      }
                    >
                      {p.name}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
            <div>
              <h3>Avg. Customer Review</h3>
              <ul>
                {ratings.map((r) => (

                  <li key={r.name}>
                    <Link
                      to={getFilterUrl(`${r.rating}` === `${rating}` ? {rating: '0'} : {rating: r.rating})}
                    >
                      <Rating className={`${r.rating}` === `${rating}` ? 'selected-filter' : ''} caption={' & up'} rating={r.rating}></Rating>
                    </Link>
                  </li>

                ))}
              </ul>
            </div>
            <button className="primary smallscreens-filters-close-btn" onClick={() => setIsFiltersOpen(false)}>CLOSE</button>
          </div>
        </div>

        <div className="col-3">

        <div className="row top">
        {loading ? (
          <LoadingBox></LoadingBox>
        ) : error ? (
          <MessageBox variant="danger">{error}</MessageBox>
        ) : (
          <div className="resultsNum"><span>{category}</span> / {products.allProductsNum} results</div>
      )}
        <div className="sortBy">
          Sort by{' '}
          <select
            value={order}
            onChange={(e) => {
              props.history.push(getFilterUrl({ order: e.target.value }));
            }}
          >
            <option value="newest">Newest Arrivals</option>
            <option value="lowest">Price: Low to High</option>
            <option value="highest">Price: High to Low</option>
            <option value="toprated">Avg. Customer Reviews</option>
          </select>
        </div>
      </div>


          {loading ? (
            <Spinner />
          ) : error ? (
            <MessageBox variant="danger">{error}</MessageBox>
          ) : (
            <>
              {products.results.length === 0 && (
                <MessageBox>No Product Found</MessageBox>
              )}
              <div className="row center">
                {products.results.map((product) => (
                  <Product key={product._id} product={product}></Product>
                ))}
              </div>
              <Pagination pages={products.pageNumbers.length} setCurrentPage={setPage} page={page}/>
            </>
          )}
        </div>
      </div>
    </div>
  );
}