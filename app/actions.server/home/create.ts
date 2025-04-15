import type { ActionFunctionArgs } from "react-router";
import type { ActionResult } from ".";
import { createLog } from "~/repositories.server/log";

export async function createAction({
  request,
}: ActionFunctionArgs): Promise<ActionResult> {
  // have to clone the request
  const formData = await request.formData();

  const userName = formData.get("userName") as string;
  const description = formData.get("description") as string;
  const eventDate = formData.get("eventDate") as string;
  const location = formData.get("location") as string;

  // Validate form data
  if (!userName || !description || !eventDate || !location) {
    return { success: false, error: "All fields are required" };
  }

  try {
    // Create new log entry
    await createLog({
      userName,
      description,
      eventDate,
      location,
    });

    return { success: true, message: "Log entry created successfully" };
  } catch (error) {
    return { success: false, error: "Failed to create log entry" };
  }
}
