const APP_VERSION = 'v0.9.3';

document.addEventListener('DOMContentLoaded', () => {
    document.querySelectorAll('.app-version').forEach(el => {
        el.innerText = APP_VERSION;
    });
});
