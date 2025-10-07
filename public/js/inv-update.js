const form = document.querySelector("#addInventoryForm")
form.addEventListener("change", function () {
  const updateBtn = document.querySelector("button")
  updateBtn.removeAttribute("disabled")
})