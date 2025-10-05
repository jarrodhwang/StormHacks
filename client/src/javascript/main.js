const openBtn = document.querySelector(".btn-make-calendar");
const modal = document.getElementById("modal");
const cancelBtn = document.getElementById("cancel-btn");

openBtn.addEventListener("click", () => {
  modal.classList.add("active");
});

cancelBtn.addEventListener("click", () => {
  modal.classList.remove("active");
});

modal.addEventListener("click", (e) => {
  if (e.target === modal) modal.classList.remove("active");
});

 const form = document.getElementById("info-form");
      const result = document.getElementById("result");

      form.addEventListener("submit", async (e) => {
        e.preventDefault();

        const sender_name = document.getElementById("sender").value;
        const receiver_email = document.getElementById("receiver").value;

        const res = await fetch("http://localhost:3000/api/calendars", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ sender_name, receiver_email }),
        });

        const data = await res.json();
        result.textContent = JSON.stringify(data);
      });