// app/faq/page.tsx
import type { Metadata } from "next";

export const metadata: Metadata = {
    title: "FAQ – Delivery & Order Policy | DavaBharti",
    description:
        "Frequently asked questions about delivery, ordering, payments, prescriptions, tracking, and pricing.",
};

type Section = {
    id: string;
    title: string;
    content: React.ReactNode;
};

const sections: Section[] = [
    {
        id: "delivery",
        title: "Delivery",
        content: (
            <p>We deliver medicines only within India.</p>
        ),
    },
    {
        id: "delivery-charges",
        title: "Delivery Charges",
        content: (
            <ul className="list-disc pl-5 space-y-2">
                <li>Delivery is free for orders above ₹500.</li>
                <li>
                    For selected cities, delivery will remain free regardless of the order
                    amount. These cities will be shown during checkout.
                </li>
                <li>Any nominal delivery charges (if applicable) are shown before you confirm your order.</li>
            </ul>
        ),
    },
    {
        id: "order-by-email",
        title: "Order by Email",
        content: (
            <ol className="list-decimal pl-5 space-y-2">
                <li>Prepare a list of all medicines you’d like to order.</li>
                <li>Attach the prescription (scan or a clear photo).</li>
                <li>
                    Email to <a className="text-primary underline" href="mailto:davabharti23@gmail.com">davabharti23@gmail.com</a> with your full mailing address and pin code.
                </li>
                <li>Our team will contact you to confirm availability and process your order.</li>
                <li>Once confirmed, our service partners will process and fulfill your order promptly.</li>
            </ol>
        ),
    },
    {
        id: "service-days-time",
        title: "Service Days & Time",
        content: (
            <ul className="list-disc pl-5 space-y-2">
                <li>Place orders 24×7 via our website or app.</li>
                <li>Orders are serviced 7 days a week. If any delay occurs, our agent will inform you.</li>
                <li>
                    Support: <a className="text-primary underline" href="tel:+918955801801">+91 8955801801</a> (10 AM – 7 PM).
                </li>
            </ul>
        ),
    },
    {
        id: "not-at-home",
        title: "What If I Am Not at Home During Delivery?",
        content: (
            <p>
                Nominate a neighbor or someone nearby to receive the order and ensure they have the payable amount (if applicable).
            </p>
        ),
    },
    {
        id: "order-not-serviced",
        title: "If My Order Does Not Get Serviced",
        content: (
            <p>
                If an order cannot be fulfilled, we will refund the cost as store credits to your Wallet Account.
            </p>
        ),
    },
    {
        id: "payment-options",
        title: "Payment Options Available",
        content: (
            <ul className="list-disc pl-5 space-y-2">
                <li>Card payments</li>
                <li>Net Banking</li>
                <li>Bank Transfer</li>
                <li>Cash on Delivery (pay to our service partner upon delivery)</li>
            </ul>
        ),
    },
    {
        id: "edit-cancel-order",
        title: "How Can I Edit or Cancel My Order?",
        content: (
            <ul className="list-disc pl-5 space-y-2">
                <li>Email <a className="text-primary underline" href="mailto:davabharti23@gmail.com">davabharti23@gmail.com</a> with your order number before shipment, or</li>
                <li>Call <a className="text-primary underline" href="tel:+918955801801">+91 8955801801</a> before you receive the shipment confirmation email.</li>
            </ul>
        ),
    },
    {
        id: "prescriptions",
        title: "About Prescriptions",
        content: (
            <p>
                For prescription medicines, upload a valid prescription during ordering
                or email it later with your order ID to{" "}
                <a className="text-primary underline" href="mailto:davabharti23@gmail.com">davabharti23@gmail.com</a>.
            </p>
        ),
    },
    {
        id: "customer-care",
        title: "Customer Care",
        content: (
            <ul className="list-disc pl-5 space-y-2">
                <li>Email: <a className="text-primary underline" href="mailto:davabharti23@gmail.com">davabharti23@gmail.com</a></li>
                <li>Call: <a className="text-primary underline" href="tel:+918955801801">+91 8955801801</a> (9 AM – 9 PM, Mon–Sat)</li>
            </ul>
        ),
    },
    {
        id: "business-development",
        title: "Business Development & Partnerships",
        content: (
            <p>
                For partnerships, email{" "}
                <a className="text-primary underline" href="mailto:davabharti23@gmail.com">davabharti23@gmail.com</a> with the subject
                “Business Development” for faster response.
            </p>
        ),
    },
    {
        id: "quality-authenticity",
        title: "Quality & Authenticity of Medicines",
        content: (
            <p>
                We procure from certified pharmacists and regulated manufacturers (many are reputed manufacturers themselves).
                All medicines are genuine, high-quality, and within expiry.
            </p>
        ),
    },
    {
        id: "order-processed",
        title: "How Is My Order Processed?",
        content: (
            <ol className="list-decimal pl-5 space-y-2">
                <li>Upload the prescription.</li>
                <li>Pharmacist reviews and digitizes the prescription.</li>
                <li>Customer selects items, quantity, and payment method.</li>
                <li>Partner pharmacy delivers based on availability.</li>
            </ol>
        ),
    },
    {
        id: "availability",
        title: "How Will I Know the Availability of Medicines?",
        content: (
            <p>
                Price and stock fluctuate in real time; we’re working with partners to provide real-time updates on price & stock.
            </p>
        ),
    },
    {
        id: "confirmation-delay",
        title: "Why Can’t I Confirm Immediately After Uploading the Prescription?",
        content: (
            <p>
                Pharmacists must verify and digitize the prescription before the order can be confirmed.
            </p>
        ),
    },
    {
        id: "generic-substitutes",
        title: "Can I Buy Generic Substitutes?",
        content: (
            <p>
                Yes—if your doctor has prescribed the generic name instead of a brand, you can purchase its substitutes.
            </p>
        ),
    },
    {
        id: "track-order",
        title: "Can I Track My Order?",
        content: (
            <p>
                Yes, you’ll receive updates at each stage via SMS and email.
            </p>
        ),
    },
    {
        id: "price-change",
        title: "Why Do Medicine Prices Change?",
        content: (
            <p>
                Prices can vary due to location, batch numbers, regulations, and distributor pricing. Prices shown are indicative; the final invoice is shared after confirmation. For card/net banking payments, the exact payable amount is sent post final invoicing.
            </p>
        ),
    },
];

