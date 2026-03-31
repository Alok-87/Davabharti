type Review = {
  id: number;
  name: string;
  date: string;
  rating: number;
  comment: string;
};

type ReviewCardProps = {
  review: Review;
};

export default function ReviewCard({ review }: ReviewCardProps) {
  return (
    <div className="rounded-2xl border border-gray-200 p-5">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
        <div>
          <h4 className="text-lg font-semibold text-slate-900">{review.name}</h4>
          <p className="text-sm text-slate-500">{review.date}</p>
        </div>

        <div className="flex items-center gap-1 text-yellow-500">
          {Array.from({ length: 5 }).map((_, index) => (
            <span key={index}>{index < review.rating ? "★" : "☆"}</span>
          ))}
        </div>
      </div>

      <p className="mt-4 text-[15px] leading-7 text-slate-600">
        {review.comment}
      </p>
    </div>
  );
}