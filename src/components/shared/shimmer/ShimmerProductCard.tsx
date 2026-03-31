import Shimmer from './Shimmer';

const ShimmerProductCard = () => {
  return (
    <Shimmer
      className="p-4 bg-white rounded-lg shadow relative"
      elements={[
        { width: 'w-full', height: 'aspect-square', rounded: 'rounded-xl' }, // image
        { width: 'w-3/4', height: 'h-5' }, // title
        { width: 'w-16', height: 'h-5' }, // price
        { width: 'w-full', height: 'h-4' }, // description line 1
        { width: 'w-5/6', height: 'h-4' }, // description line 2
      ]}
    />
  );
};
export default ShimmerProductCard;
