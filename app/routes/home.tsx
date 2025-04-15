import {
  Form,
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
import { homeAction } from "~/actions.server/home";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "~/components/ui/dialog";

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
export async function action(args: ActionFunctionArgs) {
  return homeAction(args);
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
          <Dialog>
            <DialogTrigger asChild>
              <button
                type="submit"
                className="text-[var(--secondary-foreground)] hover:underline bg-transparent border-0 p-0 cursor-pointer"
              >
                Edit
              </button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[600px]">
              <DialogHeader>
                <DialogTitle>Edit Log</DialogTitle>
                <DialogDescription>
                  Make changes to your log here. Click save when you're done.
                </DialogDescription>
              </DialogHeader>
              <div className="p-4 grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* User Name */}
                <div>
                  <label
                    htmlFor="userName"
                    className="block text-sm font-medium text-[var(--muted-foreground)] mb-1"
                  >
                    Name
                  </label>
                  <input
                    type="text"
                    id="userName"
                    name="userName"
                    required
                    className="w-full px-3 py-2 bg-[var(--background)] border border-[var(--border)] rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-[var(--ring)] text-[var(--foreground)]"
                  />
                </div>

                {/* Description */}
                <div>
                  <label
                    htmlFor="description"
                    className="block text-sm font-medium text-[var(--muted-foreground)] mb-1"
                  >
                    Description
                  </label>
                  <input
                    type="text"
                    id="description"
                    name="description"
                    required
                    className="w-full px-3 py-2 bg-[var(--background)] border border-[var(--border)] rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-[var(--ring)] text-[var(--foreground)]"
                  />
                </div>

                {/* Event Date */}
                <div>
                  <label
                    htmlFor="eventDate"
                    className="block text-sm font-medium text-[var(--muted-foreground)] mb-1"
                  >
                    Event Date
                  </label>
                  <input
                    type="datetime-local"
                    id="eventDate"
                    name="eventDate"
                    required
                    className="w-full px-3 py-2 bg-[var(--background)] border border-[var(--border)] rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-[var(--ring)] text-[var(--foreground)]"
                  />
                </div>

                {/* Location */}
                <div>
                  <label
                    htmlFor="location"
                    className="block text-sm font-medium text-[var(--muted-foreground)] mb-1"
                  >
                    Location
                  </label>
                  <input
                    type="text"
                    id="location"
                    name="location"
                    required
                    className="w-full px-3 py-2 bg-[var(--background)] border border-[var(--border)] rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-[var(--ring)] text-[var(--foreground)]"
                  />
                </div>
              </div>
              <DialogFooter>
                <button type="submit">Save changes</button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
          <Form method="post" style={{ display: "inline" }}>
            <input type="hidden" name="_action" value="delete" />
            <input type="hidden" name="id" value={info.row.original.id} />
            <button
              type="submit"
              className="text-[var(--destructive)] hover:underline bg-transparent border-0 p-0 cursor-pointer"
            >
              Delete
            </button>
          </Form>
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
      {actionData && !actionData.success && (
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