export default function FAQPage() {
    const lastUpdated = "October 23, 2025";

    return (
        <div className="min-h-screen bg-neutral-50 scroll-smooth">
            {/* Hero / Header */}
            <header className="relative isolate overflow-hidden bg-gradient-to-br from-primary/10 via-sky-200/30 to-indigo-100">
                <div className="mx-auto max-w-6xl px-6 py-16">
                    <p className="text-sm font-medium tracking-wide text-primary uppercase">Help</p>
                    <h1 className="mt-2 text-3xl md:text-5xl font-extrabold text-neutral-900">
                        FAQ – Delivery &amp; Order Policy
                    </h1>
                    <p className="mt-4 max-w-3xl text-neutral-700">
                        Answers to the most common questions about delivery, ordering, payments, prescriptions, and tracking.
                    </p>
                </div>
            </header>

            {/* Main */}
            <main className="mx-auto grid max-w-6xl grid-cols-1 gap-10 px-6 py-12 md:grid-cols-[280px_1fr]">
                {/* Sidebar */}
                <aside className="md:sticky md:top-40 h-max">
                    <div className="rounded-xl border bg-white p-4 shadow-sm">
                        <h2 className="text-sm font-semibold text-neutral-700 mb-3">On this page</h2>
                        <nav className="space-y-2">
                            {sections.map((s) => (
                                <a
                                    key={s.id}
                                    href={`#${s.id}`}
                                    className="block text-sm text-neutral-700 hover:text-primary"
                                >
                                    {s.title}
                                </a>
                            ))}
                        </nav>
                    </div>
                </aside>

                {/* Content */}
                <section className="space-y-8">
                    {sections.map((s) => (
                        <article
                            key={s.id}
                            id={s.id}
                            className="scroll-mt-40 rounded-2xl border bg-white p-6 md:p-8 shadow-sm"
                        >
                            <h3 className="text-xl md:text-2xl font-bold text-neutral-900 mb-3">
                                {s.title}
                            </h3>
                            <div className="prose prose-neutral max-w-none">
                                {s.content}
                            </div>
                        </article>

                    ))}
                </section>
            </main>
        </div>
    );
}
