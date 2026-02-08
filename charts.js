

const chartColors = {
    primary: 'rgba(0, 240, 255, 1)',
    secondary: 'rgba(138, 43, 226, 1)',
    accent: 'rgba(255, 69, 0, 1)',
    light: 'rgba(0, 240, 255, 0.5)',
    grid: 'rgba(0, 240, 255, 0.1)',
};

const gradientColors = [
    'rgba(0, 240, 255, 0.8)',
    'rgba(138, 43, 226, 0.8)',
    'rgba(255, 69, 0, 0.8)',
    'rgba(0, 255, 136, 0.8)',
    'rgba(255, 215, 0, 0.8)',
];

document.addEventListener('DOMContentLoaded', () => {
    setTimeout(() => {
        initChartsWithAnimation();
    }, 500);
});

function initChartsWithAnimation() {
    Chart.defaults.color = 'rgba(200, 200, 200, 0.7)';
    Chart.defaults.borderColor = 'rgba(0, 240, 255, 0.1)';
    Chart.defaults.font.family = "'DM Sans', sans-serif";

    initRadarChart();
    initDonutChart();
    initBarChart();
    initHorizontalChart();
}

function initRadarChart() {
    const ctx = document.getElementById('radarChart');
    if (!ctx) return;

    new Chart(ctx, {
        type: 'radar',
        data: {
            labels: [
                'Backend',
                'Frontend',
                'Sécurité',
                'Architecture',
                'Bases de Données',
                'DevOps/Infrastructure'
            ],
            datasets: [{
                label: 'Niveau de Compétence',
                data: [95, 92, 65, 78, 94, 68],
                borderColor: chartColors.primary,
                backgroundColor: 'rgba(0, 240, 255, 0.15)',
                borderWidth: 3,
                pointBackgroundColor: chartColors.primary,
                pointBorderColor: '#fff',
                pointBorderWidth: 2,
                pointRadius: 6,
                pointHoverRadius: 8,
                fill: true,
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: true,
            plugins: {
                legend: {
                    display: true,
                    labels: {
                        color: chartColors.primary,
                        font: { size: 12, weight: 'bold' }
                    }
                }
            },
            scales: {
                r: {
                    min: 0,
                    max: 100,
                    beginAtZero: true,
                    grid: {
                        color: chartColors.grid,
                        lineWidth: 1
                    },
                    ticks: {
                        color: 'rgba(200, 200, 200, 0.5)',
                        stepSize: 20,
                        font: { size: 11 }
                    }
                }
            }
        }
    });
}

function initDonutChart() {
    const ctx = document.getElementById('donutChart');
    if (!ctx) return;

    new Chart(ctx, {
        type: 'doughnut',
        data: {
            labels: ['Java', 'Python', 'C#', 'Rust', 'C++', 'JavaScript'],
            datasets: [{
                data: [28, 22, 18, 15, 12, 5],
                backgroundColor: [
                    'rgba(0, 240, 255, 0.9)',
                    'rgba(138, 43, 226, 0.9)',
                    'rgba(255, 69, 0, 0.9)',
                    'rgba(0, 255, 136, 0.9)',
                    'rgba(255, 215, 0, 0.9)',
                    'rgba(255, 105, 180, 0.9)',
                ],
                borderColor: 'rgba(15, 23, 42, 1)',
                borderWidth: 3,
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: true,
            plugins: {
                legend: {
                    position: 'bottom',
                    labels: {
                        color: chartColors.primary,
                        font: { size: 12, weight: '500' },
                        padding: 15
                    }
                },
                tooltip: {
                    callbacks: {
                        label: function(context) {
                            return context.label + ': ' + context.parsed + '%';
                        }
                    }
                }
            }
        }
    });
}

function initBarChart() {
    const ctx = document.getElementById('barChart');
    if (!ctx) return;

    new Chart(ctx, {
        type: 'bar',
        data: {
            labels: [
                'Spring Boot',
                'REST API',
                'Vue.js',
                'React',
                'Angular',
                'Docker'
            ],
            datasets: [{
                label: 'Niveau de Maîtrise (%)',
                data: [95, 94, 89, 85, 84, 87],
                backgroundColor: gradientColors,
                borderColor: chartColors.primary,
                borderWidth: 2,
                borderRadius: 8,
                borderSkipped: false,
            }]
        },
        options: {
            indexAxis: 'y',
            responsive: true,
            maintainAspectRatio: true,
            plugins: {
                legend: {
                    display: true,
                    labels: {
                        color: chartColors.primary,
                        font: { size: 12, weight: 'bold' }
                    }
                }
            },
            scales: {
                x: {
                    min: 0,
                    max: 100,
                    grid: {
                        color: chartColors.grid,
                        lineWidth: 1
                    },
                    ticks: {
                        color: 'rgba(200, 200, 200, 0.5)',
                        font: { size: 11 }
                    }
                },
                y: {
                    grid: {
                        display: false
                    },
                    ticks: {
                        color: 'rgba(200, 200, 200, 0.7)',
                        font: { size: 12, weight: '500' }
                    }
                }
            }
        }
    });
}

function initHorizontalChart() {
    const ctx = document.getElementById('horizontalChart');
    if (!ctx) return;

    new Chart(ctx, {
        type: 'bar',
        data: {
            labels: [
                'Développement Backend',
                'Architecture Logicielle',
                'Sécurité & DevOps',
                'Frontend Web',
                'Machine Learning'
            ],
            datasets: [{
                label: 'Années d\'expérience',
                data: [6, 5, 2.5, 5.5, 1.5],
                backgroundColor: [
                    'rgba(0, 240, 255, 0.85)',
                    'rgba(138, 43, 226, 0.85)',
                    'rgba(255, 69, 0, 0.85)',
                    'rgba(0, 255, 136, 0.85)',
                    'rgba(255, 215, 0, 0.85)',
                ],
                borderColor: chartColors.primary,
                borderWidth: 2,
                borderRadius: 8,
                borderSkipped: false,
            }]
        },
        options: {
            indexAxis: 'y',
            responsive: true,
            maintainAspectRatio: true,
            plugins: {
                legend: {
                    display: true,
                    labels: {
                        color: chartColors.primary,
                        font: { size: 12, weight: 'bold' }
                    }
                }
            },
            scales: {
                x: {
                    min: 0,
                    max: 7,
                    grid: {
                        color: chartColors.grid,
                        lineWidth: 1
                    },
                    ticks: {
                        color: 'rgba(200, 200, 200, 0.5)',
                        font: { size: 11 }
                    }
                },
                y: {
                    grid: {
                        display: false
                    },
                    ticks: {
                        color: 'rgba(200, 200, 200, 0.7)',
                        font: { size: 11, weight: '500' }
                    }
                }
            }
        }
    });
}
