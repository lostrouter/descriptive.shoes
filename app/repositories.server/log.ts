import type { LogEntry } from "~/routes/home";
import { db } from "~/utils/db.server";

export async function createLog({
  userName,
  description,
  eventDate,
  location,
}: Pick<LogEntry, "userName" | "description" | "eventDate" | "location">) {
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
}
