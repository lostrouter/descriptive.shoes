import { describe, it, expect, vi } from "vitest";
import { createLog } from "~/repositories.server/log";
import { createAction } from "../create";

vi.mock("~/repositories.server/log", () => ({
  createLog: vi.fn(),
}));

describe("create action handler", () => {
  it("should return falsey success when error writing to db", async () => {
    vi.mocked(createLog).mockRejectedValueOnce("whoops");
    await expect(
      createAction({
        request: {
          formData: vi.fn().mockImplementation(async () => ({
            get: vi.fn().mockReturnValue("test data"),
          })),
        },
      } as never)
    ).resolves.toEqual({ success: false, error: "Failed to create log entry" });
  });
  it("should return falsey success when missing data", async () => {
    await expect(
      createAction({
        request: {
          formData: vi.fn().mockImplementation(async () => ({
            get: vi.fn().mockReturnValueOnce("test data"),
          })),
        },
      } as never)
    ).resolves.toEqual({ success: false, error: "All fields are required" });
  });
});
