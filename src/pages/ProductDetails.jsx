import React from 'react';
import { Link } from 'react-router-dom';
import product1 from "../assets/images/product-1.jpg";
import product2 from "../assets/images/product-2.jpg";
import product3 from "../assets/images/product-3.jpg";
import product4 from "../assets/images/product-4.jpg";
import product5 from "../assets/images/product-5.jpg";
import product6 from "../assets/images/product-6.jpg";

const productImages = [product1, product2, product3, product4, product5, product6];
const ProductDetails = () => {
  return (
    <>
      <section className="section product-detail">
        <div className="details container">
          <div className="left">
            <div className="main">
              <img src={product1 } alt="" />
            </div>
            <div className="thumbnails">
              <div className="thumbnail">
                <img src={product2} alt="" />
              </div>
              <div className="thumbnail">
                <img src={product3}alt="" />
              </div>
              <div className="thumbnail">
                <img src={product4} alt="" />
              </div>
              <div className="thumbnail">
                <img src={product5} alt="" />
              </div>
            </div>
          </div>
          <div className="right">
            <span>Home/T-shirt</span>
            <h1>Achungha Mini Backpack</h1>
            <div className="price">$50</div>
            <form>
              <div>
                <select>
                  <option value="Select Quantity" disabled>
                    Select Quantity
                  </option>
                  <option value="1">32</option>
                  <option value="2">42</option>
                  <option value="3">52</option>
                  <option value="4">62</option>
                </select>
                <span><i className="fa fa-chevron-down"></i></span>
              </div>
            </form>

            <form className="form">
              <input type="text" placeholder="1" />
              <Link to="/cart" className="addCart">Add To Cart</Link>
            </form>
            <h3>Product Detail</h3>
            <p>
              Lorem ipsum dolor sit amet consectetur adipisicing elit. Vero minima
              delectus nulla voluptates nesciunt quidem laudantium, quisquam
              voluptas facilis dicta in explicabo, laboriosam ipsam suscipit!
            </p>
          </div>
        </div>
      </section>

      <section className="section related-products">
        <div className="title">
          <h2>Related Products</h2>
          <span>Select from the premium product brands and save plenty money</span>
        </div>
        <div className="product-layout container">
          {[1,2,3,4].map(i => (
            <div key={i} className="product">
              <div className="img-container">
                <img src={productImages[i]} alt={`product-${i + 1}`} />
                <div className="addCart">
                  <i className="fa fa-shopping-cart"></i>
                </div>
                <ul className="side-icons">
                  <span><i className="fa fa-search"></i></span>
                  <span><i className="fa fa-heart"></i></span>
                  <span><i className="fa fa-sliders"></i></span>
                </ul>
              </div>
              <div className="bottom">
                <a href="">Achungha Mini Backpack</a>
                <div className="price">
                  <span>$150</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>
    </>
  );
};

export default ProductDetails;