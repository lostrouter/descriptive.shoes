import { useState } from "react";
import { Form } from "react-router";

interface InlineLogEntryFormProps {
  lastUserName?: string;
  onSubmit: (lastUserName: string) => void;
}

export default function InlineLogEntryForm({
  lastUserName,
  onSubmit,
}: InlineLogEntryFormProps) {
  // Initialize form data with defaults and last user name
  const [formData, setFormData] = useState({
    userName: lastUserName || "",
    description: "",
    eventDate: new Date().toISOString().slice(0, 16), // Format for datetime-local input
    location: "",
  });

  // Handle form input changes
  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const resetForm = () => {
    setFormData({
      userName: lastUserName ?? "",
      description: "",
      eventDate: new Date().toISOString().slice(0, 16), // Format for datetime-local input
      location: "",
    });
  };

  const handleSubmit = () => {
    onSubmit(formData.userName);
    resetForm();
  };

  return (
    <Form method="post" className="mb-6" onSubmit={handleSubmit}>
      <input type="hidden" name="_action" value="create" />
      <div className="bg-[var(--card)] rounded-lg shadow-md border border-[var(--border)] overflow-hidden">
        <div className="p-4 bg-[var(--secondary)]">
          <h2 className="text-lg font-medium text-[var(--foreground)]">
            Add New Log Entry
          </h2>
        </div>

        <div className="p-4 grid grid-cols-1 md:grid-cols-5 gap-4">
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

          {/* Submit Button */}
          <div className="flex items-end">
            <button
              type="submit"
              className="w-full px-4 py-2 bg-[var(--primary)] text-[var(--primary-foreground)] rounded-md hover:bg-[var(--accent)] hover:text-[var(--accent-foreground)] transition-colors text-sm font-medium"
            >
              Add Entry
            </button>
          </div>
        </div>
      </div>
    </Form>
  );
}
