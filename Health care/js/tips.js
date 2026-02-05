// Tips Data
const tipsData = [
    {
        category: "Nutrition",
        icon: "ph-bowl-food",
        title: "Balanced Diet",
        description: "Eat a variety of foods including plenty of vegetables, fruits, and whole grains."
    },
    {
        category: "Personal Hygiene",
        icon: "ph-shower",
        title: "Daily Showering",
        description: "Maintain personal hygiene by showering daily to prevent infections and smell good."
    },
    {
        category: "Hand & Oral Hygiene",
        icon: "ph-hands-clapping",
        title: "Wash Your Hands",
        description: "Wash hands frequently with soap and water especially before eating."
    },
    {
        category: "Home Cleanliness",
        icon: "ph-broom",
        title: "Keep Home Clean",
        description: "Regularly clean living spaces to minimize dust and allergens."
    },
    {
        category: "Benefits of Exercise",
        icon: "ph-person-simple-run",
        title: "Daily Walk",
        description: "Walking for 30 minutes a day can significantly improve cardiovascular health."
    },
    {
        category: "Healthy Sleep",
        icon: "ph-moon",
        title: "7-8 Hours Sleep",
        description: "Aim for 7-8 hours of quality sleep each night for optimal brain function."
    },
    {
        category: "Warnings",
        icon: "ph-cigarette",
        title: "Avoid Smoking",
        description: "Smoking damages your lungs and increases risk of cancer. Quit today!"
    },
    {
        category: "Warnings",
        icon: "ph-beer-bottle",
        title: "Limit Alcohol",
        description: "Excessive alcohol consumption can lead to liver disease and other health issues."
    }
];

// Helper to check login status for access control (reused here if needed, but mainly in log.js)
// We will focus on rendering tips here.

const tipsGrid = document.getElementById('tips-grid');
const tipsSearch = document.getElementById('tips-search');

function renderTips(searchTerm = '') {
    if (!tipsGrid) return;

    tipsGrid.innerHTML = '';

    const filteredTips = tipsData.filter(tip =>
        tip.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        tip.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
        tip.category.toLowerCase().includes(searchTerm.toLowerCase())
    );

    if (filteredTips.length === 0) {
        tipsGrid.innerHTML = '<p>No tips found.</p>';
        return;
    }

    filteredTips.forEach(tip => {
        const card = document.createElement('div');
        card.className = 'tip-card card';
        card.innerHTML = `
            <div class="icon-box"><i class="ph-duotone ${tip.icon}"></i></div>
            <h3>${tip.title}</h3>
            <p class="category-tag">${tip.category}</p>
            <p>${tip.description}</p>
        `;
        tipsGrid.appendChild(card);
    });
}

if (tipsSearch) {
    tipsSearch.addEventListener('input', (e) => {
        renderTips(e.target.value);
    });
}

// Initial render
document.addEventListener('DOMContentLoaded', () => {
    renderTips();
});
