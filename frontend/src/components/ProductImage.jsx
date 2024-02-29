import React, { useState } from "react";

function ProductImages({ images }) {
  const [bigImage, setBigImage] = useState(
    images && images.length > 0 ? images[0] : null
  );
  return (
    <div className="md:w-2/5 ">
      <img
        loading="lazy"
        src={bigImage}
        alt=""
        className="max-h-[70svh] max-md:w-screen"
      />
      <div className="flex gap-x-2">
        {images.map((image) => (
          <img
            loading="lazy"
            src={image}
            className="h-16 border border-[#F85606] mt-2 cursor-pointer"
            alt="produ_image"
            key={image}
            onClick={() => setBigImage(image)}
          />
        ))}
      </div>
    </div>
  );
}

export default ProductImages;
