import React from 'react';
import Shimmer from './Shimmer';

const ShimmerMedicineDetails = () => {
  return (
    <div className="bg-white">
      <main className="mx-auto max-w-7xl sm:px-6 sm:pt-16 lg:px-8">
        <div className="mx-auto max-w-2xl lg:max-w-none">
          {/* Product */}
          <div className="lg:grid lg:grid-cols-2 lg:items-start lg:gap-x-8">
            {/* Image gallery */}
            <div className="flex flex-col-reverse">
              <div className="mx-auto mt-6 hidden w-full max-w-2xl sm:block lg:max-w-none">
                <Shimmer
                  elements={Array(4).fill({
                    width: 'w-full',
                    height: 'h-24',
                    rounded: 'rounded-md',
                  })}
                  className="grid grid-cols-4 gap-6"
                />
              </div>
              <div className="w-full aspect-square sm:rounded-lg">
                <Shimmer elements={[{ width: 'w-full', height: 'h-96', rounded: 'rounded-lg' }]} />
              </div>
            </div>

            {/* Product info */}
            <div className="mt-10 px-4 sm:mt-16 sm:px-0 lg:mt-0 space-y-4">
              {/* Product name */}
              <Shimmer elements={[{ width: 'w-3/4', height: 'h-8', rounded: 'rounded-md' }]} />

              {/* Price and discount */}
              <Shimmer
                elements={[
                  { width: 'w-1/4', height: 'h-6', rounded: 'rounded-md' },
                  { width: 'w-1/6', height: 'h-6', rounded: 'rounded-md' },
                  { width: 'w-1/5', height: 'h-6', rounded: 'rounded-md' },
                ]}
                className="flex space-x-3"
              />

              {/* Tax info */}
              <Shimmer elements={[{ width: 'w-1/3', height: 'h-4', rounded: 'rounded' }]} />

              {/* Reviews */}
              <Shimmer elements={[{ width: 'w-1/4', height: 'h-5', rounded: 'rounded' }]} />

              {/* Packaging and uses */}
              <Shimmer
                elements={[
                  { width: 'w-full', height: 'h-4', rounded: 'rounded' },
                  { width: 'w-full', height: 'h-4', rounded: 'rounded' },
                ]}
              />

              {/* Quantity selector and add to cart */}
              <Shimmer
                elements={[
                  { width: 'w-24', height: 'h-10', rounded: 'rounded-md' },
                  { width: 'w-full', height: 'h-10', rounded: 'rounded-md' },
                ]}
                className="flex gap-3 flex-wrap sm:flex-nowrap"
              />

              {/* Feature cards */}
              <Shimmer elements={[{ width: 'w-full', height: 'h-20', rounded: 'rounded-lg' }]} />
              <Shimmer elements={[{ width: 'w-full', height: 'h-20', rounded: 'rounded-lg' }]} />
              <Shimmer elements={[{ width: 'w-full', height: 'h-20', rounded: 'rounded-lg' }]} />
            </div>
          </div>
        </div>
      </main>

      {/* FAQ */}
      <div className="mt-10">
        <Shimmer
          elements={Array(5).fill({ width: 'w-full', height: 'h-10', rounded: 'rounded-md' })}
        />
      </div>
    </div>
  );
};

export default ShimmerMedicineDetails;
