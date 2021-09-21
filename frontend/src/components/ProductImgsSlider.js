import React, { useState } from 'react'
import { AiOutlineLeft, AiOutlineRight } from 'react-icons/ai'

export default function ProductImgsSlider({product, smallscreen}) {

    let thumbnails = document.getElementsByClassName('product-images-thumbnail')
    let activeImages = document.getElementsByClassName(smallscreen ? 'ss-images-slide-active' : "images-slide-active")
    const handleThumbnail = e => {
        if (activeImages.length > 0){
            activeImages[0].classList.remove(smallscreen ? 'ss-images-slide-active' : "images-slide-active")
        }
        e.target.classList.add(smallscreen ? 'ss-images-slide-active' : "images-slide-active")
        document.getElementById(smallscreen ? "ss-featured" : "featured").src = e.target.src
    }

    const handleClickLeft = () => {
        document.getElementById(smallscreen ? "ss-product-images-slider" : 'product-images-slider').scrollLeft -= 180
    }
    const handleClickRight = () => {
        document.getElementById(smallscreen ? "ss-product-images-slider" : 'product-images-slider').scrollLeft += 300
    }


    return (
        <>
        {!smallscreen ?
		<div className="column">
			<div id="images-slide-wrapper" >
                <AiOutlineLeft 
                    id="slideLeft" 
                    className="images-slide-arrow" 
                    onClick={() => handleClickLeft()}
                />
				<div id="product-images-slider">
                    {product && 
                    <div className="product-images-thumbnail-container">
                        <img 
                            className="product-images-thumbnail images-slide-active" 
                            src={product.image} 
                            onClick={e => handleThumbnail(e)}
                            onMouseOver={e => handleThumbnail(e)}
                        />
                    </div>
                    }
                    {product &&
                        product.previewImgs.map(image => {
                            return (
                                <div className="product-images-thumbnail-container">
                                <img 
                                    className="product-images-thumbnail images-slide-active" 
                                    src={image} 
                                    onClick={e => handleThumbnail(e)}
                                    onMouseOver={e => handleThumbnail(e)}
                                />
                                </div>
                            )
                            
                        })
                    }
				</div>
                <AiOutlineRight 
                    id="slideRight" 
                    className="images-slide-arrow" 
                    onClick={() => handleClickRight()}
                />
			</div>
		</div>
        :
		<div className="column">
			<div id="ss-images-slide-wrapper" >
                <AiOutlineLeft 
                    id="slideLeft" 
                    className="images-slide-arrow" 
                    onClick={() => handleClickLeft()}
                />
				<div id="ss-product-images-slider">
                    {product && 
                        <div className="product-images-thumbnail-container">
                            <img 
                                className="ss-product-images-thumbnail ss-images-slide-active" 
                                src={product.image} 
                                onClick={e => handleThumbnail(e)}
                                onMouseOver={e => handleThumbnail(e)}
                            />
                        </div>
                    }
                    {product &&
                        product.previewImgs.map(image => {
                            return (
                                <div className="product-images-thumbnail-container">
                                    <img 
                                        className="ss-product-images-thumbnail ss-images-slide-active" 
                                        src={image} 
                                        onClick={e => handleThumbnail(e)}
                                        onMouseOver={e => handleThumbnail(e)}
                                    />
                                </div>
                            )
                        })
                    }
				</div>
                <AiOutlineRight 
                    id="slideRight" 
                    className="images-slide-arrow" 
                    onClick={() => handleClickRight()}
                />
			</div>
		</div>
        }
        </>
    )
}
