export default function AboutUsPage() {
  const lastUpdated = 'October 18, 2025';

  return (
    <div className="min-h-[80vh] bg-neutral-50">
      {/* Header Section */}
      <header className="relative isolate overflow-hidden bg-gradient-to-br from-primary/10 via-sky-200/30 to-indigo-100">
        <div className="mx-auto max-w-6xl px-6 py-16">
          <h1 className="mt-2 text-3xl md:text-5xl font-extrabold text-neutral-900">
            About Dava Bharti
          </h1>
          <p className="mt-4 max-w-3xl text-neutral-700 text-lg leading-relaxed">
            Dava Bharti started as a small medical store in 2007 and has grown into one of India’s
            most trusted e-commerce healthcare platforms. Our mission is simple: make healthcare
            reliable, affordable, and accessible for everyone.
          </p>
        </div>
      </header>

      {/* Main Content */}
      <main className="mx-auto max-w-6xl px-6 py-12 space-y-10">
        {/* Our Story */}
        <section className="rounded-2xl border border-neutral-200 bg-white p-6 shadow-sm">
          <h2 className="text-2xl font-semibold text-neutral-900">Who We Are</h2>
          <p className="mt-3 text-neutral-700 leading-relaxed">
            Welcome to <strong>Dava Bharti</strong>, your reliable online medical store for genuine
            healthcare products. We bring you easy access to prescription and over-the-counter
            medicines, wellness essentials, and healthcare products conveniently delivered to your
            doorstep. Our mission is to make healthcare affordable, accessible, and trustworthy for
            every household in India.
          </p>
        </section>

        {/* Our Mission */}
        <section className="rounded-2xl border border-neutral-200 bg-white p-6 shadow-sm">
          <h2 className="text-2xl font-semibold text-neutral-900">Our Mission</h2>
          <p className="mt-3 text-neutral-700 leading-relaxed">
            We provide a wide range of authentic medicines, healthcare essentials, and wellness
            products delivered straight to your doorstep — quick, safe, and hassle-free. With
            experienced doctors, online consultations, and diagnostic lab tests, Dava Bharti ensures
            that your complete healthcare needs are covered in one place.
          </p>
          <p className="mt-3 text-neutral-700 leading-relaxed">
            We’re not just an online pharmacy — we’re your healthcare partner, here to support your
            well-being every step of the way.
          </p>
        </section>

        {/* Why Choose Us */}
        <section className="rounded-2xl border border-neutral-200 bg-white p-6 shadow-sm">
          <h2 className="text-2xl font-semibold text-neutral-900">Why Choose Us?</h2>
          <ul className="mt-4 space-y-3 text-neutral-700 list-disc pl-6">
            <li>Affordable pricing with genuine products</li>
            <li>Fast doorstep delivery</li>
            <li>Safe and secure ordering experience</li>
            <li>Customer-first approach</li>
            <li>Trusted by thousands of families</li>
          </ul>
        </section>

        {/* Office Address */}
        <section className="rounded-2xl border border-neutral-200 bg-white p-6 shadow-sm">
          <h2 className="text-2xl font-semibold text-neutral-900">Registered Office</h2>
          <p className="mt-3 text-neutral-700 whitespace-pre-line leading-relaxed">
            Shop No. 3767, 33 Feet Road, Near Rajender Chowk, Block G, Sanjay Colony, Sector 23,
            Faridabad, Haryana 121005
          </p>
        </section>

        {/* Contact Info */}
        <section className="rounded-2xl border border-neutral-200 bg-white p-6 shadow-sm">
          <h2 className="text-2xl font-semibold text-neutral-900">Contact Us</h2>
          <ul className="mt-3 space-y-2 text-neutral-700">
            <li>
              Email:{' '}
              <a href="mailto:care@davabharti.com" className="text-primary underline">
                care@davabharti.com
              </a>
            </li>
            <li>
              Phone:{' '}
              <a href="tel:+918955801801" className="text-primary underline">
                +91 8955801801
              </a>
            </li>
          </ul>
        </section>

        {/* Last Updated */}
        <p className="text-sm text-neutral-500 text-right italic">
          Last updated on {lastUpdated}
        </p>
      </main>
    </div>
  );
}
