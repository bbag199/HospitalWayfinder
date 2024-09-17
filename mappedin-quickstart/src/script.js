const btns = document.querySelectorAll('.btn'); 
const dropMenus = document.querySelectorAll('.drop-menu');

btns.forEach(btn => {
    btn.addEventListener('click', () => {
        const targetMenu = document.querySelector(btn.dataset.target);
        
        // Check if the clicked button is already active
        const isActive = btn.classList.contains('active');
        
        // Reset all buttons and menus
        btns.forEach(btn => btn.classList.remove('active'));
        dropMenus.forEach(dropmenu => dropmenu.classList.remove('active'));
        
        // Toggle only if the button wasn't already active
        if (!isActive) {
            btn.classList.add('active');
            targetMenu.classList.add('active');
        }
    });
})

window.onclick= (e) => {
    if (!e.target.matches('.btn')) {
        btns.forEach(btn => btn.classList.remove('active'));
        dropMenus.forEach(dropmenu => dropmenu.classList.remove('active'));
    }
}