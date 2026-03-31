// components/ui/ToolTip.tsx
'use client';

import { Tooltip } from 'react-tooltip';
import 'react-tooltip/dist/react-tooltip.css';

interface ToolTipProps {
  id: string;
  content: string;
  place?: 'top' | 'bottom' | 'left' | 'right';
  delayShow?: number;
  delayHide?: number;
}

export default function ToolTip({
  id,
  content,
  place = 'top',
  delayShow = 200,
  delayHide = 100,
}: ToolTipProps) {
  return (
    <Tooltip
      id={id}
      place={place}
      content={content}
      delayShow={delayShow}
      delayHide={delayHide}
      className="!bg-gray-800 !text-white !text-sm !rounded-md !px-2 !py-1"
    />
  );
}
