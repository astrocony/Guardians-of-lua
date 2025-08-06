document.addEventListener("DOMContentLoaded", function() {
    const secciones = document.querySelectorAll('.pantalla');

    const observer = new IntersectionObserver(entries => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
            }
        });
    }, {
        threshold: 0.1
    });

    secciones.forEach(seccion => {
        observer.observe(seccion);
    });
});
