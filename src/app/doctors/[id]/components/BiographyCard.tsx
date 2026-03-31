type BiographyCardProps = {
  name: string;
  educationalBackground: string;
  experience: string;
};

export default function BiographyCard({
  name,
  educationalBackground,
  experience,
}: BiographyCardProps) {
  return (
    <div className="overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-sm">
      <div className="border-b border-gray-200 px-6 py-5">
        <h2 className="text-2xl font-bold text-slate-900">
          Biography Of {name}
        </h2>
      </div>

      <div className="space-y-8 px-6 py-6">
        <div>
          <h3 className="text-xl font-bold text-slate-900">
            Bio
          </h3>
          <p className="mt-4 text-[16px] leading-8 text-slate-500">
            {educationalBackground}
          </p>
        </div>

        <div>
          <h3 className="text-xl font-bold text-slate-900">
            Medical Experience & Skills
          </h3>
          <p className="mt-4 text-[16px] leading-8 text-slate-500">
            {experience}
          </p>
        </div>
      </div>
    </div>
  );
}