import React, { useEffect, useRef } from 'react';
import Swiper from 'swiper/bundle';
import { Link } from 'react-router-dom';
import 'swiper/swiper-bundle.css';
import image from "../assets/images/hero-1.png"
import imageh from '../assets/images/hero-2.png'
import image3 from "../assets/images/hero-3.png"


const Hero = () => {
  const swiperRef = useRef(null);

  useEffect(() => {
    swiperRef.current = new Swiper(".slider-1", {
      autoplay: {
        delay: 3500,
        disableOnInteraction: false
      },
      grabCursor: true,
      effect: "fade",
      loop: true,
      navigation: {
        nextEl: '.swiper-next',
        prevEl: '.swiper-prev'
      }
    });

    return () => {
      if (swiperRef.current) {
        swiperRef.current.destroy();
      }
    };
  }, []);

  return (
    <div className="hero">
      <div className="row">
        <div className="swiper-container slider-1">
          <div className="swiper-wrapper">
            <div className="swiper-slide">
              <img src={image} alt="" />
              <div className="content">
                <h1>Super Market Vegbox
                  <br />
                  start from
                  <span>$9</span>
                </h1>
                <p>Shop with Achungha! here we sell good and afordable fruit and groceries</p>
           
                <li><Link to="/products">Show Now</Link></li>
              </div>
            </div>

            <div className="swiper-slide">
              <img src={imageh} alt="" />
              <div className="content">
                <h1>Your First Order
                  <br />

                  <span>20% off</span>
                  at Juice
                </h1>
                <p>Shop with Achungha! here we sell good and afordable fruit and groceries</p>
                <a href="">Show Now</a>
              </div>
            </div>

            <div className="swiper-slide">
              <img src={image3 } alt="" />
              <div className="content">
                <h1>Super Market Vegbox
                  <br />
                  start from
                  <span>$9</span>
                </h1>
                <p>Shop with Achungha! here we sell good and afordable fruit and groceries</p>
                <a href="">Show Now</a>
              </div>
            </div>
          </div>

        </div>
      </div>
      <div className="arrows d-flex">
        <div className="swiper-prev d-flex">
          <i className="fa fa-chevron-left swiper-icon"></i>

        </div>
        <div className="swiper-next d-flex">
          <i className="fa fa-chevron-right swiper-icon"></i>

        </div>
      </div>
    </div>
  );
};

export default Hero;