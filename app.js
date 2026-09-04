document.querySelectorAll('.link-button[href="#"]').forEach((button) => {
  button.addEventListener('click', (event) => event.preventDefault())
})
