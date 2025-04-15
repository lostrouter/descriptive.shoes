import type { ActionFunctionArgs } from "react-router";
import { db } from "~/utils/db.server";
import type { ActionResult } from ".";

export async function updateAction({
  request,
}: ActionFunctionArgs): Promise<ActionResult> {
  const formData = await request.formData();

  const id = formData.get("id") as string;
  const userName = formData.get("userName") as string;
  const description = formData.get("description") as string;
  const eventDate = formData.get("eventDate") as string;
  const location = formData.get("location") as string;

  // Validate form data
  if (!id || !userName || !description || !eventDate || !location) {
    return { success: false, error: "All fields are required" };
  }

  try {
    // update log entry
    await db.log.update({
      where: {
        id: parseInt(id),
      },
      data: {
        userName,
        description,
        eventDate: new Date(eventDate),
        location,
        updatedAt: new Date(),
      },
    });

    return { success: true, message: "Log entry updated successfully" };
  } catch (error) {
    return { success: false, error: "Failed to create log entry" };
  }
}
