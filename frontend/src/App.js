import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { HashRouter as Router, Link, Route, Switch } from 'react-router-dom';
import { signout } from './actions/userActions';
import AdminRoute from './components/AdminRoute';
import PrivateRoute from './components/PrivateRoute';
import CartScreen from './screens/CartScreen';
import HomeScreen from './screens/HomeScreen';
import OrderHistoryScreen from './screens/OrderHistoryScreen';
import OrderScreen from './screens/OrderScreen';
import PaymentMethodScreen from './screens/PaymentMethodScreen';
import PlaceOrderScreen from './screens/PlaceOrderScreen';
import ProductListScreen from './screens/ProductListScreen';
import ProductScreen from './screens/ProductScreen';
import ProfileScreen from './screens/ProfileScreen';
import RegisterScreen from './screens/RegisterScreen';
import ShippingAddressScreen from './screens/ShippingAddressScreen';
import SigninScreen from './screens/SigninScreen';
import ProductEditScreen from './screens/ProductEditScreen';
import OrderListScreen from './screens/OrderListScreen';
import UserListScreen from './screens/UserListScreen';
import UserEditScreen from './screens/UserEditScreen';
import SearchBox from './components/SearchBox';
import SearchScreen from './screens/SearchScreen';
import { listProductCategories } from './actions/productActions';
import MessageBox from './components/MessageBox';
import LoadingBox from './components/LoadingBox';
import ProductCreateScreen from './screens/ProductCreateScreen';
import PageNotFound from './screens/PageNotFound';


