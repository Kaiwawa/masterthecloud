class DeploymentTracker {
    #version;
    #progressData;

    constructor(version, progressData) {
        this.#version = version;
        this.#progressData = progressData;
    }

    init() {
        this.#setVersion();
        this.#updateProgressBars();
    }

    #setVersion() {
        document.querySelectorAll('.app-version').forEach(el => {
            el.innerText = this.#version;
        });
    }

    #updateProgressBars() {
        Object.entries(this.#progressData).forEach(([id, percentage]) => {
            const card = document.querySelector(`[data-progress-id="${id}"]`);
            if (!card) return;

            const bar = card.querySelector('.progress-bar');
            const text = card.querySelector('.progress-text');

            if (bar && text) {
                bar.style.width = `${percentage}%`;
                text.innerText = `${percentage}%`;

                // Clear any existing progress color classes
                card.classList.remove('progress-red-500', 'progress-amber-500', 'progress-blue-500', 'progress-emerald-500');

                // Add the appropriate progress color class based on threshold
                card.classList.add(this.#getColorClass(percentage));
            }
        });
    }

    #getColorClass(percentage) {
        if (percentage < 33) return 'progress-red-500';
        if (percentage < 66) return 'progress-amber-500';
        if (percentage < 95) return 'progress-blue-500';
        return 'progress-emerald-500';
    }
}

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
    const tracker = new DeploymentTracker(APP_VERSION, deploymentProgress);
    tracker.init();
});
