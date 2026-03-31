"use client";

interface PolicySection {
  id: string;
  title: string;
  content: React.ReactNode;
}

const policySections: PolicySection[] = [
  {
    id: "overview",
    title: "Overview",
    content: (
      <p>
        We collect the e-mail addresses of those who communicate with us via e-mail,
        aggregate information on what pages consumers access or visit, and
        information volunteered by the consumer...
      </p>
    ),
  },
  {
    id: "info-collection",
    title: "Information Gathering & Usage",
    content: (
      <>
        <p>
          When you register for <strong>Dava Bharti</strong>, we ask for
          information such as your name, email address, etc.
        </p>
        <ul className="list-disc pl-5 mt-2 text-sm">
          <li>Mobile number for login and communication</li>
          <li>Email for account verification and password reset</li>
          <li>Prescription upload when required by law</li>
        </ul>
      </>
    ),
  },
  {
    id: "sharing",
    title: "When We Share Information",
    content: (
      <ul className="list-disc pl-5 space-y-2">
        <li>To comply with law enforcement or legal investigations</li>
        <li>
          During company merger or acquisition, you will be notified before transfer
          of data
        </li>
      </ul>
    ),
  },
  {
    id: "cookies",
    title: "Cookies",
    content: (
      <p>
        Cookies help us deliver essential site functionality and user session
        handling.
      </p>
    ),
  },
  {
    id: "data-storage",
    title: "Data Storage",
    content: (
      <p>
        Your data is stored securely using reputed third-party cloud providers,
        access-controlled and encrypted.
      </p>
    ),
  },
  {
    id: "changes",
    title: "Changes to this Policy",
    content: (
      <p>
        We may update this privacy policy occasionally. Changes will be posted on
        this page.
      </p>
    ),
  },
  {
    id: "note",
    title: "Important Note on Medicines",
    content: (
      <p>
        We sell medicines only as permitted by Indian law against a valid
        prescription.
      </p>
    ),
  },
  {
    id: "contact",
    title: "Contact Us",
    content: (
      <ul className="space-y-2">
        <li>Email: privacy@davabharti.com</li>
        <li>Support: support@davabharti.com</li>
      </ul>
    ),
  },
];

export default function PrivacyPolicyPage() {
  return (
    <div className="min-h-screen bg-neutral-50 scroll-smooth">
      {/* Header */}
      <header className="bg-gradient-to-br from-primary/10 via-sky-200/30 to-indigo-100">
        <div className="max-w-6xl mx-auto px-6 py-16">
          <p className="text-sm uppercase text-primary">Legal</p>
          <h1 className="text-4xl font-bold">Privacy Policy</h1>
          <p className="text-neutral-700 mt-4">
            Your privacy matters to us. This page explains what data we collect,
            why we collect it, and how we keep it safe.
          </p>
        </div>
      </header>

      {/* Main layout */}
      <main className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-[250px_1fr] gap-8 px-6 py-12">
        {/* Sidebar */}
        <aside className="md:sticky md:top-40 h-max">
          <div className="bg-white shadow-sm border p-4 rounded-lg">
            <p className="text-sm font-semibold mb-2 text-neutral-600">On this page</p>
            <ul className="space-y-2">
              {policySections.map((s) => (
                <li key={s.id}>
                  <a href={`#${s.id}`} className="hover:text-primary text-sm">
                    {s.title}
                  </a>
                </li>
              ))}
            </ul>
          </div>
        </aside>

        {/* Content */}
        <section className="space-y-6">
          {policySections.map((section) => (
            <div
              key={section.id}
              id={section.id}
              className="scroll-mt-40 bg-white rounded-lg shadow-sm border p-6"
            >
              <h2 className="text-xl font-semibold">{section.title}</h2>
              <div className="text-neutral-700 mt-2">{section.content}</div>
            </div>
          ))}
        </section>
      </main>
    </div>
  );
}
