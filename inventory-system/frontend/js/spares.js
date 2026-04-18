document.addEventListener('DOMContentLoaded', async () => {
    try {
        const spares = await fetchWithAuth('/spares');
        const container = document.getElementById('sparesContainer');
        if (!Array.isArray(spares)) {
            console.warn('Spares Directory: No data received');
            return;
        }
        
        spares.forEach(spare => {
            const card = document.createElement('div');
            card.className = 'glass-panel spare-card';
            
            const maxCapacity = Math.max(spare.minimumStock * 3, spare.currentStock * 1.5, 50);
            let percent = (spare.currentStock / maxCapacity) * 100;
            if(percent > 100) percent = 100;

            let stockColor = 'var(--accent-color)';
            let statusText = 'Optimal Stock';
            if(spare.currentStock <= spare.minimumStock) {
                stockColor = 'var(--danger-color)';
                statusText = 'Low Output';
            } else if (spare.currentStock <= spare.minimumStock * 1.5) {
                stockColor = 'var(--warning-color)';
                statusText = 'Approaching Min';
            }

            card.innerHTML = `
                <img src="${spare.imageUrl}" alt="${spare.name}" class="spare-img" onerror="this.src='assets/images/dashboard_hero.png'">
                <div class="spare-details">
                    <span class="badge" style="background: rgba(0,0,0,0.05); margin-bottom: 10px; display:inline-block; color: var(--text-main); border: 1px solid var(--border-color);">${spare.partNumber}</span>
                    <h3>${spare.name}</h3>
                    <p style="color: var(--text-muted); font-size: 0.9rem; margin-bottom: 15px;">${spare.description}</p>
                    
                    <div style="display: flex; justify-content: space-between; align-items: center; margin-top: auto;">
                        <span style="font-weight: 600; font-size: 1.2rem;">${spare.currentStock} Units</span>
                        <span style="color: ${stockColor}; font-size: 0.85rem; font-weight: 600;">${statusText}</span>
                    </div>

                    <div class="stock-bar-container">
                        <div class="stock-bar" style="width: ${percent}%; background: ${stockColor};"></div>
                    </div>
                </div>
            `;
            container.appendChild(card);
        });
    } catch (error) {
        console.error('Failed to load spares:', error);
    }
});
