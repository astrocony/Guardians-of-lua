
document.getElementById('fullscreen-btn').addEventListener('click', function() {
    const elem = document.documentElement; // Toma todo el documento

    if (!document.fullscreenElement) {
        if (elem.requestFullscreen) {
            elem.requestFullscreen();
        } else if (elem.webkitRequestFullscreen) { /* Safari */
            elem.webkitRequestFullscreen();
        } else if (elem.msRequestFullscreen) { /* IE11 */
            elem.msRequestFullscreen();
        }
    } else {
        if (document.exitFullscreen) {
            document.exitFullscreen();
        } else if (document.webkitExitFullscreen) { /* Safari */
            document.webkitExitFullscreen();
        } else if (document.msExitFullscreen) { /* IE11 */
            document.msExitFullscreen();
        }
    }
});


window.addEventListener('message', function(event) {
    if (event.origin !== 'https://cusdis.com') return;
    if (event.data && event.data.type === 'cusdis_resize') {
        const iframe = document.querySelector('iframe[src*="cusdis.com"]');
        if (iframe) {
            iframe.style.height = event.data.data + 'px';
        }
    }
});
