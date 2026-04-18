document.addEventListener('DOMContentLoaded', async () => {
    try {
        const reorderData = await fetchWithAuth('/reports/reorder');
        const tbody = document.querySelector('#reorderTable tbody');
        
        if (reorderData.length === 0) {
            document.getElementById('reorderTable').style.display = 'none';
            document.getElementById('emptyReport').style.display = 'block';
            return;
        }

        reorderData.forEach(item => {
            const tr = document.createElement('tr');
            tr.innerHTML = `
                <td>
                    <div style="font-weight: 600;">${item.name}</div>
                    <div style="font-size: 0.8rem; color: var(--text-muted);">${item.partNumber}</div>
                </td>
                <td><span class="badge" style="background: rgba(0,0,0,0.05); border: 1px solid var(--border-color); color: var(--text-main);">${item.id.substring(0, 5)}</span></td>
                <td><span style="color: var(--warning-color); font-weight: 700; font-size: 1.1rem;">${item.currentStock}</span></td>
                <td>${item.minimumStock}</td>
                <td><span style="color: var(--accent-color); font-weight: 700; font-size: 1.1rem;">+${item.suggestedOrderQuantity}</span></td>
                <td><button style="padding: 8px 16px; font-size: 0.85rem; border-radius: 6px;">Initiate PO</button></td>
            `;
            tbody.appendChild(tr);
        });

        // Fake supplier list for UI
        const supList = document.getElementById('supplierList');
        const suppliers = ['Global Tech Spares', 'Industrial Parts Inc.', 'Advanced Engine Ops'];
        const values = ['$12,540', '$8,200', '$4,100'];
        suppliers.forEach((sup, idx) => {
            const li = document.createElement('li');
            li.style = "padding: 15px 0; border-bottom: 1px solid var(--border-color); display: flex; justify-content: space-between;";
            li.innerHTML = `<span>${sup}</span> <span style="font-weight: 600;">${values[idx]}</span>`;
            supList.appendChild(li);
        });

    } catch (error) {
        console.error('Failed to load reports:', error);
    }
});
