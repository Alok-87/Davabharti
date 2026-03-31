"use client";

interface PolicySection {
  id: string;
  title: string;
  content: React.ReactNode;
}

const policySections: PolicySection[] = [
  {
    id: "return-policy",
    title: "Return Policy",
    content: (
      <>
        <p>
          We do our best to ensure that the products you order are delivered according to your specifications.
          However, if you receive an incomplete order, damaged or incorrect product(s), please notify
          Dava Bharti Customer Support immediately or within 6 working days of receiving the products
          for prompt resolution.
        </p>
        <p className="mt-3 font-medium">We accept returns if:</p>
        <ul className="list-disc pl-6 space-y-1">
          <li>You've received an item(s) that does not match your order</li>
          <li>The item(s) were damaged in transit or there is a shortage</li>
          <li>The item(s) is due to expire within 3 months</li>
        </ul>
        <p className="mt-3 text-sm text-neutral-600">
          Note: If you notice the package is damaged at the time of delivery, please do not accept the order.
        </p>
      </>
    ),
  },
  {
    id: "return-conditions",
    title: "Return Conditions",
    content: (
      <ul className="list-disc pl-6 space-y-2 text-sm">
        <li>Items must be returned in original manufacturer packaging with labels and barcode</li>
        <li>Only unused medicine strips/bottles can be returned</li>
        <li>Batch number must match the sales invoice</li>
        <li>Original sales invoice is required for return/refund processing</li>
      </ul>
    ),
  },
  {
    id: "no-returns",
    title: "Non-Returnable Items",
    content: (
      <ul className="list-disc pl-6 space-y-2 text-sm">
        <li>Partially used medicine strips or opened bottles</li>
        <li>Products requiring specific storage conditions like vaccines, injections, insulins</li>
        <li>Products that have expired post-purchase</li>
        <li>Second-time return request for the same product/order</li>
      </ul>
    ),
  },
  {
    id: "exceptions",
    title: "Exceptions",
    content: (
      <>
        <p>We do not offer returns or exchanges for:</p>
        <ul className="list-disc pl-6 space-y-1 text-sm mt-2">
          <li>Injections</li>
          <li>Health Monitoring Devices & Equipment</li>
          <li>Orthopedic Supports</li>
        </ul>
        <p className="mt-2 text-sm text-neutral-600">
          Some products are marked as “This item cannot be returned or exchanged.” Please check the product page before purchase.
        </p>
      </>
    ),
  },
  {
    id: "cancellation",
    title: "Cancellation Policy",
    content: (
      <>
        <p>
          Orders can be cancelled within 24 hours of ordering or before the order is shipped.
          Once shipped, cancellations are not possible.
        </p>
        <p className="mt-3 text-sm">
          To cancel your order, contact customer support at <strong>+91 8955801801</strong>.
        </p>
      </>
    ),
  },
  {
    id: "refund",
    title: "Refund Policy",
    content: (
      <>
        <p>You are eligible for a full refund if:</p>
        <ul className="list-disc pl-6 space-y-1 text-sm mt-2">
          <li>You received a defective item</li>
          <li>Your order was lost or damaged in transit</li>
          <li>You received expired products</li>
        </ul>
        <p className="mt-3 text-sm">Refunds are processed within 7–10 working days depending on your payment method.</p>
        <p className="mt-2 text-sm text-neutral-600">Send refund requests with order details to care@davabharti.com</p>
      </>
    ),
  },
  {
    id: "contact",
    title: "Contact Support",
    content: (
      <>
        <p>If you have any questions or need return assistance:</p>
        <ul className="mt-2 space-y-1 text-sm">
          <li>Call: +91 8955801801</li>
          <li>Email: care@davabharti.com</li>
        </ul>
      </>
    ),
  },
];

export default function ReturnRefundCancellationPolicyPage() {
  const lastUpdated = "October 18, 2025";

  return (
    <div className="min-h-[70vh] bg-neutral-50 scroll-smooth">
      {/* Header */}
      <header className="relative isolate overflow-hidden bg-gradient-to-br from-primary/10 via-sky-200/30 to-indigo-100">
        <div className="mx-auto max-w-6xl px-6 py-16">
          <p className="text-sm font-medium tracking-wide text-primary uppercase">Legal</p>
          <h1 className="mt-2 text-3xl md:text-5xl font-extrabold text-neutral-900">
            Return, Refund & Cancellation Policy
          </h1>
          <p className="mt-4 max-w-3xl text-neutral-700">
            Please read our policy carefully to understand how returns, refunds, and cancellations work at Dava Bharti.
          </p>
         
        </div>
      </header>

      {/* Layout */}
      <main className="mx-auto grid max-w-6xl grid-cols-1 gap-10 px-6 py-12 md:grid-cols-[300px_1fr]">
        {/* Sidebar */}
        <aside className="md:sticky md:top-40 h-max">
          <nav className="rounded-2xl border border-neutral-200 bg-white p-4 shadow-sm">
            <p className="mb-3 text-xs font-semibold uppercase tracking-wide text-neutral-500">On this page</p>
            <ul className="space-y-2 text-sm">
              {policySections.map((item) => (
                <li key={item.id}>
                  <a href={`#${item.id}`} className="hover:text-primary">
                    {item.title}
                  </a>
                </li>
              ))}
            </ul>
          </nav>
        </aside>

        {/* Content */}
        <section className="space-y-8">
          {policySections.map((item) => (
            <article
              key={item.id}
              id={item.id}
              className="scroll-mt-40 rounded-2xl border border-neutral-200 bg-white p-6 shadow-sm"
            >
              <h2 className="text-lg font-semibold text-neutral-900">{item.title}</h2>
              <div className="mt-3 text-neutral-700">{item.content}</div>
            </article>
          ))}
        </section>
      </main>
    </div>
  );
}
