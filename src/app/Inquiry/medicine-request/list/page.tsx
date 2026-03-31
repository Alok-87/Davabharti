'use client';

import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useRouter, useSearchParams } from 'next/navigation';
import { InboxIcon } from '@heroicons/react/16/solid';
import { AppDispatch, RootState } from '@/store';
import { getMyMedicineRequests } from '@/features/inquiry/inquiryThunks';
import { Button } from '@/components/ui/button';

const MedicineRequestListPage = () => {
    const router = useRouter();
    const searchParams = useSearchParams();
    const dispatch: AppDispatch = useDispatch();

    const { medicineRequests, loading, error } = useSelector(
        (state: RootState) => state.inquiry
    );

    const [limit, setLimit] = useState(20);
    const [expandedRow, setExpandedRow] = useState<string | null>(null);
    const page = parseInt(searchParams.get('page') || '1', 10);

    useEffect(() => {
        const offset = (page - 1) * limit;
        dispatch(getMyMedicineRequests({ offset, limit }));
    }, [dispatch, page, limit]);

    const handlePagination = (newPage: number) => {
        const params = new URLSearchParams(searchParams.toString());
        params.set('page', String(newPage));
        router.push(`?${params.toString()}`);
    };
    console.log('medicineRequests', medicineRequests);
    return (
        <div className="p-6 bg-gray-50 dark:bg-gray-900 rounded-lg">
            {/* Header */}
            <div className="flex justify-center items-center my-6">
                <h1 className="text-2xl font-bold text-gray-900 dark:text-gray-100">
                    Medicine Requests
                </h1>
            </div>

            {/* Main Content */}
            {loading ? (
                <p className="text-center py-10 text-gray-500">Loading...</p>
            ) : error ? (
                <p className="text-center py-10 text-red-500">Error: {error}</p>
            ) : medicineRequests.length === 0 ? (
                <div className="text-center py-10">
                    <InboxIcon className="h-20 w-20 mx-auto text-gray-400" />
                    <h2 className="mt-4 text-gray-600">No Medicine Requests Found</h2>
                    <p className="text-gray-500">Try adjusting your filters or search term.</p>
                </div>
            ) : (
                <div className="overflow-x-auto">
                    <table className="w-full border border-gray-200 dark:border-gray-700">
                        <thead className="bg-gray-100 dark:bg-gray-800">
                            <tr>
                                {[
                                    'Request ID',
                                    'Medicine Name',
                                    'Quantity',
                                    'Replied By',
                                    'Date',
                                    'Status',
                                    'Actions',
                                ].map((head) => (
                                    <th
                                        key={head}
                                        className="px-6 py-3 text-left text-xs font-semibold text-gray-600 dark:text-gray-300 uppercase"
                                    >
                                        {head}
                                    </th>
                                ))}
                            </tr>
                        </thead>
                        <tbody>
                            {medicineRequests.filter((req) => Boolean(req)).map((req) => (
                                <>
                                    <tr
                                        key={req.id}
                                        className="border-t hover:bg-gray-50 dark:hover:bg-gray-700 transition"
                                    >
                                        <td className="px-6 py-3">{req.medicineRequestId || 'NA'}</td>
                                        <td className="px-6 py-3">{req.medicineName}</td>
                                        <td className="px-6 py-3">{req.quantity}</td>
                                        <td className="px-6 py-3">{req.repliedByName || 'N/A'}</td>
                                        <td className="px-6 py-3">
                                            {new Date(req.createdAt).toLocaleDateString()}
                                        </td>
                                        <td className="px-6 py-3">
                                            <span
                                                className={`px-2 py-1 rounded text-xs font-medium ${req.reply
                                                    ? 'bg-green-100 text-green-800'
                                                    : 'bg-yellow-100 text-yellow-800'
                                                    }`}
                                            >
                                                {req.reply ? 'Replied' : 'Pending'}
                                            </span>
                                        </td>
                                        <td className="px-6 py-3">
                                            <Button
                                                size="sm"
                                                color="blue"
                                                disabled={!req.reply}
                                                onClick={() =>
                                                    setExpandedRow(expandedRow === req.id ? null : req.id)
                                                }
                                            >
                                                {expandedRow === req.id ? 'Hide' : 'View'}
                                            </Button>
                                        </td>
                                    </tr>

                                    {/* Expanded Reply Row */}
                                    {expandedRow === req.id && req.reply && (
                                        <tr>
                                            <td colSpan={7} className="bg-gray-50 dark:bg-gray-800 px-6 py-4">
                                                <div className="border border-gray-200 dark:border-gray-700 rounded-lg p-4 shadow-sm">
                                                    <h3 className="font-semibold text-gray-800 dark:text-gray-200 mb-2">
                                                        Reply
                                                    </h3>
                                                    <div
                                                        className="prose prose-sm dark:prose-invert max-w-none text-gray-700 dark:text-gray-300"
                                                        dangerouslySetInnerHTML={{ __html: req.reply.text }}
                                                    />
                                                    <p className="text-sm text-gray-500 dark:text-gray-400 mt-3">
                                                        <span className="font-medium text-gray-700 dark:text-gray-300">
                                                            Replied By:
                                                        </span>{' '}
                                                        {req.repliedByName || 'N/A'}
                                                    </p>
                                                    <p className="text-sm text-gray-500 dark:text-gray-400">
                                                        <span className="font-medium text-gray-700 dark:text-gray-300">
                                                            Replied At:
                                                        </span>{' '}
                                                        {new Date(req.reply.repliedAt).toLocaleString()}
                                                    </p>
                                                </div>
                                            </td>
                                        </tr>
                                    )}
                                </>
                            ))}
                        </tbody>
                    </table>
                </div>
            )}
        </div>
    );
};

export default MedicineRequestListPage;
