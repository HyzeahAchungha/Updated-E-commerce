import React, { useEffect, useRef } from 'react';
import Swiper from 'swiper';

import Brand1 from "../assets/images/brand1.png"
import Brand2 from "../assets/images/brand2.png"
import Brand3 from "../assets/images/brand3.png"
import Brand4 from "../assets/images/brand4.png"



const Brands = () => {
  const swiperRef = useRef(null);

  useEffect(() => {
    swiperRef.current = new Swiper(".slider-3", {
      loop: true,
      grabCursor: true,
      autoplay: {
        delay: 3500,
        disableOnInteraction: false,
      },
      spaceBetween: 30,
      slidesPerView: 2,
      breakpoints: {
        768: { slidesPerView: 3 },
        1024: { slidesPerView: 5 },
      },
    });

    return () => {
      if (swiperRef.current) swiperRef.current.destroy();
    };
  }, []);

  return (
    <section className="section brands">
      <div className="title">
        <h2>Shop by brands</h2>
        <span>lovely brands</span>
      </div>

      <div className="brand-layout container">
        <div className="swiper-container slider-3">
          <div className="swiper-wrapper">
            <div className="swiper-slide">
              <img src={Brand1} alt="" width="10px" height='10px' style={{ marginTop: '10%' }} />
            </div>
            <div className="swiper-slide">
              <img src={Brand2} alt=""  width="10px" height='10px'/>
            </div>
            <div className="swiper-slide">
              <img src={Brand3} alt="" width="10px" height='10px'/>
            </div>
            <div className="swiper-slide">
              <img src={Brand4} alt=""  width="10px" height='10px'/>
            </div>
            <div className="swiper-slide">
              <img src={Brand1} alt=""width="10px" height='10px' />
            </div>
            <div className="swiper-slide">
              <img src={Brand2}alt=""  width="10px" height='10px'/>
            </div>
            <div className="swiper-slide">
              <img src={Brand3} alt="" width="10px" height='10px'/>
            </div>
            <div className="swiper-slide">
              <img src={Brand4} alt=""width="10px"  height='10px'/>
            </div>
            <div className="swiper-slide">
              <img src={Brand2} alt="" width="10px" height='10px'/>
            </div>
            <div className="swiper-slide">
              <img src={Brand3} alt="" width="10px" height='10px'/>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Brands;