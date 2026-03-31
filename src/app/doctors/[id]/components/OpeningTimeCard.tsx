import { MdAccessTime, MdEventAvailable, MdEventBusy } from "react-icons/md";

type OpeningTime = {
  day: string;
  time: string;
};

type OpeningTimeCardProps = {
  openingTimes: OpeningTime[];
};

export default function OpeningTimeCard({
  openingTimes,
}: OpeningTimeCardProps) {
  const today = new Date().toLocaleDateString("en-US", {
    weekday: "long",
  });

  return (
    <div className="rounded-2xl border border-gray-200 bg-white p-5 sm:p-6 shadow-md">
      
      {/* Header */}
      <div className="flex items-center gap-2">
        <MdAccessTime className="text-sky-500 text-2xl" />
        <h3 className="text-xl sm:text-2xl font-bold text-slate-900">
          Opening Hours
        </h3>
      </div>

      <div className="mt-2 h-[1px]  rounded-full bg-black" />

      {/* List */}
      <div className="mt-4 divide-y divide-gray-100">
        {openingTimes.map((item, index) => {
          const isClosed = item.time.toLowerCase() === "closed";
          const isToday = item.day === today;

          return (
            <div
              key={index}
              className={`flex items-center justify-between py-3 px-2 rounded-lg transition 
              ${isToday ? "bg-sky-50" : "hover:bg-gray-50"}`}
            >
              {/* Day */}
              <div className="flex items-center gap-2">
                {isClosed ? (
                  <MdEventBusy className="text-red-400 text-lg" />
                ) : (
                  <MdEventAvailable className="text-emerald-500 text-lg" />
                )}

                <span
                  className={`text-sm sm:text-base ${
                    isToday
                      ? "font-semibold text-sky-600"
                      : "text-slate-700"
                  }`}
                >
                  {item.day}
                </span>
              </div>

              {/* Time */}
              <span
                className={`text-sm sm:text-base font-medium ${
                  isClosed
                    ? "text-red-400"
                    : "text-slate-600"
                }`}
              >
                {item.time}
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
}