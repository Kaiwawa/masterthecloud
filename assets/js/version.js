const APP_VERSION = 'v0.9.9';

document.addEventListener('DOMContentLoaded', () => {
    document.querySelectorAll('.app-version').forEach(el => {
        el.innerText = APP_VERSION;
    });
});
