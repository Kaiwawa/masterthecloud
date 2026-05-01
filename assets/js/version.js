const APP_VERSION = 'v0.8.5';

document.addEventListener('DOMContentLoaded', () => {
    document.querySelectorAll('.app-version').forEach(el => {
        el.innerText = APP_VERSION;
    });
});
