document.addEventListener('DOMContentLoaded', async () => {
    try {
        const valData = await fetchWithAuth('/reports/valuation');
        if (valData) {
            document.getElementById('valTotal').textContent = `$${(valData.totalValue || 0).toLocaleString()}`;
            document.getElementById('valCount').textContent = valData.itemCount || 0;
        }

        const alertsData = await fetchWithAuth('/spares/low-stock');
        if (alertsData) {
            document.getElementById('alertCount').textContent = alertsData.length || 0;
        }

        const sparesData = await fetchWithAuth('/spares');
        if (!Array.isArray(sparesData)) {
            console.warn('Dashboard: No spares data received');
            return;
        }
        const labels = sparesData.map(s => s.name ? s.name.substring(0, 15) + (s.name.length > 15 ? '...' : '') : 'Unknown');
        const stockDataList = sparesData.map(s => s.currentStock || 0);
        const minStockDataList = sparesData.map(s => s.minimumStock || 0);

        // Bar Chart
        const ctx = document.getElementById('stockChart').getContext('2d');
        new Chart(ctx, {
            type: 'bar',
            data: {
                labels: labels,
                datasets: [{
                    label: 'Current Stock',
                    data: stockDataList,
                    backgroundColor: 'rgba(59, 130, 246, 0.8)',
                    borderRadius: 4
                }, {
                    label: 'Minimum Allowed Level',
                    data: minStockDataList,
                    type: 'line',
                    borderColor: 'rgba(239, 68, 68, 1)',
                    borderWidth: 2,
                    tension: 0.3,
                    fill: false
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                scales: {
                    y: { grid: { color: 'rgba(0,0,0,0.05)' }, ticks: { color: '#64748b' } },
                    x: { grid: { color: 'rgba(0,0,0,0.05)' }, ticks: { color: '#64748b' } }
                },
                plugins: { legend: { labels: { color: '#1e293b' } } }
            }
        });

        // Category Doughnut Chart
        const categories = {};
        sparesData.forEach(s => {
            categories[s.machineCategory] = (categories[s.machineCategory] || 0) + 1;
        });

        const catCtx = document.getElementById('categoryChart').getContext('2d');
        new Chart(catCtx, {
            type: 'doughnut',
            data: {
                labels: Object.keys(categories),
                datasets: [{
                    data: Object.values(categories),
                    backgroundColor: ['rgba(59, 130, 246, 0.8)', 'rgba(16, 185, 129, 0.8)', 'rgba(245, 158, 11, 0.8)'],
                    borderWidth: 0
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                cutout: '75%',
                plugins: { legend: { position: 'bottom', labels: { color: '#1e293b', padding: 20 } } }
            }
        });

        // Fake Activity Logs to simulate scrollable data
        const tbody = document.querySelector('#activityTable tbody');
        const eventTypes = ['Stock Updated', 'Threshold Alert', 'New Part Registered', 'Supplier Assigned'];
        const statuses = ['<span class="badge success">Success</span>', '<span class="badge warning">Warning</span>', '<span class="badge success">Complete</span>', '<span class="badge success">Verified</span>'];
        
        for(let i=0; i<8; i++) {
            const tr = document.createElement('tr');
            const date = new Date(Date.now() - (i * 3600000));
            const spare = sparesData[Math.floor(Math.random() * sparesData.length)]?.name || 'Unknown Part';
            tr.innerHTML = `
                <td style="color: var(--text-muted);">${date.toISOString().replace('T', ' ').substring(0, 16)}</td>
                <td><strong>${eventTypes[i % 4]}</strong></td>
                <td>${spare}</td>
                <td>${statuses[i % 4]}</td>
            `;
            tbody.appendChild(tr);
        }

    } catch (error) {
        console.error('Failed to load dashboard data:', error);
    }
});
