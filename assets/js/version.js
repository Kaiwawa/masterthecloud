const APP_VERSION = 'v0.10.3';

const deploymentProgress = {
    'aws': 80,
    'azure': 60,
    'gcp': 75,
    'anthropic': 100,
    'cisco': 90,
    'fortinet': 50,
    'google-cloud': 60,
    'google-cyber': 75,
    'google-ml': 40,
    'isc2': 80,
    'crimson-data': 20,
    'ocp': 30,
    'soc1': 20,
    'soc2': 90,
    'azure-ai': 20
};

document.addEventListener('DOMContentLoaded', () => {
    // Set version
    document.querySelectorAll('.app-version').forEach(el => {
        el.innerText = APP_VERSION;
    });

    // Update progress bars
    Object.entries(deploymentProgress).forEach(([id, percentage]) => {
        const bar = document.querySelector(`#${id} .h-full`);
        const text = document.querySelector(`#${id} .text-[10px] font-black`);

        if (bar && text) {
            bar.style.width = percentage + '%';
            text.innerText = percentage + '%';

            // Change color at certain thresholds
            if (percentage < 33) {
                bar.style.backgroundColor = 'var(--color-red-500, #f87171)';
                text.style.color = 'var(--color-red-500, #f87171)';
            } else if (percentage < 66) {
                bar.style.backgroundColor = 'var(--color-amber-500, #fbbf24)';
                text.style.color = 'var(--color-amber-500, #fbbf24)';
            } else {
                bar.style.backgroundColor = 'var(--color-emerald-500, #34d399)';
                text.style.color = 'var(--color-emerald-500, #34d399)';
            }
        }
    });
});
