import { useLoaderData, type LoaderFunctionArgs } from "react-router";
import type { Route } from "./+types/home";
import {
  createColumnHelper,
  flexRender,
  getCoreRowModel,
  useReactTable,
} from "@tanstack/react-table";
import { format } from "date-fns";

export function meta({ }: Route.MetaArgs) {
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

// Loader function to provide data to the route
export async function loader(_args: LoaderFunctionArgs) {
  // Stub data - this would come from Prisma in the real implementation
  const logEntries: LogEntry[] = [
    {
      id: "1",
      userName: "John Doe",
      description: "Team meeting about new project",
      eventDate: "2025-04-10T14:00:00.000Z",
      location: "Conference Room A",
      createdAt: "2025-04-10T09:30:00.000Z",
    },
    {
      id: "2",
      userName: "Jane Smith",
      description: "Client presentation",
      eventDate: "2025-04-12T10:00:00.000Z",
      location: "Virtual Meeting Room",
      createdAt: "2025-04-11T08:45:00.000Z",
    },
    {
      id: "3",
      userName: "John Doe",
      description: "Follow-up with design team",
      eventDate: "2025-04-13T15:30:00.000Z",
      location: "Design Studio",
      createdAt: "2025-04-12T16:20:00.000Z",
    },
  ];

  return { logEntries };
}

export default function Index({ loaderData }: Route.ComponentProps) {
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
      cell: (info) => format(new Date(info.getValue()), "PPP p"), // Format date nicely
    }),
    columnHelper.accessor("location", {
      header: "Location",
      cell: (info) => info.getValue(),
    }),
    columnHelper.display({
      id: "actions",
      header: "Actions",
      cell: (_info) => (
        <div className="flex gap-2">
          <button className="text-blue-500 hover:text-blue-700">Edit</button>
          <button className="text-red-500 hover:text-red-700">Delete</button>
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

  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold mb-4">Log Entry Manager</h1>

      {/* Add new entry button */}
      <div className="mb-4">
        <button className="bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded">
          Add New Entry
        </button>
      </div>

      {/* Table */}
      <div className="overflow-x-auto bg-white rounded-lg shadow">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            {table.getHeaderGroups().map((headerGroup) => (
              <tr key={headerGroup.id}>
                {headerGroup.headers.map((header) => (
                  <th
                    key={header.id}
                    className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
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
          <tbody className="bg-white divide-y divide-gray-200">
            {table.getRowModel().rows.map((row) => (
              <tr key={row.id} className="hover:bg-gray-50">
                {row.getVisibleCells().map((cell) => (
                  <td key={cell.id} className="px-6 py-4 whitespace-nowrap">
                    {flexRender(cell.column.columnDef.cell, cell.getContext())}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
