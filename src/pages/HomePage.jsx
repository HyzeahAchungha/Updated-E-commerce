import React from 'react';
import Hero from '../components/Hero';
import Collection from '../components/Collection';
import FeaturedProducts from '../components/FeaturedProducts';
import NewProducts from '../components/NewProducts';
import Adverts from '../components/Adverts';
import Brands from '../components/Brands';

export default function HomePage() {
  return (
   <>
      <Hero />
      <Collection />
      <FeaturedProducts />
      <NewProducts />
      <Adverts />
      <Brands />
    </>
  )
}
