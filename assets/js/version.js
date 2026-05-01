const APP_VERSION = 'v0.10.9';

const deploymentProgress = {
    //Cloud Certifications
    'aws': 97,
    'azure': 70,
    'gcp': 70,
    //Security Certifications
    'comptia-sec': 50,
    'soc1': 30,
    'google-cyber': 60,
    'ccsp': 25,
    'cissp': 25,
    //Orchestration Certifications
    'cka': 65,
    //AI & ML
    'google-ml': 10,
    'azure-ai': 10
};

document.addEventListener('DOMContentLoaded', () => {
    // Set version
    document.querySelectorAll('.app-version').forEach(el => {
        el.innerText = APP_VERSION;
    });

    // Update progress bars
    Object.entries(deploymentProgress).forEach(([id, percentage]) => {
        const card = document.querySelector(`[data-progress-id="${id}"]`);
        if (!card) return;

        const bar = card.querySelector('.h-full');
        const text = card.querySelector('.progress-text');

        if (bar && text) {
            bar.style.width = percentage + '%';
            text.innerText = percentage + '%';

            // Change color at certain thresholds
            if (percentage < 33) {
                bar.style.backgroundColor = '#ef4444'; // Red-500
                text.style.color = '#ef4444';
            } else if (percentage < 66) {
                bar.style.backgroundColor = '#f59e0b'; // Amber-500
                text.style.color = '#f59e0b';
            } else if (percentage < 95) {
                bar.style.backgroundColor = '#fdf53dff'; // Blue-500
                text.style.color = '#fdf53dff';
            } else {
                bar.style.backgroundColor = '#10b981'; // Emerald-500
                text.style.color = '#10b981';
            }
        }
    });
});
