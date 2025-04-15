import { useEffect, useState } from "react";
import { Form } from "react-router";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "~/components/ui/dialog";
import type { LogEntry } from "~/routes/home";

interface DialogEntryFormProps {
  data: Pick<
    LogEntry,
    "id" | "location" | "eventDate" | "description" | "userName"
  >;
}

export default function DialogEntryForm({ data }: DialogEntryFormProps) {
  const [formData, setFormData] = useState({
    ...data,
  });

  useEffect(() => {
    console.log(data);
  }, [data]);

  // Handle form input changes
  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  return (
    <Dialog>
      <DialogTrigger asChild>
        <button className="text-[var(--secondary-foreground)] hover:underline bg-transparent border-0 p-0 cursor-pointer">
          Edit
        </button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[600px]">
        <Form method="post">
          <DialogHeader>
            <DialogTitle>Edit Log</DialogTitle>
            <DialogDescription>
              Make changes to your log here. Click save when you're done.
            </DialogDescription>
          </DialogHeader>
          <div className="p-4 grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* User Name */}
            <div>
              <input type="hidden" name="_action" value="update" />
              <input type="hidden" name="id" value={data.id} />
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
                value={formData.userName}
                onChange={handleChange}
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
                value={formData.description}
                onChange={handleChange}
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
                value={formData.eventDate}
                onChange={handleChange}
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
                value={formData.location}
                onChange={handleChange}
                required
                className="w-full px-3 py-2 bg-[var(--background)] border border-[var(--border)] rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-[var(--ring)] text-[var(--foreground)]"
              />
            </div>
          </div>
          <DialogFooter>
            <button
              type="submit"
              className="w-full px-4 py-2 bg-[var(--primary)] text-[var(--primary-foreground)] rounded-md hover:bg-[var(--accent)] hover:text-[var(--accent-foreground)] transition-colors text-sm font-medium"
            >
              Save changes
            </button>
          </DialogFooter>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
