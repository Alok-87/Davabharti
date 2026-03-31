"use client";

import { useAppSelector } from "@/store/hooks";

export default function AboutDavaBharti() {
  const { loading, data } = useAppSelector((state) => state.homepageData);

  if (loading || !data || !data.aboutUs?.content) return null;

  const aboutUs = data.aboutUs;

  return (
    <section className="w-full max-w-5xl mx-auto px-4 py-10 leading-relaxed">
      <div dangerouslySetInnerHTML={{ __html: aboutUs.content }}/>
    </section>
  );
}
