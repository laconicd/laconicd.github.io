document.addEventListener("DOMContentLoaded", () => {
  const popover = document.getElementById("index-popover");
  if (!popover) return;

  popover.querySelectorAll("a[href]")?.forEach((link) => {
    link.addEventListener("click", () => popover.hidePopover());
  });
});
