import React, { useEffect, useState, useRef  } from 'react'
import { useDispatch, useSelector } from 'react-redux';
import { listProducts } from '../actions/productActions';

export default function SearchBox(props) {
    const [search, setSearch] = useState('');
    const [display, setDisplay] = useState(false);
    const productList = useSelector((state) => state.productList);
    const { loading, error, products } = productList;
    const [options, setOptions] = useState([]);
    const dispatch = useDispatch();
    const wrapperRef = useRef(null);
    
    useEffect(() => {
        dispatch(listProducts({}));
        window.addEventListener("mousedown", handleClickOutside);
            return () => {
        window.removeEventListener("mousedown", handleClickOutside);
    };
      }, []);

    // handleClickOutside uses useRef object property - current. 
    // It checks if bearing useRef div contains an element which was clicked on
    // If the clicked element lays outside of the useRef div - setDisplay(false) fires

      const handleClickOutside = event => {
        const { current: wrap } = wrapperRef;
        if (wrap && !wrap.contains(event.target)) {
          setDisplay(false);
        }
      };

    const update = item => {
        setSearch(item.name);
        props.history.push(`/product/${item._id}`);
        setDisplay(false);
    };

    const handleOnBlur = e => {
            setDisplay(false);
    }

    const submitHandler = e => {
        e.preventDefault();
        props.history.push(`/search/name/${search}`);
        setDisplay(false);
    }

    const onChangeHandler = text => {
        setSearch(text);
        let matches;
        if(products){
            if(products.results) {
                if (search.length >= 0) {
                        matches = products.results.filter(item => {
                        const regex = new RegExp(`${search}`, "gi");
                        return item.name.match(regex)
                    })
                    if(matches.length === 0) {
                        setDisplay(false);
                        return
                    }
                } 
            }
        }
        setOptions(matches.splice(0, 5))

        if(text === '') {
            setDisplay(false);
            return;
        }
        setDisplay(true);
    }


    return (
        <div>
            <form 
            ref={wrapperRef}
            className={display ? "search autocomplete-open" : "search search-hover"}
            onSubmit={submitHandler}
            >
                <div className="row">
                    <input 
                    type="text" 
                    name="q"
                    id="q"
                    value={search}
                    placeholder='Search CometShop'
                    onFocus={(e) => e.target.placeholder = ""} 
                    onBlur={e => e.target.placeholder = "Search Cometshop"} 
                    onChange={e => onChangeHandler(e.target.value)}
                    ></input>
                    <button id="search-btn" type="submit">
                        <i id="search-icon" className="fa fa-search"></i>
                    </button>
                </div>
                {display && 
                  <div 
                    className={display ? "autoContainer" : ""} 
                    style={display ? {"display" : "block"} : {"display" : "none"}}
                  >
                {options &&
                  <div>
                  {search.length > 0 && options
                        .map((value, i) => {
                        return (
                            <div
                            tabIndex="0"
                            onClick={() => update(value)}
                            className="option"
                            key={i}
                            >
                            <span>{
                                value.name.length < 50 ?
                                    value.name 
                                :
                                value.name.substring(0, 50) + ' ...'
                            }</span>
                            <img className="option-images-thumbnail" src={value.image} alt="item" />
                            </div>
                        );
                        })}
                    </div>
                    }
                    </div>
                    }
            </form>
        </div>
    )
}
