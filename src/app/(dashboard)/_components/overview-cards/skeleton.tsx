export function OverviewCardsSkeleton() {
    return (
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2 md:gap-6 xl:grid-cols-4 2xl:gap-7.5">
            <div className="h-24 animate-pulse rounded-lg bg-gray-200 dark:bg-gray-700"></div>
            <div className="h-24 animate-pulse rounded-lg bg-gray-200 dark:bg-gray-700"></div>
            <div className="h-24 animate-pulse rounded-lg bg-gray-200 dark:bg-gray-700"></div>
            <div className="h-24 animate-pulse rounded-lg bg-gray-200 dark:bg-gray-700"></div>
        </div>
    );
}
