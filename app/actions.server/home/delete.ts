import type { ActionFunctionArgs } from "react-router";
import { db } from "~/utils/db.server";
import type { ActionResult } from ".";

export async function deleteAction({
  request,
}: ActionFunctionArgs): Promise<ActionResult> {
  const formData = await request.formData();
  const id = formData.get("id") as string;

  if (!id) {
    return { success: false, error: "ID is required for deletion" };
  }

  try {
    await db.log.delete({
      where: { id: parseInt(id) },
    });

    return { success: true, message: "Log entry deleted successfully" };
  } catch (error) {
    console.error("Failed to delete log entry:", error);
    return { success: false, error: "Failed to delete log entry" };
  }
}
