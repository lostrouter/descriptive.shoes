import {
  Link,
  type ActionFunctionArgs,
  type LoaderFunctionArgs,
} from "react-router";
import type { Route } from "./+types/home";
import {
  createColumnHelper,
  flexRender,
  getCoreRowModel,
  useReactTable,
} from "@tanstack/react-table";
import InlineLogEntryForm from "~/components/InlineLogEntryForm";
import { useEffect, useState } from "react";
import { db } from "~/utils/db.server";

export function meta({}: Route.MetaArgs) {
  return [
    { title: "Log Jammer" },
    { name: "description", content: "Welcome to Log Jammer" },
  ];
}

// Define the LogEntry type to match our domain model
export interface LogEntry {
  id: string;
  userName: string;
  description: string;
  eventDate: string; // ISO format date string
  location: string;
  createdAt: string;
  updatedAt?: string;
}

// Action function to handle form submissions
export async function action({ request }: ActionFunctionArgs) {
  const formData = await request.formData();

  const userName = formData.get("userName") as string;
  const description = formData.get("description") as string;
  const eventDate = formData.get("eventDate") as string;
  const location = formData.get("location") as string;

  // Validate form data
  if (!userName || !description || !eventDate || !location) {
    return { error: "All fields are required" };
  }

  try {
    // Create new log entry
    await db.log.create({
      data: {
        userName,
        description,
        eventDate: new Date(eventDate),
        location,
        createdAt: new Date(),
      },
    });

    console.log({
      data: {
        userName,
        description,
        eventDate: new Date(eventDate),
        location,
        createdAt: new Date(),
      },
    });

    return { success: true };
  } catch (error) {
    return { error: "Failed to create log entry" };
  }
}

// Loader function to provide data to the route
export async function loader(_args: LoaderFunctionArgs) {
  try {
    // Fetch log entries from the database
    const logs = await db.log.findMany({
      orderBy: { eventDate: "desc" },
    });

    // Format the dates as ISO strings for the frontend
    const logEntries = logs.map((log) => ({
      ...log,
      id: log.id.toString(), // Convert ID to string if it's a number
      eventDate: log.eventDate.toISOString(),
      createdAt: log.createdAt.toISOString(),
      updatedAt: log.updatedAt ? log.updatedAt.toISOString() : undefined,
    }));

    return { logEntries };
  } catch (error) {
    console.error("Failed to load log entries:", error);
    return { logEntries: [], error: "Failed to load log entries" };
  }
}

export default function Index({
  loaderData,
  actionData,
}: Route.ComponentProps) {
  const { logEntries } = loaderData;

  // Column helper for type safety
  const columnHelper = createColumnHelper<LogEntry>();

  // Define columns for our table
  const columns = [
    columnHelper.accessor("userName", {
      header: "Name",
      cell: (info) => info.getValue(),
    }),
    columnHelper.accessor("description", {
      header: "Description",
      cell: (info) => info.getValue(),
    }),
    columnHelper.accessor("eventDate", {
      header: "Event Date",
      cell: (info) => {
        const date = new Date(info.getValue());
        return date.toLocaleDateString("en-US", {
          year: "numeric",
          month: "long",
          day: "numeric",
          hour: "2-digit",
          minute: "2-digit",
        });
      },
    }),
    columnHelper.accessor("location", {
      header: "Location",
      cell: (info) => info.getValue(),
    }),
    columnHelper.display({
      id: "actions",
      header: "Actions",
      cell: (info) => (
        <div className="flex gap-2">
          <Link
            to={`/edit/${info.row.original.id}`}
            className="text-rosePineDawn-pine dark:text-rosePine-pine hover:underline"
          >
            Edit
          </Link>
          <Link
            to={`/delete/${info.row.original.id}`}
            className="text-rosePineDawn-love dark:text-rosePine-love hover:underline"
          >
            Delete
          </Link>
        </div>
      ),
    }),
  ];

  // Create table instance
  const table = useReactTable({
    data: logEntries,
    columns,
    getCoreRowModel: getCoreRowModel(),
  });

  const [lastUserName, setLastUsername] = useState("");

  // When a form is submitted
  const handleFormSubmit = (submittedUserName: string) => {
    // Store in session storage
    sessionStorage.setItem("lastUserName", submittedUserName);
    setLastUsername(submittedUserName);
  };

  // In useEffect to load from storage when component mounts
  useEffect(() => {
    const storedName = sessionStorage.getItem("lastUserName");
    if (storedName) {
      setLastUsername(storedName);
    }
  }, []);

  return (
    <div className="p-6 min-h-screen bg-[var(--background)]">
      <h1 className="text-3xl font-semibold mb-6 text-[var(--foreground)]">
        Log Entry Manager
      </h1>

      {/* Inline form for adding new entries */}
      <InlineLogEntryForm
        lastUserName={lastUserName}
        onSubmit={handleFormSubmit}
      />

      {/* Error message display */}
      {actionData?.error && (
        <div className="mb-4 p-4 bg-[var(--destructive)] bg-opacity-10 border border-[var(--destructive)] rounded-md text-[var(--destructive-foreground)]">
          {actionData.error}
        </div>
      )}

      {/* Success message display */}
      {actionData?.success && (
        <div className="mb-4 p-4 bg-[var(--accent)] bg-opacity-10 border border-[var(--accent)] rounded-md text-[var(--accent-foreground)]">
          Log entry created successfully!
        </div>
      )}

      {/* Table */}
      <div className="overflow-x-auto rounded-lg shadow-lg border border-[var(--border)]">
        <table className="min-w-full divide-y divide-[var(--border)]">
          <thead className="bg-[var(--secondary)]">
            {table.getHeaderGroups().map((headerGroup) => (
              <tr key={headerGroup.id}>
                {headerGroup.headers.map((header) => (
                  <th
                    key={header.id}
                    className="px-6 py-4 text-left text-sm font-medium text-[var(--muted-foreground)] tracking-wider"
                  >
                    {header.isPlaceholder
                      ? null
                      : flexRender(
                          header.column.columnDef.header,
                          header.getContext()
                        )}
                  </th>
                ))}
              </tr>
            ))}
          </thead>
          <tbody className="bg-[var(--card)] divide-y divide-[var(--border)]">
            {logEntries.length === 0 ? (
              <tr>
                <td
                  colSpan={5}
                  className="px-6 py-4 text-center text-[var(--muted-foreground)]"
                >
                  No log entries found. Add one using the form above!
                </td>
              </tr>
            ) : (
              table.getRowModel().rows.map((row) => (
                <tr key={row.id} className="hover:bg-[var(--secondary)]">
                  {row.getVisibleCells().map((cell) => (
                    <td
                      key={cell.id}
                      className="px-6 py-4 whitespace-nowrap text-[var(--foreground)]"
                    >
                      {flexRender(
                        cell.column.columnDef.cell,
                        cell.getContext()
                      )}
                    </td>
                  ))}
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
