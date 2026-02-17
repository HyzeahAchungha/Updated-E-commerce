import React from 'react';
import ProductCard from './ProductCard';
import image1 from "../assets/images/product-10.jpg"
import image2 from "../assets/images/product-8.jpg"
import image3 from "../assets/images/product-14.jpg"
import image4 from "../assets/images/product-13.jpg"
import image5 from "../assets/images/product-11.jpg"
import image6 from "../assets/images/product-12.jpg"
import image7 from "../assets/images/product-7.jpg"
import image8 from "../assets/images/product-6.jpg"
import image9 from "../assets/images/product-3.jpg"
import image10 from "../assets/images/product-1.jpg"
import image11 from "../assets/images/product-4.jpg"
import image12 from "../assets/images/product-5.jpg"


const NewProducts = () => {
 const products = [
    { id: 1, image: image1, name: 'Achungha mini fruit', price: '$150' },
    { id: 2, image: image2, name: 'Achungha mini fruit', price: '$150' },
    { id: 3, image: image3, name: 'Achungha mini fruit', price: '$150' },
    { id: 4, image: image4, name: 'Achungha mini fruit', price: '$150' },
    { id: 5, image: image5, name: 'Achungha mini fruit', price: '$150' },
    { id: 6, image: image6, name: 'Achungha mini fruit', price: '$150' },
    { id: 7, image: image7, name: 'Achungha mini fruit', price: '$150' },
    { id: 8, image: image8, name: 'Achungha mini fruit', price: '$150' },
    { id: 9, image: image9, name: 'Achungha mini fruit', price: '$150' },
    { id: 10, image: image10, name: 'Achungha mini fruit', price: '$150' },
    { id: 11, image: image11, name: 'Achungha mini fruit', price: '$150' },
    { id: 12, image: image12, name: 'Achungha mini fruit', price: '$150' },
  ];

  return (
    <section className="section products">
      <div className="title">
        <h2>New Products</h2>
        <span> Fresh groceries and very affordable.</span>
      </div>
      <div className="product-layout">
        {products.map(product => (
          <ProductCard 
            key={product.id}
            id={product.id}
            image={product.image}
            name={product.name}
            price={product.price}
          />
        ))}
      </div>
    </section>
  );
};

export default NewProducts;