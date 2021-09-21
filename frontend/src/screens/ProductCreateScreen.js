import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import Axios from 'axios';
import { detailsProduct, createProduct } from '../actions/productActions';
import LoadingBox from '../components/LoadingBox';
import MessageBox from '../components/MessageBox';
import { PRODUCT_CREATE_RESET } from '../constants/productConstants';
import { BsPlusCircle } from 'react-icons/bs';

export default function ProductCreateScreen(props) {
  document.title = "Create New Products"
  const [name, setName] = useState('');
  const [price, setPrice] = useState('');
  const [image, setImage] = useState('');
  const [images, setImages] = useState([]);
  const [category, setCategory] = useState('');
  const [countInStock, setCountInStock] = useState('');
  const [brand, setBrand] = useState('');
  const [description, setDescription] = useState('');
  const productCreate = useSelector((state) => state.productCreate);
  const { loading: loadingCreate, error: errorCreate, success: successCreate, product } = productCreate;
  const dispatch = useDispatch();
  const [loadingUpload, setLoadingUpload] = useState(false);
  const [errorUpload, setErrorUpload] = useState('');
  const [loadingImgsUpload, setLoadingImgsUpload] = useState(false);
  const [errorImgsUpload, setErrorImgsUpload] = useState('');
  const [attribute, setAttribute] = useState('');
  const [attributeValue, setAttributeValue] = useState('');
  const [attributes, setAttributes] = useState([]);
  const [checkAtrEmpty, setCheckAtrEmpty] = useState(false);
  const userSignin = useSelector((state) => state.userSignin);
  const { userInfo } = userSignin;

  useEffect(() => {
    if (successCreate) {
      props.history.push('/productlist');
    }
    if (successCreate || errorCreate) {
      dispatch({ type: PRODUCT_CREATE_RESET });
    } 
    
  }, [product, dispatch, successCreate, props.history, createProduct]);
  
  
  const uploadFileHandler = async (e) => {
    const file = e.target.files[0];
    const bodyFormData = new FormData();
    bodyFormData.append('image', file);
    setLoadingUpload(true);

    try {
      const { data } = await Axios.post('https://cometshop.herokuapp.com/api/uploads', bodyFormData, {
        headers: {
          'Content-Type': 'multipart/form-data',
          Authorization: `Bearer ${userInfo.token}`,
        },
      });
      console.log(data)
      setImage(data.location);
      setLoadingUpload(false);
    } catch (error) {
      setErrorUpload(error.message);
      setLoadingUpload(false);
    }
  };

  const addPreviewImg = async (e) => {
    const file = e.target.files[0];
    const bodyFormData = new FormData();
    bodyFormData.append('image', file);
    try {
      const { data } = await Axios.post('https://cometshop.herokuapp.com/api/uploads', bodyFormData, {
        headers: {
          'Content-Type': 'multipart/form-data',
          Authorization: `Bearer ${userInfo.token}`,
        },
      });
      let newArray = images;
      newArray.push(data.location);
      setImages([...newArray]);
    } catch (error) {
      setErrorUpload(error.message);
    }
  };

  const uploadImgsHandler = async (e) => {
    const files = Array.from(e.target.files);
    const bodyFormData = new FormData();
    files.forEach(file => {
      bodyFormData.append('images', file);
    })
    
    setLoadingImgsUpload(true);
    try {
      const { data } = await Axios.post('https://cometshop.herokuapp.com/api/uploads/imgs', bodyFormData, {
        headers: {
          'Content-Type': 'multipart/form-data',
          Authorization: `Bearer ${userInfo.token}`,
        },
      });
      setImages(data.locationArray);
      setLoadingImgsUpload(false);
    } catch (error) {
      setErrorImgsUpload(error.message);
      setLoadingImgsUpload(false);
    }
  };

  const handleAddAttribute = () => {
    if(attribute === '' || attributeValue === '') {
      setCheckAtrEmpty(true);
    } else {
      attributes.push(attribute);
      attributes.push(attributeValue);
      setAttribute('');
      setAttributeValue('');
      setCheckAtrEmpty(false);
    }
  }

  const handleDeleteAttribute = (e, x, y) => {
    let newArray = attributes;
    let dt = newArray.indexOf(y);
    let dd = newArray.indexOf(x);
    newArray.splice(dd, 2);
    let dl = e.target.parentNode;
    dl.style.display = "none";
    setAttributes(newArray);
  }
  const handleDeletePreviewImg = (e, img) => {
    let newArray = images;
    let prevImg = newArray.indexOf(img);
    newArray.splice(prevImg, 1);
    setImages([...newArray]);
  }
  const getDlContent = dlArray => {
    let content = [];
    for (let i = 0; i < dlArray.length; i++) {
      content.push(
        <dl class="dl" id={i}>
          <dt class="create-product-dt">
            <textarea 
              class="create-product-edit-attribute-input" 
              value={dlArray[i++]}
              onChange={(e) => {
                setAttribute(e.target.value)
                let index = attributes.indexOf(dlArray[i++]);
                if(index) {
                  attributes.splice(index - 1, 1, e.target.value)
                }
              }}
              onBlur={() => {
                setAttribute('');
              }}
            ></textarea> 
          </dt>
          <dd class="dd">
            <textarea 
              class="create-product-edit-attribute-input" 
              value={dlArray[i]}
              onChange={(e) => {
                setAttributeValue(e.target.value)
                let index = attributes.indexOf(dlArray[i]);
                if(index) {
                  attributes.splice(index, 1, e.target.value)
                }
              }}
              onBlur={() => {
                setAttributeValue('')
              }}
            ></textarea>
          </dd>
          <div id="create-product-attribute-delete" onClick={(e, x, y) => handleDeleteAttribute(e, dlArray[i++], dlArray[i])} ></div>
        </dl>
      );
    }
    return content;
  };
  const createHandler = (e) => {
    e.preventDefault();
    dispatch(createProduct({
        name: name,
        price: price,
        image: image,
        previewImgs: images,
        attributesList: attributes,
        category: category,
        brand: brand,
        countInStock: countInStock,
        description: description
    }));
  };

  return (
    <div>
      <form className="form" onSubmit={createHandler}>
        <div>
          <h1>Create Product</h1>
        </div>
        {loadingCreate && <LoadingBox></LoadingBox>}
        {errorCreate && <MessageBox variant="danger">{errorCreate}</MessageBox>}
        
          <>
            <div>
              <label htmlFor="name">Name</label>
              <input
                id="name"
                type="text"
                placeholder="Enter name"
                value={name}
                onChange={(e) => setName(e.target.value)}
              ></input>
            </div>
            <div>
              <label htmlFor="price">Price</label>
              <input
                id="price"
                type="text"
                placeholder="Enter price"
                value={price}
                onChange={(e) => setPrice(e.target.value)}
              ></input>
            </div>
            <div>
              <label htmlFor="image">Image</label>
              <input
                id="image"
                type="text"
                placeholder="Enter image"
                value={image}
                onChange={(e) => setImage(e.target.value)}
              ></input>
            </div>
            <div>
              <label htmlFor="imageFile">Image File</label>
              <input
                type="file"
                id="imageFile"
                label="Choose Image"
                onChange={uploadFileHandler}
              ></input>
              {loadingUpload && <LoadingBox></LoadingBox>}
              {errorUpload && (
                <MessageBox variant="danger">{errorUpload}</MessageBox>
              )}
            </div>
            {images.length > 0 &&
            <div>
              Preview Images
              <div className="create-product-previewImgs-display">
                {images.map(prImg => {
                  return (
                    <div className="create-product-previewImgs-img-container">
                      <div id="create-product-attribute-delete" onClick={(e, img) => handleDeletePreviewImg(e, prImg)}></div>
                      <img className="create-product-previewImgs-img" src={prImg} alt="Preview Image" />
                    </div>
                  )
                })
                }
                <label id="addPrImg" htmlFor="prevImgFile"><BsPlusCircle /></label>
                <input
                  type="file"
                  id="prevImgFile"
                  label="Choose Image"
                  style={{display: "none"}}
                  onChange={addPreviewImg}
                ></input>
              </div>
            </div>
            }
            <div>
              <label htmlFor="imageFiles">Preview Images</label>
              <input
                type="file"
                id="imageFiles"
                label="Choose Images"
                multiple
                onChange={uploadImgsHandler}
              ></input>
              {loadingImgsUpload && <LoadingBox></LoadingBox>}
              {errorImgsUpload && (
                <MessageBox variant="danger">{errorImgsUpload}</MessageBox>
              )}
            </div>
            <div>
              <label htmlFor="category">Category</label>
              <input
                id="category"
                type="text"
                placeholder="Enter category"
                value={category}
                onChange={(e) => setCategory(e.target.value)}
              ></input>
            </div>
            <div>
              <label htmlFor="brand">Brand</label>
              <input
                id="brand"
                type="text"
                placeholder="Enter brand"
                value={brand}
                onChange={(e) => setBrand(e.target.value)}
              ></input>
            </div>
            <div>
              <label htmlFor="countInStock">Count In Stock</label>
              <input
                id="countInStock"
                type="text"
                placeholder="Enter countInStock"
                value={countInStock}
                onChange={(e) => setCountInStock(e.target.value)}
              ></input>
            </div>
            <div>
              <label htmlFor="description">Description</label>
              <textarea
                id="description"
                rows="3"
                type="text"
                placeholder="Enter description"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
              ></textarea>
            </div>
            <div>
              <label htmlFor="attribute">Attributes</label>
              <div class="attributes-container">
                <div class="dl-container">
                  {getDlContent(attributes)}
                </div>
              </div>
              <div id="create-product-attributes">
                <input
                  id="attribute"
                  type="text"
                  placeholder="Enter attribute"
                  value={attribute}
                  onChange={(e) => setAttribute(e.target.value)}
                ></input>
                <input
                  id="attributeValue"
                  type="text"
                  placeholder="Enter value"
                  value={attributeValue}
                  onChange={(e) => setAttributeValue(e.target.value)}
                ></input>
                <BsPlusCircle 
                  id="create-product-add-sign" 
                  onClick={handleAddAttribute} 
                  />
              </div>
              {checkAtrEmpty &&
                <MessageBox variant="danger">Each attribute must have a value (and vice versa)!</MessageBox>
              }
            </div>
            <div>
              <label></label>
              <button className="primary" type="submit">
                Create
              </button>
            </div>
          </>
        
      </form>
    </div>
  );
}
