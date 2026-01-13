"use client";

import { useSession, signOut } from "next-auth/react";

export function UserInfo() {
    const { data: session, status } = useSession();

    if (status === "loading") {
        return <div>Loading...</div>;
    }

    if (!session) {
        return <div>Not authenticated</div>;
    }

    return (
        <div className="rounded-lg border border-stroke bg-white p-6 shadow-default dark:border-strokedark dark:bg-boxdark">
            <h3 className="mb-4 text-xl font-semibold text-black dark:text-white">
                User Session Info
            </h3>
            <div className="space-y-2">
                <p className="text-sm">
                    <span className="font-medium">Name:</span> {session.user.name}
                </p>
                <p className="text-sm">
                    <span className="font-medium">Email:</span> {session.user.email}
                </p>
                <p className="text-sm">
                    <span className="font-medium">Role:</span>{" "}
                    <span className="inline-flex rounded bg-primary/10 px-2 py-1 text-xs font-medium text-primary">
                        {session.user.role}
                    </span>
                </p>
                <p className="text-sm">
                    <span className="font-medium">User ID:</span> {session.user.id}
                </p>
            </div>
            <button
                onClick={() => signOut({ callbackUrl: "/auth" })}
                className="mt-4 rounded bg-danger px-4 py-2 text-sm font-medium text-white hover:bg-opacity-90"
            >
                Sign Out
            </button>
        </div>
    );
}

export function RoleGuard({
    children,
    allowedRoles,
}: {
    children: React.ReactNode;
    allowedRoles: Array<"USER" | "ADMIN" | "MANAGER">;
}) {
    const { data: session } = useSession();

    if (!session || !allowedRoles.includes(session.user.role)) {
        return (
            <div className="rounded-lg border border-danger bg-danger/10 p-4 text-danger">
                You don&apos;t have permission to view this content.
            </div>
        );
    }

    return <>{children}</>;
}