function App() {
  const cart = useSelector((state) => state.cart);
  const [sidebarIsOpen, setSidebarIsOpen] = useState(false);
  const [small, setSmall] = useState(false);
  const { cartItems } = cart;
  const userSignin = useSelector((state) => state.userSignin);
  const { userInfo } = userSignin;
  const dispatch = useDispatch();
  const signoutHandler = () => {
    dispatch(signout());
  };
  const productCategoryList = useSelector((state) => state.productCategoryList);
  const {
    loading: loadingCategories,
    error: errorCategories,
    categories,
  } = productCategoryList;
  useEffect(() => {
    dispatch(listProductCategories())
    if (typeof window !== "undefined") {
      window.addEventListener("scroll", () =>
        setSmall(window.pageYOffset > 200)
      );
    }
  }, []);


  return (
    <Router>
      <div className="grid-container">
        <header className="row header" id={small ? "small" : ''}>
          <div>
            <Link id="shop-title" className="brand" to="/">
              CometShop
            </Link>
            <button
            type="button"
            className="open-sidebar"
            onClick={() => setSidebarIsOpen(true)}
            >
              <i className="fa fa-bars"></i>
            </button>

          {/* smallscreens SIGNIN/USER and CART elements */}
          <>
          <div className="smallscreens-navbar-container">
         
          <button
            type="button"
            className="smallscreens-navbar-open-sidebar"
            onClick={() => setSidebarIsOpen(true)}
            >
              <i className="fa fa-bars"></i>
            </button>
            <Link id="smallscreens-navbar-shop-title" className="brand" to="/">
              CometShop
            </Link>
          <div className="smallscreens-navbar-user-cart-container">
            {userInfo ? (
                <div className="smallscreens-navbar-user">
                  <div>
                  <Link to="#">
                    {userInfo.name} <i className="fa fa-caret-down"></i>{' '}
                  </Link>
                  </div>
                  <ul className="smallscreens-navbar-user-dropdown-content">
                    <li>
                      <Link to="/profile">User Profile</Link>
                    </li>
                    <li>
                      <Link to="/orderhistory">Order History</Link>
                    </li>
                    <li>
                      <Link to="#signout" onClick={signoutHandler}>
                        Sign Out
                      </Link>
                    </li>
                  </ul>
                </div>
              ) : (
                <div className="smallscreens-navbar-signin">
                <Link to="/signin">Sign In</Link>
                </div>
              )}
    
              <div className="smallscreens-navbar-cart">
              <Link id="cart-element" to="/cart">
                Cart
                {cartItems.length > 0 && (
                  <span className="badge">{cartItems.length}</span>
                )}
              </Link>
              </div>
            </div>

            </div>

            <div className="smallscreens-navbar-searchbar">
              <Switch>
              <Route render={({history}) => <SearchBox history={history}></SearchBox>}></Route>
              </Switch>
            </div>

            </>
          {/* /////////////////////////////////// */}

          </div>
          <div className="searchbar">
            <Switch>
            <Route render={({history}) => <SearchBox history={history}></SearchBox>}></Route>
            </Switch>
          </div>
          <div>
            {userInfo ? (
              <div className="dropdown user">
                <div className="navItems-bg"> 
                <Link to="#">
                  {userInfo.name} <i className="fa fa-caret-down"></i>{' '}
                </Link>
                </div>
                <ul className="dropdown-content">
                  <li>
                    <Link to="/profile">User Profile</Link>
                  </li>
                  <li>
                    <Link to="/orderhistory">Order History</Link>
                  </li>
                  <li>
                    <Link to="#signout" onClick={signoutHandler}>
                      Sign Out
                    </Link>
                  </li>
                </ul>
              </div>
            ) : (
              <div id="navbar-signin-desktop" className="navItems-bg">
              <Link to="/signin">Sign In</Link>
              </div>
            )}
            {userInfo && userInfo.isAdmin && (
              <div className="dropdown admin">
                <div className="navItems-bg">
                <Link to="#admin">
                  Admin <i className="fa fa-caret-down"></i>
                </Link>
                </div>
                <ul className="dropdown-content">
                  <li>
                    <Link to="/productlist">Products</Link>
                  </li>
                  <li>
                    <Link to="/orderlist">Orders</Link>
                  </li>
                  <li>
                    <Link to="/userlist">Users</Link>
                  </li>
                </ul>
              </div>
            )}
            <div className="navItems-bg cart">
             <Link id="cart-element" to="/cart">
              Cart
              {cartItems.length > 0 && (
                <span className="badge">{cartItems.length}</span>
              )}
            </Link>
            </div>
          </div>
        </header>
        <aside className={sidebarIsOpen ? 'open' : ''}>

          {/* small screens solution - places admin icon into the sidebar*/}

          <div id="smallscreens-admin-element">
            {userInfo && userInfo.isAdmin && (
              <div>
                <div id="sidebar-title-admin-div">
              
                  <strong id="sidebar-title-admin">Admin</strong>
                 
                </div>
                <ul className="smallscreens-navbar-admin-options">
                  <li>
                    <Link to="/productlist">Products</Link>
                  </li>
                  <li>
                    <Link to="/orderlist">Orders</Link>
                  </li>
                  <li>
                    <Link to="/userlist">Users</Link>
                  </li>
                </ul>
              </div>
            )}
          </div>


          {/* ////////////////////// */}
          <strong id="sidebar-title-categories">Categories</strong>
          
          
          <ul className="categories">
            {loadingCategories ? (
              <LoadingBox></LoadingBox>
            ) : errorCategories ? (
              <MessageBox variant="danger">{errorCategories}</MessageBox>
            ) : (
              categories.map((c) => (
                <li key={c}>
                  <Link
                    to={`/search/category/${c}`}
                    onClick={() => setSidebarIsOpen(false)}
                  >
                    {c}
                  </Link>
                </li>
              ))
            )}
          </ul>
        </aside>
        <div 
        className={sidebarIsOpen ? 'sidebar__bg' : ''} 
        onClick={() => setSidebarIsOpen(false)}
        ></div>
        <main>
          <Switch>
          <Route exact path="/" component={HomeScreen} ></Route>
          <Route path="/cart/:id?" component={CartScreen}></Route>
          <Route path="/product/:id" component={ProductScreen} exact></Route>
          <Route
            path="/product/:id/edit"
            component={ProductEditScreen}
            exact
          ></Route>
          <Route
            path="/products/create"
            component={ProductCreateScreen}
            exact
          ></Route>
          <Route path="/signin" component={SigninScreen}></Route>
          <Route path="/register" component={RegisterScreen}></Route>
          <Route path="/shipping" component={ShippingAddressScreen}></Route>
          <Route path="/payment" component={PaymentMethodScreen}></Route>
          <Route path="/placeorder" component={PlaceOrderScreen}></Route>
          <Route path="/order/:id" component={OrderScreen}></Route>
          <Route path="/orderhistory" component={OrderHistoryScreen}></Route>
          <Route
            path="/search/name/:name?"
            component={SearchScreen}
            exact
          ></Route>
          <Route
            path="/search/category/:category"
            component={SearchScreen}
            exact
          ></Route>
          <Route
            path="/search/category/:category/name/:name"
            component={SearchScreen}
            exact
          ></Route>
          <Route
            path="/search/category/:category/name/:name/min/:min/max/:max/rating/:rating/order/:order"
            component={SearchScreen}
            exact
          ></Route>
          <PrivateRoute
            path="/profile"
            component={ProfileScreen}
          ></PrivateRoute>
          <AdminRoute
            path="/productlist"
            component={ProductListScreen}
          ></AdminRoute>
          <AdminRoute
            path="/orderlist"
            component={OrderListScreen}
          ></AdminRoute>
          <AdminRoute path="/userlist" component={UserListScreen}></AdminRoute>
          <AdminRoute
            path="/user/:id/edit"
            component={UserEditScreen}
          ></AdminRoute>
          <Route><PageNotFound></PageNotFound></Route>
          </Switch>
        </main>
        <footer className="row center">CometShop 2021</footer>
      </div>
    </Router>
  );
}

export default App;
