// public/function.js
document.addEventListener("DOMContentLoaded", () => {
  const form = document.getElementById("franchiseForm");
  const popup = document.getElementById("confirmation-popup");
  const popupMessage = document.getElementById("confirmation-message");

  if (!form || !popup || !popupMessage) return;

  form.addEventListener("submit", async (e) => {
    e.preventDefault();

    const data = {
      full_name: form.full_name.value.trim(),
      email: form.email.value.trim(),
      phone_number: form.phone_number.value.trim(),
      preferred_location: form.preferred_location.value.trim(),
      interest: form.interest.value.trim(),
    };

    if (
      !data.full_name ||
      !data.email ||
      !data.phone_number ||
      !data.preferred_location ||
      !data.interest
    ) {
      showPopup("Please fill out all fields.", "error");
      return;
    }

    try {
      const res = await fetch("http://localhost:5000/submit", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });

      const result = await res.json();

      if (res.ok) {
        showPopup(
          `Thank you, ${data.full_name}! Your application was received.`,
          "success"
        );
        form.reset();
      } else {
        showPopup(
          result.message || "Problem submitting your application.",
          "error"
        );
      }
    } catch (err) {
      console.error(err);
      showPopup("Server error. Please try again later.", "error");
    }
  });

  function showPopup(message, type) {
    popupMessage.textContent = message;
    popup.classList.remove("success", "error", "hidden");
    popup.classList.add(type);

    setTimeout(() => popup.classList.add("hidden"), 6000);
  }

  popup.addEventListener("click", () => popup.classList.add("hidden"));
});
