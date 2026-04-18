let currentSpares = [];
let chartInstance = null;

document.addEventListener('DOMContentLoaded', async () => {
    try {
        currentSpares = await fetchWithAuth('/spares');
        const select = document.getElementById('spareSelect');
        
        currentSpares.forEach(spare => {
            const option = document.createElement('option');
            option.value = spare._id;
            option.textContent = `${spare.partNumber} - ${spare.name}`;
            select.appendChild(option);
        });

        select.addEventListener('change', (e) => {
            const spareId = e.target.value;
            if (spareId) {
                const spare = currentSpares.find(s => s._id === spareId);
                document.getElementById('lblD').textContent = `${spare.annualDemand} units`;
                document.getElementById('lblS').textContent = `$${spare.orderingCost} / order`;
                document.getElementById('lblH').textContent = `$${spare.holdingCost} / unit/yr`;
                document.getElementById('lblL').textContent = `${spare.leadTimeDays} days`;
                document.getElementById('spareDetails').style.display = 'block';
            } else {
                document.getElementById('spareDetails').style.display = 'none';
                document.getElementById('resultsArea').style.display = 'none';
                document.getElementById('noDataText').style.display = 'block';
                document.getElementById('graphContainer').style.display = 'none';
            }
        });

        document.getElementById('btnCalculate').addEventListener('click', async () => {
            const spareId = document.getElementById('spareSelect').value;
            if (!spareId) return;

            try {
                const eoqData = await fetchWithAuth(`/spares/${spareId}/eoq`);
                document.getElementById('resEOQ').textContent = eoqData.eoq;
                document.getElementById('resROP').textContent = eoqData.reorderPoint;
                
                document.getElementById('noDataText').style.display = 'none';
                document.getElementById('resultsArea').style.display = 'block';
                document.getElementById('graphContainer').style.display = 'block';

                drawEOQChart(eoqData);

            } catch(err) {
                console.error("Calculation failed", err);
            }
        });

    } catch (error) {
        console.error('Failed to load spares for EOQ:', error);
    }
});

function drawEOQChart(data) {
    const ctx = document.getElementById('eoqChart').getContext('2d');
    if (chartInstance) chartInstance.destroy();

    const points = 20;
    const step = (data.eoq * 2) / points;
    
    const labels = [];
    const holdingCostData = [];
    const orderingCostData = [];
    const totalCostData = [];

    for(let i=1; i<=points; i++) {
        let Q = step * i;
        labels.push(Math.round(Q));
        
        let hCost = (Q / 2) * data.holdingCost;
        let oCost = (data.annualDemand / Q) * data.orderingCost;
        
        holdingCostData.push(hCost);
        orderingCostData.push(oCost);
        totalCostData.push(hCost + oCost);
    }

    chartInstance = new Chart(ctx, {
        type: 'line',
        data: {
            labels: labels,
            datasets: [
                { label: 'Total Cost', data: totalCostData, borderColor: '#3b82f6', borderWidth: 3, tension: 0.4 },
                { label: 'Holding Cost', data: holdingCostData, borderColor: '#10b981', borderDash: [5, 5], tension: 0.4 },
                { label: 'Ordering Cost', data: orderingCostData, borderColor: '#f59e0b', borderDash: [5, 5], tension: 0.4 }
            ]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            interaction: { mode: 'index', intersect: false },
            scales: {
                y: { title: { display: true, text: 'Cost ($)', color: '#1e293b' }, grid: { color: 'rgba(0,0,0,0.05)' }, ticks: { color: '#64748b' } },
                x: { title: { display: true, text: 'Order Quantity (Units)', color: '#1e293b' }, grid: { color: 'rgba(0,0,0,0.05)' }, ticks: { color: '#64748b' } }
            },
            plugins: { legend: { labels: { color: '#1e293b' } } }
        }
    });
}
