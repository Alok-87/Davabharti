import React from 'react';

interface AuthSlideCardProps {
  item: {
    image: string;
    title: string;
    description: string;
  };
}

const AuthSlideCard: React.FC<AuthSlideCardProps> = ({ item }) => {
  return (
    <div className="w-full flex flex-col items-center justify-center text-center px-4 py-6">
      <img
        src={item.image}
        alt={item.title}
        className="w-[180px] h-[200px] md:w-[220px] md:h-[300px] object-contain"
      />
      <h3 className="text-lg font-semibold mt-6">{item.title}</h3>
      <p className="text-gray-600 text-sm mt-3 line-clamp-2 mb-6">{item.description}</p>
    </div>
  );
};

export default AuthSlideCard;
