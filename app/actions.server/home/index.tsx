import type { ActionFunctionArgs } from "react-router";
import { createAction } from "./create";
import { deleteAction } from "./delete";
import { updateAction } from "./update";

// Define possible action results
export type ActionResult =
  | { success: true; message: string }
  | { success: false; error: string };

export async function homeAction(
  args: ActionFunctionArgs
): Promise<ActionResult> {
  // have to clone the request because form data can only be read once. https://github.com/remix-run/remix/discussions/9907
  const formData = await args.request.clone().formData();
  const actionType = formData.get("_action") as string | null;

  // Action handlers dictionary
  const handlers: Record<
    string,
    (args: ActionFunctionArgs) => Promise<ActionResult>
  > = {
    create: createAction,
    delete: deleteAction,
    update: updateAction,
    // Add other actions as needed
  };

  // Default to POST handler if no _action specified
  if (!actionType) {
    return createAction(args);
  }

  const handler = handlers[actionType];
  if (handler) {
    return handler(args);
  } else {
    return { success: false, error: `Action '${actionType}' not implemented` };
  }
}
