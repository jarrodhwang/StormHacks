// --- Modal open/close logic ---
const openBtn = document.querySelector(".btn-make-calendar");
const modal = document.getElementById("modal");
const cancelBtn = document.getElementById("cancel-btn");

openBtn.addEventListener("click", () => {
  modal.classList.add("active");
});

cancelBtn.addEventListener("click", () => {
  modal.classList.remove("active");
});

// Allow click outside modal to close
modal.addEventListener("click", (e) => {
  if (e.target === modal) modal.classList.remove("active");
});

// --- Form submission ---
const form = document.getElementById("info-form");
const result = document.getElementById("result");

form.addEventListener("submit", async (e) => {
  e.preventDefault();

  const sender_name = document.getElementById("sender").value.trim();
  const receiver_email = document.getElementById("receiver").value.trim();

  if (!sender_name || !receiver_email) {
    result.textContent = "⚠️ Please fill in both fields.";
    return;
  }

  try {
    const res = await fetch("http://localhost:3000/api/calendars", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ sender_name, receiver_email }),
    });

    const data = await res.json();

    if (res.ok) {
      console.log("✅ Calendar created:", data);
      result.textContent = "🎉 Calendar created successfully!";
      modal.classList.remove("active");
      form.reset();
    } else {
      console.error("❌ Error:", data.error);
      result.textContent = "Error: " + (data.error || "Unknown error");
    }
  } catch (err) {
    console.error("❌ Network error:", err);
    result.textContent = "Network error — check if the server is running.";
  }
});

// testing
