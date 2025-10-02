const btnMenu = document.getElementById('btn-menu');
const menu = document.getElementById('menu');
btnMenu.addEventListener('click', () => {
    menu.classList.toggle('hidden');
    menu.classList.toggle('desplegable');
});



