import React from 'react';
import Banner from "../assets/images/banner1.jpg"
import Banner2 from "../assets/images/banner2.jpg"
const Adverts = () => {
  return (
    <section className="section advert">
      <div className="advert-layout container">
        <div className="item">
          <img src={Banner} alt="" />
          <div className="content left">
            <span>Exclusive Sales </span>
            <h3>Spring Collections</h3>
            <a href="">View Collection</a>
          </div>
        </div>

        <div className="item">
          <img src={Banner2} alt="" />
          <div className="content right">
            <span>New Trending </span>
            <h3>Spring Collections</h3>
            <a href="">Shop now</a>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Adverts;