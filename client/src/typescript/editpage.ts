const menuButton = document.getElementById("menu-btn");
const dropdown = document.getElementById("dropdown-content");

menuButton?.addEventListener("click", () => {
  if (dropdown?.style.display === "block") {
    dropdown.style.display = "none";
  } else {
    dropdown!.style.display = "block";
  }
});
