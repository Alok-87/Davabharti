"use client";

interface Clause {
  id: string;
  title: string;
  content: React.ReactNode;
}

const clauses: Clause[] = [
  {
    id: "acceptance-of-terms",
    title: "Acceptance of Terms",
    content: (
      <p>
        Any and all use of this Web Site is subject to acceptance of the terms and conditions of use
        laid out in the following clauses. Usage, for the purposes of these terms and conditions, is
        deemed to be the reading or visiting of this Web Site, and/or the purchase of one or more
        products from the Web Site and is applicable to all Users, whether human beings, computers
        or companies and other organizations, incorporated or unincorporated.
      </p>
    ),
  },
  {
    id: "good-faith-usage",
    title: "Good Faith Usage",
    content: (
      <p>
        The Owners of this Web Site have published it in good faith and to the best of their ability
        and knowledge in the given subject area. The Users of the Web Site are therefore required to
        demonstrate similar good faith in their use of the Web Site, by keeping to the Terms and
        Conditions of Use, not publishing defamatory remarks about the Web Site or the Site's Owners
        in any media, electronic or otherwise and, should discussion forums be available on the Web
        Site, by behaving in a considerate and responsible fashion at all times. Failure to comply
        will result in Users being denied access to the Web Site and may even result in prosecution,
        should the behavior breach any laws of privacy, defamation, etc.
      </p>
    ),
  },
  {
    id: "jurisdiction",
    title: "Jurisdiction",
    content: (
      <p>
        In the event of any legal dispute arising from the use of this Web Site, irrespective of the
        country of origin of any third party, all such disputes will be resolved within the
        jurisdiction of the country of incorporation of the Web Site's owner(s) and not the country
        in which the Web Site is hosted unless otherwise stated.
      </p>
    ),
  },
  {
    id: "copyright",
    title: "Copyright",
    content: (
      <p>
        All material on this Web Site, whether in the Web Site itself or any product that may be
        sold therein, if products are sold via the Web Site, is subject to copyright and may not be
        reproduced in whole or in part without the Web Site owner's express permission. You may not
        modify, copy, or in any way reproduce, publish, distribute, sell, lease, license, create
        derivative works from, transfer, or sell any information or products obtained from this Web
        Site. Failure to obtain permission before reproducing such material may result in
        prosecution
      </p>
    ),
  },
  {
    id: "information-accuracy",
    title: "Information Accuracy",
    content: (
      <p>
        We make every endeavor to ensure the information on our Web Site is correct, but it is not
        always possible to keep everything up to date. The information is therefore provided without
        warranty or guarantee of any description, and the Web Site's owners cannot be held
        responsible for the use made of such information as may appear within the pages of the Web
        Site. It is the responsibility of the User to check current legislation and practices
        pertaining to their area of interest before acting upon information received via the Web
        Site. If you believe any of the information on this Web Site is inaccurate or incorrect,
        please contact us by email.
      </p>
    ),
  },
  {
    id: "third-party-communications",
    title: "Third Party Communications",
    content: (
      <p>
        We may occasionally pass on your contact details to carefully selected third parties who may
        offer you other products of interest. As per our Privacy Policy, you must contact us if you
        do NOT want your contact details to be used in this manner.
      </p>
    ),
  },
  {
    id: "forum-conduct",
    title: "Forum Conduct",
    content: (
      <p>
        Wherever there are discussion forums available on the Web Site, Users are required to remain
        polite about each other and about the Web Site itself. We take defamation very seriously and
        any defamatory remarks found on our forums will be removed and the User denied access.
      </p>
    ),
  },
  {
    id: "cookies-usage",
    title: "Cookies Usage",
    content: (
      <p>
        In order to improve our site and our service to you, we may occasionally use cookies. The
        purpose of such cookies is purely to help us personalize the information we deliver to you
        and does not imply storage of personal data, nor the tracking of your activity on the site.
        If you wish to delete such cookies after visiting the site, go to your browser's tools menu
        and select the 'clear cookies' option.
      </p>
    ),
  },
  {
    id: "cookie-settings",
    title: "Cookie Settings",
    content: (
      <p>
        For some of the functionalities of the Web Site, it may occasionally be necessary to use
        cookies. If your privacy settings are set too high, it may not be possible for you to view
        parts of our web site or complete certain processes on occasion. If this is the case, and
        you wish to proceed, you must adjust your browser's security settings to accept cookies. We
        accept no responsibility for Users being unable to see the site if they are unwilling to
        alter their security settings.
      </p>
    ),
  },
  {
    id: "changes-to-terms",
    title: "Changes to Terms",
    content: (
      <p>
        We may occasionally change of vary the contents of these Terms and Conditions. In the event
        that you purchased a product or service through us, it is the Terms and Conditions that were
        in place at the time of that purchase that will be valid.
      </p>
    ),
  },
];

export default function TermsAndConditionsPage() {
  const lastUpdated = "October 18, 2025";

  return (
    <div className="min-h-[70vh] bg-neutral-50 scroll-smooth">
      {/* Header */}
      <header className="relative isolate overflow-hidden bg-gradient-to-br from-primary/10 via-sky-200/30 to-indigo-100">
        <div className="mx-auto max-w-6xl px-6 py-16">
          <p className="text-sm font-medium tracking-wide text-primary uppercase">Legal</p>
          <h1 className="mt-2 text-3xl md:text-5xl font-extrabold text-neutral-900">
            Terms & Conditions
          </h1>
          <p className="mt-4 max-w-3xl text-neutral-700">
            Please read these Terms and Conditions carefully before using our website.
          </p>
        </div>
      </header>

      {/* Layout */}
      <main className="mx-auto grid max-w-6xl grid-cols-1 gap-10 px-6 py-12 md:grid-cols-[280px_1fr]">
        {/* Sidebar */}
        <aside className="md:sticky md:top-40 h-max">
          <nav className="rounded-2xl border border-neutral-200 bg-white p-4 shadow-sm">
            <p className="mb-3 text-xs font-semibold uppercase tracking-wide text-neutral-500">
              On this page
            </p>
            <ul className="space-y-2 text-sm">
              {clauses.map((c) => (
                <li key={c.id}>
                  <a href={`#${c.id}`} className="hover:text-primary">
                    {c.title}
                  </a>
                </li>
              ))}
            </ul>
          </nav>
        </aside>

        {/* Content */}
        <section className="space-y-8">
          {clauses.map((c) => (
            <article
              key={c.id}
              id={c.id}
              className="scroll-mt-40 rounded-2xl border border-neutral-200 bg-white p-6 shadow-sm"
            >
              <h2 className="text-lg font-semibold text-neutral-900">{c.title}</h2>
              <div className="mt-3 text-neutral-700">{c.content}</div>
            </article>
          ))}
        </section>
      </main>
    </div>
  );
}
