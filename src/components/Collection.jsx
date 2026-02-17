import React from 'react';
import coll1 from "../assets/images/promo1.jpg"
import coll2 from "../assets/images/promo2.jpg"
import coll3 from "../assets/images/promo3.jpg"
import coll4 from "../assets/images/promo4.jpg"
import coll5 from "../assets/images/promo5.jpg"
import coll6 from "../assets/images/promo6.jpg"

const Collection = () => {
  return (
    <section className="section collection">
      <div className="title">
        <h2>Achungha Show Collection</h2>
        <span> Fresh groceries and very affordable.</span>
      </div>
      <div className="collection-layout container">
        <div className="collection-item">
          <img src={coll1} alt="" />
          <div className="colletion-content">
            <h2>Juice</h2>
            <a href=""> SHOP NOW</a>
          </div>
        </div>
        <div className="collection-item">
          <img src={coll2} alt="" />
          <div className="colletion-content">
            <h2>MANGO</h2>
            <a href=""> SHOP NOW</a>
          </div>
        </div>
        <div className="collection-item">
          <img src={coll3} alt="" />
          <div className="colletion-content">
            <h2>GRAPES</h2>
            <a href=""> SHOP NOW</a>
          </div>
        </div>
        <div className="collection-item">
          <img src={coll4 } alt="" />
          <div className="colletion-content">
            <h2>POTATOE</h2>
            <a href=""> SHOP NOW</a>
          </div>
        </div>
        <div className="collection-item">
          <img src={coll5} alt="" />
          <div className="colletion-content">
            <h2>ORANGE</h2>
            <a href=""> SHOP NOW</a>
          </div>
        </div>
        <div className="collection-item">
          <img src={coll6} alt="" />
          <div className="colletion-content">
            <h2>PINEAPPLE</h2>
            <a href=""> SHOP NOW</a>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Collection;