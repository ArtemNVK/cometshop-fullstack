import React, { useEffect, useLayoutEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Link, useHistory, useLocation, useParams } from 'react-router-dom';
import { createReview, detailsProduct } from '../actions/productActions';
import { listOrderMine } from '../actions/orderActions';
import LoadingBox from '../components/LoadingBox';
import MessageBox from '../components/MessageBox';
import Rating from '../components/Rating';
import { PRODUCT_REVIEW_CREATE_RESET } from '../constants/productConstants';
import { IoIosArrowBack } from 'react-icons/io';
import ProductImgsSlider from '../components/ProductImgsSlider';
import { AiOutlineClose } from 'react-icons/ai';

export default function ProductScreen(props) {
  const dispatch = useDispatch();
  const productId = props.match.params.id;
  const [qty, setQty] = useState(1);
  const productDetails = useSelector((state) => state.productDetails);
  const { loading, error, product, reviews } = productDetails;
  const userSignin = useSelector((state) => state.userSignin);
  const { userInfo } = userSignin;
  const orderMineList = useSelector((state) => state.orderMineList);
  const { loading: loadingOrders, error: errorOrders, orders } = orderMineList;
  const productReviewCreate = useSelector((state) => state.productReviewCreate);
  const {
    loading: loadingReviewCreate,
    error: errorReviewCreate,
    success: successReviewCreate,
  } = productReviewCreate;

  const [rating, setRating] = useState(0);
  const [comment, setComment] = useState('');
  const [isLens, setIsLens] = useState(false);
  const [dbclick, setDbclick] = useState(false);
  const [ssOpenImage, setSmallscreenOpenImageClick] = useState(false);
  const history = useHistory();

  useEffect(() => {
    if (successReviewCreate) {
      window.alert('Review Submitted Successfully');
      setRating('');
      setComment('');
      dispatch({ type: PRODUCT_REVIEW_CREATE_RESET });
    }
    dispatch(detailsProduct(productId));
    dispatch(listOrderMine({}));
  }, [dispatch, productId, successReviewCreate]);


  const userPurchases = [];
  
  if(orders){
    if(orders.results) {
    orders.results.map(item => {
      item.orderItems.map(x => {
        userPurchases.push(x.product);
      })
  })
  }
}

  const addToCartHandler = () => {
    props.history.push(`/cart/${productId}?qty=${qty}`);
  };
  const submitHandler = (e) => {
    e.preventDefault();
    if (comment && rating) {
      dispatch(
        createReview(productId, { rating, comment, name: userInfo.name })
      );
    } else {
      alert('Please enter comment and rating');
    }
  };


    // IMAGE ZOOM SECTION 


    function imageZoom(imgID){
      let img = document.getElementById(imgID)
      let lens = document.getElementById('lens')
  setIsLens(true)
      lens.style.backgroundImage = `url( ${img.src} )`


      let ratio = 3

      lens.style.backgroundSize = (img.width * ratio) + 'px ' + (img.height * ratio) + 'px';

      img.addEventListener("mousemove", moveLens)
      lens.addEventListener("mousemove", moveLens)

      function moveLens(){
          let pos = getCursor()
          lens.style.backgroundPosition = "-" + (pos.x * ratio) + 'px -' +  (pos.y * ratio) + 'px'
  
  }

      function getCursor(){
      let e = window.event
      let bounds = img.getBoundingClientRect()
      let x = e.pageX - bounds.left;
      let y = e.pageY - bounds.top;
          x = x - window.pageXOffset - 100;
          y = y - window.pageYOffset - 95;
          return {'x': x, 'y': y}
      }

  }

  const hideLens = () => {
  setIsLens(false)
  }

  // END OF THE IMAGE ZOOM SECTION

  const getDlContent = dlArray => {
    let content = [];
    for (let i = 0; i < dlArray.length; i++) {
      content.push(
        <dl class="dl">
          <dt class="dt">
            <span class="dt-span">{dlArray[i++]}</span> 
          </dt>
          <dd class="dd">{dlArray[i]}</dd> 
        </dl>
      );
    }
    return content;
  };

  return (
    <div>
      
      {loading ? (
        <LoadingBox></LoadingBox>
      ) : error ? (
        <MessageBox variant="danger">{error}</MessageBox>
      ) : (
        <div className="productScreen__container">
            <button id="smallscreens-back-btn" onClick={() => history.goBack(1)}><i class="fa fa-chevron-left"></i></button>
            <div className="breadcrumbs hide">
              <button id="back__btn" onClick={() => history.goBack(1)}>Back</button>
              <ul>
                <li>
                  <Link to="/">Home</Link>
                </li>
                <li>
                  <Link to={`/search/category/${product.category}`}>
                    {product.category}
                  </Link>
                </li>
                <li>
                  {product.name.length < 50 ? 
                    product.name
                    :
                    product.name.substring(0, 50) + ' ...'
                  }
                </li>
              </ul>
            </div>
          <div className="row top">
            <div className="col-2 center">

                <div className={dbclick ? "image-slider-section open-image-container" : "image-slider-section"}>
                <div 
                  id="img-container"
                  onMouseOver={() => imageZoom('featured')}
                  onMouseOut={() => hideLens()}
                  onDoubleClick={() => setDbclick(true)}

                  >
                    <div className={dbclick ? "open-image-bg" : ""} onClick={() => setDbclick(false)}></div>
                    <div 
                    id="lens"
                    style={isLens ? {display: "block"} : {display: "none"}}
                    ></div>
                 
                    <img
                      id="featured"
                      className={dbclick ? "open-image" : "large"}
                      src={product.image}
                      alt={product.name}
                    ></img>
                    
                  </div>
                  {product&&
                    <ProductImgsSlider product={product}></ProductImgsSlider>
                  }   
                </div>

                {/* ////////////////////////////////// SMALLSCREENS OPEN IMAGE////////////////////////////////// */}
                <div className={ssOpenImage ? "ss-open-image-bg" : ""}>
                <AiOutlineClose 
                      id="ss-close-image" 
                      style={ssOpenImage ? {display: "block"} : {display: "none"}} 
                      onClick={() => setSmallscreenOpenImageClick(false)}
                />
                <div className={ssOpenImage ? "ss-image-slider-section ss-open-image-container" : "ss-image-slider-section"}>
                <div 
                  id="img-container"
                  >
                    
                    <img
                      id="ss-featured"
                      className={ssOpenImage ? "ss-open-image" : "large"}
                      src={product.image}
                      alt={product.name}
                      onClick={() => setSmallscreenOpenImageClick(true)}
                    ></img>
                    
                  </div>
                  {product && !ssOpenImage &&
                    <ProductImgsSlider product={product} smallscreen={true}></ProductImgsSlider>
                  } 
                </div>
            
                </div>
            
                  {/* ////////////////////////////////////////////////////// */}

                  <div className="product-description">
                    <span className="productScreen__titles">Description:</span>
                    <p>{product.description}</p>
                  </div>

            </div>

            
            <div className="col-1 prodInfo">
              <ul>
                <li>
                  <h1 id="product_name">{product.name}</h1>
                </li>
                <li>
                  <a 
                    style={{"cursor":"pointer"}} 
                    onClick={() => {
                      const anchor = document.querySelector('#reviews-link')
                      anchor.scrollIntoView({ behavior: 'smooth', block: 'center' })
                    }}
                  >
                  <Rating
                    rating={product.rating}
                    numReviews={product.numReviews}
                  ></Rating>
                  </a>
                </li>
                <li id="productScreen__price">Price : $ {product.price.toFixed(2)}</li>
                <li className="smallscreens-description-section">
                  <span className="productScreen__titles">Description:</span>
                  <p>{product.description}</p>
                </li>
                {product.attributesList.length > 0 &&
                <li>
                  <span className="productScreen__titles">Attributes & Features:</span>
                    <div class="attributes-container">
                      <div class="dl-container">
                        {getDlContent(product.attributesList)}
                      </div>
                    </div>
                </li>
                }
              </ul>
            </div>
            <div className="col-1">
              <div className="card__productScreen">
                <ul>
                  <li>
                    <div className="row">
                      <div>Price</div>
                      <div className="price">$ {product.price.toFixed(2)}</div>
                    </div>
                  </li>
                  <li>
                    <div className="row">
                      <div>Status</div>
                      <div>
                        {product.countInStock > 0 ? (
                          <span className="success">In Stock</span>
                        ) : (
                          <span className="danger">Unavailable</span>
                        )}
                      </div>
                    </div>
                  </li>
                  {product.countInStock > 0 && (
                    <>
                      <li>
                        <div className="row">
                          <div>Qty</div>
                          <div>
                            <select
                              value={qty}
                              onChange={(e) => setQty(e.target.value)}
                            >
                              {[...Array(product.countInStock).keys()].map(
                                (x) => (
                                  <option key={x + 1} value={x + 1}>
                                    {x + 1}
                                  </option>
                                )
                              )}
                            </select>
                          </div>
                        </div>
                      </li>
                      <li>
                        <button
                          onClick={addToCartHandler}
                          className="addToCard__btn block"
                        >
                          Add to Cart
                        </button>
                      </li>
                    </>
                  )}
                </ul>
              </div>
            </div>
          </div>
          <div id="reviews-link">
            <h2 className="productScreen__titles reviews">Reviews</h2>
            {product.reviews.length === 0 && (
              <MessageBox>There is no reviews</MessageBox>
            )}
            
            <ul>
              {product.reviews.map((review) => (
                <div className="reviews__section">
                <li key={review._id}>
                  <p><strong>{review.name}</strong>  |  {review.createdAt.substring(0, 10)}</p>
                  <Rating rating={review.rating} caption=" "></Rating>
                  <p>{review.comment}</p>
                </li>
                </div>
              ))}
              <li>
                {userInfo && userPurchases.includes(productId) ? (
                  <form className="form" onSubmit={submitHandler}>
                    <div>
                      <h2>Write a customer review</h2>
                    </div>
                    <div>
                      <label htmlFor="rating">Rate this product</label>
                      <select
                        id="rating"
                        value={rating}
                        onChange={(e) => setRating(e.target.value)}
                      >
                        <option value="">Select...</option>
                        <option value="1">1- Poor</option>
                        <option value="2">2- Fair</option>
                        <option value="3">3- Good</option>
                        <option value="4">4- Very good</option>
                        <option value="5">5- Excelent</option>
                      </select>
                    </div>
                    <div>
                      <label htmlFor="comment">Comment</label>
                      <textarea
                        id="comment"
                        value={comment}
                        onChange={(e) => setComment(e.target.value)}
                      ></textarea>
                    </div>
                    <div>
                      <label />
                      <button className="submit__review block" type="submit">
                        Submit
                      </button>
                    </div>
                    <div>
                      {loadingReviewCreate && <LoadingBox></LoadingBox>}
                      {errorReviewCreate && (
                        <MessageBox variant="danger">
                          {errorReviewCreate}
                        </MessageBox>
                      )}
                    </div>
                  </form>
                ) : !userInfo ? (
                  <MessageBox>
                    Please <Link to="/signin"><span className="call-to-action">Sign In</span></Link> to write a review
                  </MessageBox>
                )
                  : !userPurchases.includes(productId)  ?
                    <MessageBox>
                      You can review only purchased items!
                    </MessageBox>
                  : ''
              }
              </li>
            </ul>
          </div>
  
        </div>
          
      )}
    </div>
  );
}