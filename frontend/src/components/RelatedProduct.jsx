import React from 'react'
import Product from './Product'

function RelatedProduct({products}) {
  return (
    <div>
      {products.map((product)=>(
         <Product key={product._id} product={product} />
      ))}
    </div>
  )
}

export default RelatedProduct
