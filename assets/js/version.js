const APP_VERSION = 'v0.9.8.24';

document.addEventListener('DOMContentLoaded', () => {
    document.querySelectorAll('.app-version').forEach(el => {
        el.innerText = APP_VERSION;
    });
});
