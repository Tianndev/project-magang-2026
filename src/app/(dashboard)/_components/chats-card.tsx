"use client";

export function ChatsCard() {
    return (
        <div className="col-span-12 rounded-[10px] bg-white py-6 shadow-1 dark:bg-gray-dark dark:shadow-card xl:col-span-4">
            <h4 className="mb-6 px-7.5 text-xl font-bold text-dark dark:text-white">
                Chats
            </h4>
            <div className="px-7.5">
                <p>No chats available</p>
            </div>
        </div>
    );
}
