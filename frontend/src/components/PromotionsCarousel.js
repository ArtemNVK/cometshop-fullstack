import React, { useState } from 'react'
import { sliderData } from '../utils'
import { Link } from 'react-router-dom';

export default function PromotionsCarousel({slides}) {
    const [current, setCurrent] = useState(0);
    const [touchPosition, setTouchPosition] = useState(null)
    const length = slides.length;

    if(!Array.isArray(slides) || slides.length <= 0) {
        return null;
    }

    const nextSlide = () => {
        setCurrent(current === length - 1 ? 0 : current + 1)
    }

    const prevSlide = () => {
        setCurrent(current === 0 ? length - 1 : current - 1)
    }

    // mobile screens

    const handleTouchStart = (e) => {
        const touchDown = e.touches[0].clientX
        setTouchPosition(touchDown)
    }

    const handleTouchMove = (e) => {
        const touchDown = touchPosition
    
        if(touchDown === null) {
            return
        }
    
        const currentTouch = e.touches[0].clientX
        const diff = touchDown - currentTouch
    
        if (diff > 5) {
            nextSlide()
        }
    
        if (diff < -5) {
            prevSlide()
        }
    
        setTouchPosition(null)
    }

    return (
        <section className="slider">
            <i class="fa fa-arrow-left arrow left" onClick={prevSlide}></i>
            <i class="fa fa-arrow-right arrow right" onClick={nextSlide}></i>
            {sliderData.map((slide, index) => {
                return (
                    
                    <div 
                        className={index === current ? 'slide active' : 'slide'}
                        key={index}
                        onTouchStart={handleTouchStart}
                        onTouchMove={handleTouchMove}
                    >
    
                        {index === current && (
                        <Link to={slide.category !== null ? `/search/category/${slide.category}` : "#"}>
                            
                            <img 
                            src={slide.image} 
                            alt="promo" 
                            className="promo-carousel-img"
                            />
                         
                        </Link>
                        )
                        } 
                    </div>
                    
                )
            })}
            <div className="promo-carousel-dots-container">
                {sliderData.map((item, index) => {
                  return  (
                        <div 
                            className={index === current ? "promo-carousel-dots active" : "promo-carousel-dots"} 
                            onClick={() => setCurrent(index)}></div>
                    )
                })
                }
                
            </div>
        </section>
    )
}
