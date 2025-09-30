
import about from '@/assets/about.jpg';
import Image from 'next/image';

const AboutUs = () => {
  return (
    <div className="w-full bg-gray-50 py-16">
      <div className="max-w-8xl mx-auto px-6 lg:px-20">
        {/* Heading */}
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-800">
            About <span className="text-blue-600">Us</span>
          </h2>
          <p className="mt-3 text-gray-600 max-w-2xl mx-auto">
            Welcome to <span className="font-semibold text-blue-600">Dava Bharti</span>, your
            trusted online pharmacy and healthcare partner in India.
          </p>
        </div>

        <div className="flex flex-col lg:flex-row items-center gap-12">
          {/* Image Section */}
          <div className="lg:w-1/2 flex justify-center">
            <Image
              src={about}
              alt="About Dava Bharti"
              className="w-full object-cover rounded-xl shadow-lg"
            />
          </div>

          {/* Content Section */}
          <div className="lg:w-1/2 flex flex-col justify-center space-y-6 h-full">
            <h3 className="text-3xl font-bold text-gray-900">About Dava Bharti</h3>
            <p className="text-gray-700 leading-relaxed">
              <span className="font-semibold">Dava Bharti</span> started as a small medical store in
              2007 and has grown into one of India’s most trusted e-commerce healthcare platforms.
              Our mission is simple:{' '}
              <strong>make healthcare reliable, affordable, and accessible for everyone.</strong>
            </p>

            <p className="text-gray-700 leading-relaxed">
              We provide a wide range of <span className="font-medium">authentic medicines</span>,
              healthcare essentials, and wellness products delivered straight to your
              doorstep—quick, safe, and hassle-free.
            </p>

            <p className="text-gray-700 leading-relaxed">
              With <span className="font-medium">experienced doctors</span>,
              <span className="font-medium"> online consultations</span>, and{' '}
              <span className="font-medium">diagnostic lab tests</span>, Dava Bharti ensures that
              your complete healthcare needs are covered in one place.
            </p>

            <p className="text-gray-700 leading-relaxed">
              We’re not just an online pharmacy—we’re your healthcare partner, here to support your
              well-being every step of the way.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AboutUs;
