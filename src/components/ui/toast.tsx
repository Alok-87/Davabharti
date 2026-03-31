// utils/toasts.ts
import { toast } from 'sonner';
import { IoMdNotifications } from 'react-icons/io';
import { Bell } from 'lucide-react';

export const Toast = (message: string) => {
  toast.custom(() => (
    <div className="flex items-center gap-4 bg-blue-50 text-white border border-blue-200 shadow-2xl rounded-xl px-3 py-2 w-full max-w-[420px]">


      <div className="flex-shrink-0 relative flex items-center justify-center
                w-14 h-14 rounded-full bg-blue-200">

        {/* White ring */}
        <div className="flex items-center justify-center
                  w-11 h-11 rounded-full bg-[#2492D1]">

          {/* Inner blue circle */}
          <div className="flex items-center justify-center
                    w-8 h-8 rounded-full bg-white">
            <Bell className="w-5 h-5 text-primary" />
          </div>

        </div>
      </div>


      {/* Text */}
      <p className="text-base font-semibold leading-snug flex-1 text-black">
        {message}
      </p>
    </div>
  ));
};
