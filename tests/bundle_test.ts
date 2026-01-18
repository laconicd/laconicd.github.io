import { assertEquals } from "https://deno.land/std@0.224.0/assert/mod.ts";
import { existsSync } from "https://deno.land/std@0.224.0/fs/exists.ts";

Deno.test("Check if bundled scripts exist", async () => {
  // Run the build task
  const command = new Deno.Command(Deno.execPath(), {
    args: ["task", "build:scripts"],
  });
  const { success } = await command.output();
  assertEquals(success, true, "Build scripts task should succeed");

  // Check for the existence of bundled files
  const files = ["static/js/main.js", "static/js/post.js", "static/js/theme.js"];

  for (const file of files) {
    assertEquals(existsSync(file), true, `File ${file} should exist after bundling`);
  }
});
