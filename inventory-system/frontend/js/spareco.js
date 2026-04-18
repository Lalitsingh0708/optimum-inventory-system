/* ── MOBILE MENU ── */
function openMob(){ document.getElementById('mobMenu').classList.add('open'); }
function closeMob(){ document.getElementById('mobMenu').classList.remove('open'); }

// Ensure functions are global
window.deleteMachine = deleteMachine;
window.deleteSpare = deleteSpare;
window.deleteSupplier = deleteSupplier;
window.deleteOrder = deleteOrder;

/* ── CUSTOM CONFIRM MODAL ── */
function showConfirm(msg) {
    return new Promise((resolve) => {
        const modal = document.createElement('div');
        modal.id = 'customConfirmModal';
        modal.style.cssText = 'position:fixed; inset:0; background:rgba(0,0,0,0.6); backdrop-filter:blur(5px); z-index:99999; display:flex; align-items:center; justify-content:center; animation:fadeIn 0.2s ease;';
        modal.innerHTML = `
            <div style="background:#fff; border-radius:16px; width:min(400px, 90vw); padding:30px; box-shadow:0 25px 50px -12px rgba(0,0,0,0.25); text-align:center; transform:scale(0.9); animation:scaleIn 0.2s forwards ease-out;">
                <div style="font-size:3rem; margin-bottom:15px;">⚠️</div>
                <h3 style="margin-bottom:10px; color:var(--ink); font-size:1.2rem;">Confirm Action</h3>
                <p style="color:var(--muted); font-size:0.9rem; line-height:1.5; margin-bottom:25px;">${msg}</p>
                <div style="display:flex; gap:12px;">
                    <button id="cancelConfirm" style="flex:1; padding:12px; border:1px solid var(--border); background:#fff; border-radius:10px; cursor:pointer; font-weight:600; color:var(--muted);">Cancel</button>
                    <button id="okConfirm" style="flex:1; padding:12px; border:none; background:linear-gradient(135deg, var(--rust), #e74c3c); border-radius:10px; cursor:pointer; font-weight:700; color:#fff; box-shadow:0 4px 12px rgba(192,57,43,0.3);">Yes, Delete</button>
                </div>
            </div>
            <style>
                @keyframes fadeIn { from { opacity: 0; } to { opacity: 1; } }
                @keyframes scaleIn { to { transform: scale(1); } }
            </style>
        `;
        document.body.appendChild(modal);

        const close = (res) => {
            modal.remove();
            resolve(res);
        };

        document.getElementById('okConfirm').onclick = () => close(true);
        document.getElementById('cancelConfirm').onclick = () => close(false);
        modal.onclick = (e) => { if(e.target === modal) close(false); };
    });
}

// Global listener for delete buttons (backup plan)
document.addEventListener('click', (e) => {
    const btn = e.target.closest('button');
    if (!btn) return;
    const action = btn.getAttribute('data-action');
    const id = btn.getAttribute('data-id');
    
    // If it's a delete action, stop default behavior to keep the alert visible
    if (action && action.startsWith('delete-')) {
        e.preventDefault();
        e.stopPropagation();
        if (action === 'delete-machine') deleteMachine(id);
        if (action === 'delete-spare') deleteSpare(id);
        if (action === 'delete-supplier') deleteSupplier(id);
    }
});


/* ── SCROLL REVEAL ── */
const io = new IntersectionObserver(entries=>{
  entries.forEach(e=>{ if(e.isIntersecting) e.target.classList.add('up'); });
},{threshold:.1});
document.querySelectorAll('.reveal').forEach(el=>io.observe(el));

/* ── NAV ACTIVE LINK ── */
const sections = document.querySelectorAll('section[id]');
const navLinks = document.querySelectorAll('.nav-center a');
window.addEventListener('scroll',()=>{
  let cur='';
  sections.forEach(s=>{ if(window.scrollY>=s.offsetTop-120) cur=s.id; });
  navLinks.forEach(a=>{ a.classList.toggle('active', a.getAttribute('href')==='#'+cur); });
});

/* ── COUNT-UP ── */
const cntObs = new IntersectionObserver(entries=>{
  entries.forEach(e=>{
    if(!e.isIntersecting) return;
    const el=e.target;
    const target=+el.dataset.t;
    let n=0; const step=target/60;
    const t=setInterval(()=>{ n=Math.min(n+step,target); el.textContent=Math.round(n); if(n>=target)clearInterval(t); },25);
    // animate bar
    const bar=el.closest('.met-card').querySelector('.met-bar-fill');
    if(bar) setTimeout(()=>{ bar.style.width=bar.dataset.w+'%'; },100);
    cntObs.unobserve(el);
  });
},{threshold:.5});
document.querySelectorAll('.cnt').forEach(el=>cntObs.observe(el));

/* ── MODEL TABS ── */
function setModel(id, btn){
  document.querySelectorAll('.model-btn').forEach(b=>b.classList.remove('active'));
  document.querySelectorAll('.mpanel').forEach(p=>p.classList.remove('active'));
  btn.classList.add('active');
  document.getElementById('mp-'+id).classList.add('active');
}

/* ── CALCULATOR ── */
function doCalc(){
  const D=+document.getElementById('iD').value||0;
  const C=+document.getElementById('iC').value||0;
  const S=+document.getElementById('iS').value||0;
  const r=+document.getElementById('iH').value||0;
  const L=+document.getElementById('iL').value||0;
  const sd=+document.getElementById('iSD').value||0;
  const Z=+document.getElementById('iZ').value||1.645;

  if(!D||!S||!r||!C){ alert('Please fill in Annual Demand, Unit Cost, Ordering Cost, and Holding Rate.'); return; }

  const H=(r/100)*C;
  const EOQ=Math.sqrt((2*D*S)/H);
  const SS=Z*sd*Math.sqrt(L);
  const ROP=(D/365)*L+SS;
  const OPY=D/EOQ;
  const TAC=(D/EOQ)*S+(EOQ/2)*H;
  const CYC=365/OPY;

  set('r-eoq', Math.round(EOQ));
  set('r-ss',  Math.round(SS));
  set('r-rop', Math.round(ROP));
  set('r-opy', OPY.toFixed(1));
  set('r-tac', Math.round(TAC).toLocaleString('en-IN'));
  set('r-cyc', Math.round(CYC));

  setTimeout(()=>{ document.getElementById('rp-eoq').style.width=Math.min((EOQ/D)*400,100)+'%'; },100);
  document.getElementById('r-eoq').closest('.res-main').scrollIntoView({behavior:'smooth',block:'center'});
}
function set(id,v){ document.getElementById(id).textContent=v; }
document.querySelectorAll('input').forEach(el=>el.addEventListener('keydown',e=>{ if(e.key==='Enter')doCalc(); }));

/* ── DYNAMIC BACKEND INTEGRATION ── */
document.addEventListener('DOMContentLoaded', async () => {
  try {
    const res = await fetch('/api/spares');
    const spares = await res.json();
    
    // Update KPI strip logic with real totals
    if (spares && spares.length > 0) {
        document.getElementById('dashValEOQ').textContent = Math.round(spares.reduce((sum, s) => {
            const hCost = s.holdingCost || 1; 
            return sum + Math.sqrt((2 * s.annualDemand * s.orderingCost) / hCost);
        }, 0));
        
        const lowStockCount = spares.filter(s => s.currentStock <= s.minimumStock).length;
        document.getElementById('dashValSS').textContent = lowStockCount;

        // Render dashboard items
        const listContainer = document.querySelector('.items-list');
        listContainer.innerHTML = ''; // clear dummy data

        const icons = ['🔩', '⚙️', '🔧'];
        
        spares.slice(0, 5).forEach((spare, index) => {
            let percentage = Math.min((spare.currentStock / (spare.minimumStock * 3)) * 100, 100);
            
            let status = 's-ok';
            let statusText = 'Optimal';
            let color = 'var(--teal)';
            let iconBg = 'var(--teal-lt)';
            
            if (percentage < 30) {
                status = 's-low'; statusText = 'Reorder'; color = 'var(--rust)'; iconBg = 'var(--rust-lt)';
            } else if (percentage < 60) {
                status = 's-mid'; statusText = 'Monitor'; color = 'var(--gold)'; iconBg = 'var(--gold-lt)';
            }

            const row = document.createElement('div');
            row.className = 'item-row';
            row.innerHTML = `
              <div class="item-icon" style="background:${iconBg}">${icons[index % 3]}</div>
              <div class="item-meta">
                <div class="item-name">${spare.name}</div>
                <div class="item-code">${spare.partNumber} · ${spare.machineCategory.substring(0, 8)}</div>
              </div>
              <div class="item-right">
                <div class="prog-wrap"><div class="prog-fill" style="width:${percentage}%;background:${color}"></div></div>
                <div class="item-pct" style="color:${color}">${Math.round(percentage)}%</div>
                <div class="status-pill ${status}">${statusText}</div>
              </div>
            `;
            listContainer.appendChild(row);
        });
    }

    // Machine Operations
    await fetchMachines();

    // Supplier Operations
    await fetchSuppliers();

    // Spares Grid View
    await fetchSparesView();

    // Orders Grid View
    if(document.getElementById('ordersListGrid')) {
        await fetchOrdersView();
    }

  } catch (err) {
      console.error('Failed to fetch from backend', err);
  }
});

/* ── MACHINE OPERATIONS ── */
async function fetchMachines() {
  try {
    const res = await fetch('/api/machines');
    const machines = await res.json();
    const list = document.getElementById('machineList');
    list.innerHTML = '';
    
    if (machines.length === 0) {
       list.innerHTML = '<div style="padding:1rem;color:var(--muted);font-size:0.8rem;">No machines registered yet.</div>';
       return;
    }

    machines.forEach(m => {
       const badgeColor = m.status === 'Active' ? 'var(--teal)' : m.status === 'Maintenance' ? 'var(--gold)' : 'var(--rust)';
       const badgeBg = m.status === 'Active' ? 'var(--teal-lt)' : m.status === 'Maintenance' ? 'var(--gold-lt)' : 'var(--rust-lt)';
       
       const card = document.createElement('div');
       card.style.cssText = 'background:#fff; border:1px solid var(--border); border-radius:10px; padding:1rem; display:flex; justify-content:space-between; align-items:center; transition:all 0.2s;';
       card.innerHTML = `
         <div style="display:flex; gap:12px; align-items:center;">
            <div style="font-size:1.4rem; background:var(--warm); width:40px; height:40px; border-radius:8px; display:grid; place-items:center; flex-shrink:0;">🏭</div>
            <div>
               <div style="font-weight:700; color:var(--ink); font-size:0.9rem;">${m.machineName}</div>
               <div style="color:var(--muted); font-size:0.75rem; font-family:'JetBrains Mono',monospace; margin-top:3px;">📍 ${m.operatingCity}</div>
            </div>
         </div>
         <div style="display:flex; flex-direction:column; gap:6px; align-items:flex-end;">
            <span style="font-size:0.65rem; font-weight:600; padding:0.2rem 0.7rem; border-radius:100px; color:${badgeColor}; background:${badgeBg}; letter-spacing:0.04em; text-transform:uppercase; white-space:nowrap;">${m.status}</span>
             <button data-action="delete-machine" data-id="${m._id}" style="font-size:0.65rem; font-weight:600; padding:0.2rem 0.7rem; border-radius:100px; color:var(--rust); background:var(--rust-lt); border:none; cursor:pointer; letter-spacing:0.04em; text-transform:uppercase; white-space:nowrap;">Delete 🗑️</button>
         </div>
       `;
       list.appendChild(card);
    });
  } catch (error) {
    console.error('Error fetching machines:', error);
  }
}

async function deleteMachine(id) {
    if (!id) { console.error('Delete failed: No ID provided'); return; }
    const confirmed = await showConfirm('Are you sure you want to permanently delete this machine?');
    if (!confirmed) return;
    try {
        console.log('Sending DELETE request for machine:', id);
        const res = await fetch(`/api/machines/${id}`, { method: 'DELETE' });
        if (res.ok) {
            console.log('Machine deleted successfully');
            await fetchMachines();
        } else {
            const data = await res.json();
            alert('Error deleting machine: ' + (data.message || res.statusText));
        }
    } catch (error) {
        console.error('Network Error during machine deletion:', error);
        alert('Could not connect to the server. Please check your connection.');
    }
}

async function addMachine() {
   const name = document.getElementById('mName').value;
   const city = document.getElementById('mCity').value;
   const status = document.getElementById('mStatus').value;
   const msgBox = document.getElementById('mMsg');

   if(!name || !city){
      msgBox.style.color = "var(--rust)";
      msgBox.textContent = "Please provide both Name and City.";
      return;
   }

   try {
      const res = await fetch('/api/machines', {
         method: 'POST',
         headers: { 'Content-Type': 'application/json' },
         body: JSON.stringify({ machineName: name, operatingCity: city, status })
      });

      if (res.ok) {
         msgBox.style.color = "var(--teal)";
         msgBox.textContent = "Machine successfully registered!";
         document.getElementById('mName').value = '';
         document.getElementById('mCity').value = '';
         await fetchMachines(); // refresh list
         setTimeout(() => msgBox.textContent = '', 3000);
      } else {
         msgBox.style.color = "var(--rust)";
         msgBox.textContent = "Error registering machine.";
      }
   } catch(err) {
      console.error(err);
      msgBox.style.color = "var(--rust)";
      msgBox.textContent = "Failed to communicate with API.";
   }
}

/* ── SPARES & SUPPLIERS ── */

async function fetchSparesView() {
  try {
    const res = await fetch('/api/spares');
    const spares = await res.json();
    window.sparesData = spares; // cache locally for reorder modal
    
    const list = document.getElementById('sparesListGrid');
    if(!list) return; // if we're not on a page with it
    list.innerHTML = '';
    
    if (spares.length === 0) {
       list.innerHTML = '<div style="padding:1rem;color:var(--muted);font-size:0.8rem;">No spare parts registered yet.</div>';
       return;
    }

    spares.forEach(s => {
       const isLowStock = s.currentStock <= s.minimumStock;
       const stockPill = isLowStock 
         ? `<span style="background:var(--rust-lt); color:var(--rust); padding:2px 6px; border-radius:4px; font-weight:700; font-size:0.7rem;">CRITICAL: Reorder (${s.currentStock}/${s.minimumStock})</span>`
         : `<span style="background:var(--teal-lt); color:var(--teal); padding:2px 6px; border-radius:4px; font-weight:700; font-size:0.7rem;">Stock OK (${s.currentStock}/${s.minimumStock})</span>`;

       const card = document.createElement('div');
       card.style.cssText = `background:#fff; border:1px solid ${isLowStock ? 'var(--rust)' : 'var(--border)'}; border-radius:10px; padding:1.2rem; transition:all 0.2s;`;
       card.innerHTML = `
         <div style="display:flex;gap:15px;align-items:center;margin-bottom:0.8rem;">
            <div style="font-size:1.4rem; background:var(--rust-lt); width:40px; height:40px; border-radius:8px; display:grid; place-items:center;">🔧</div>
            <div>
               <div style="font-weight:700; color:var(--ink); font-size:1rem;">${s.name}</div>
               <div style="color:var(--muted); font-size:0.75rem;">🏷️ ${s.partNumber}</div>
            </div>
         </div>
         <div style="font-size:0.75rem; color:var(--muted); font-family:'JetBrains Mono',monospace; display:flex; flex-direction:column; gap:0.3rem; margin-bottom: 0.5rem;">
            <div>🏭 ${s.machineCategory}</div>
            <div>💰 ₹${s.unitPrice} per unit</div>
         </div>
         <div style="margin-bottom: 1rem;">
            ${stockPill}
         </div>
         <div style="display:flex; gap: 8px;">
            <button onclick="openEditModal('${s._id}', '${s.name.replace(/'/g, "\\'")}', '${s.partNumber.replace(/'/g, "\\'")}', '${s.machineCategory.replace(/'/g, "\\'")}', ${s.unitPrice})" style="flex:1; background:var(--gold-lt); border:none; padding:5px; border-radius:5px; cursor:pointer; font-size:0.75rem; color:var(--gold); font-weight:600;">Edit</button>
            <button data-action="delete-spare" data-id="${s._id}" style="flex:1; background:var(--rust-lt); border:none; padding:5px; border-radius:5px; cursor:pointer; font-size:0.75rem; color:var(--rust); font-weight:600;">Delete</button>
            <button onclick="openReorderModal('${s._id}')" style="flex:1; background:var(--teal-lt); border:none; padding:5px; border-radius:5px; cursor:pointer; font-size:0.75rem; color:var(--teal); font-weight:600;">Reorder</button>
         </div>
       `;
       list.appendChild(card);
    });
  } catch (error) {
    console.error('Error fetching spares view:', error);
  }
}

async function fetchSuppliers() {
  try {
    const res = await fetch('/api/suppliers');
    const suppliers = await res.json();
    window.suppliersData = suppliers; // Cache for PO dropdown
    const list = document.getElementById('supplierList');
    if(!list) return;
    list.innerHTML = '';
    
    if (suppliers.length === 0) {
       list.innerHTML = '<div style="padding:1rem;color:var(--muted);font-size:0.8rem;">No suppliers registered yet.</div>';
       return;
    }

    suppliers.forEach(s => {
       const card = document.createElement('div');
       card.style.cssText = 'background:#fff; border:1px solid var(--border); border-radius:10px; padding:1.2rem; transition:all 0.2s;';
       card.innerHTML = `
         <div style="display:flex;gap:15px;align-items:center;margin-bottom:0.8rem;">
            <div style="font-size:1.4rem; background:var(--teal-lt); width:40px; height:40px; border-radius:8px; display:grid; place-items:center;">📦</div>
            <div>
               <div style="font-weight:700; color:var(--ink); font-size:1rem;">${s.name}</div>
               <div style="color:var(--muted); font-size:0.75rem;">👤 ${s.contactPerson || 'N/A'}</div>
            </div>
         </div>
         <div style="font-size:0.75rem; color:var(--muted); font-family:'JetBrains Mono',monospace; display:flex; flex-direction:column; gap:0.3rem; margin-bottom:1rem;">
            <div>📧 ${s.email || 'N/A'}</div>
            <div>📞 ${s.phone || 'N/A'}</div>
         </div>
          <div style="display:flex; gap:8px;">
             <button data-action="delete-supplier" data-id="${s._id}" style="flex:1; background:var(--rust-lt); border:none; padding:6px; border-radius:5px; cursor:pointer; font-size:0.75rem; color:var(--rust); font-weight:600;">Delete 🗑️</button>
          </div>
       `;
       list.appendChild(card);
    });
  } catch (error) {
    console.error('Error fetching suppliers:', error);
  }
}

async function addSpare() {
   const name = document.getElementById('spName').value;
   const partNum = document.getElementById('spNum').value;
   const cat = document.getElementById('spCat').value;
   const price = document.getElementById('spPrice').value;
   const msgBox = document.getElementById('spMsg');

   if(!name || !partNum || !price || !cat){
      msgBox.style.color = "var(--rust)";
      msgBox.textContent = "Please provide Name, Part Num, Category, and Price.";
      return;
   }

   try {
      const res = await fetch('/api/spares', {
         method: 'POST',
         headers: { 'Content-Type': 'application/json' },
         body: JSON.stringify({ name, partNumber: partNum, machineCategory: cat, unitPrice: Number(price) })
      });

      if (res.ok) {
         msgBox.style.color = "var(--teal)";
         msgBox.textContent = "Spare Part registered successfully!";
         document.getElementById('spName').value = '';
         document.getElementById('spNum').value = '';
         document.getElementById('spCat').value = '';
         document.getElementById('spPrice').value = '';
         if(document.getElementById('sparesListGrid')) {
             await fetchSparesView(); // refresh spares grid
         }
         
         // Trigger a reload so the dashboard chart values update on top
         setTimeout(() => {
             msgBox.textContent = '';
             window.location.reload(); 
         }, 1500);
      } else {
         const data = await res.json();
         msgBox.style.color = "var(--rust)";
         msgBox.textContent = data.message || "Error registering spare.";
      }
   } catch(err) {
      console.error(err);
      msgBox.style.color = "var(--rust)";
      msgBox.textContent = "Failed to communicate with API.";
   }
}

async function addSupplier() {
   const name = document.getElementById('supName').value;
   const contact = document.getElementById('supContact').value;
   const email = document.getElementById('supEmail').value;
   const phone = document.getElementById('supPhone').value;
   const msgBox = document.getElementById('supMsg');

   if(!name){
      msgBox.style.color = "var(--rust)";
      msgBox.textContent = "Please provide at least a Company Name.";
      return;
   }

   try {
      const res = await fetch('/api/suppliers', {
         method: 'POST',
         headers: { 'Content-Type': 'application/json' },
         body: JSON.stringify({ name, contactPerson: contact, email, phone })
      });

      if (res.ok) {
         msgBox.style.color = "var(--teal)";
         msgBox.textContent = "Supplier registered successfully!";
         document.getElementById('supName').value = '';
         document.getElementById('supContact').value = '';
         document.getElementById('supEmail').value = '';
         document.getElementById('supPhone').value = '';
         await fetchSuppliers(); // refresh grid
         setTimeout(() => msgBox.textContent = '', 3000);
      } else {
         msgBox.style.color = "var(--rust)";
         msgBox.textContent = "Error registering supplier.";
      }
   } catch(err) {
      console.error(err);
      msgBox.style.color = "var(--rust)";
      msgBox.textContent = "Failed to communicate with API.";
   }
}

async function deleteSpare(id) {
    if (!id) { console.error('Delete failed: No ID provided'); return; }
    const confirmed = await showConfirm('Are you sure you want to permanently delete this spare part?');
    if (!confirmed) return;
    try {
        console.log('Sending DELETE request for spare:', id);
        const res = await fetch(`/api/spares/${id}`, { method: 'DELETE' });
        if (res.ok) {
            console.log('Spare deleted successfully');
            await fetchSparesView(); // refresh grid
            setTimeout(() => window.location.reload(), 500); // refresh dash
        } else {
            const data = await res.json();
            alert('Error deleting spare: ' + (data.message || res.statusText));
        }
    } catch (error) {
        console.error('Network Error during spare deletion:', error);
        alert('Could not connect to the server. Please check your connection.');
    }
}

function openEditModal(id, name, partNum, category, price) {
    const modal = document.getElementById('editSpareModal');
    if (!modal) return;
    
    document.getElementById('editSpId').value = id;
    document.getElementById('editSpName').value = name;
    document.getElementById('editSpNum').value = partNum;
    document.getElementById('editSpCat').value = category;
    document.getElementById('editSpPrice').value = price;
    document.getElementById('editSpMsg').textContent = '';
    
    modal.style.display = 'flex';
}

function closeEditModal() {
    const modal = document.getElementById('editSpareModal');
    if (modal) modal.style.display = 'none';
}

async function saveSpareEdit() {
    const id = document.getElementById('editSpId').value;
    const name = document.getElementById('editSpName').value;
    const partNum = document.getElementById('editSpNum').value;
    const cat = document.getElementById('editSpCat').value;
    const price = document.getElementById('editSpPrice').value;
    const msgBox = document.getElementById('editSpMsg');

    if(!name || !partNum || !price || !cat){
       msgBox.style.color = "var(--rust)";
       msgBox.textContent = "Please provide Name, Part Num, Category, and Price.";
       return;
    }

    try {
        const res = await fetch(`/api/spares/${id}`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ name, partNumber: partNum, machineCategory: cat, unitPrice: Number(price) })
        });

        if (res.ok) {
            msgBox.style.color = "var(--teal)";
            msgBox.textContent = "Spare part updated successfully!";
            await fetchSparesView(); // refresh grid
            setTimeout(() => {
                msgBox.textContent = '';
                closeEditModal();
                window.location.reload(); // update dashboard widgets at top
            }, 1000);
        } else {
            msgBox.style.color = "var(--rust)";
            msgBox.textContent = "Error updating spare part.";
        }
    } catch(err) {
        console.error(err);
        msgBox.style.color = "var(--rust)";
        msgBox.textContent = "Failed to communicate with API.";
    }
}

// -- REORDER LOGIC --
function openReorderModal(id) {
    const modal = document.getElementById('reorderSpareModal');
    if (!modal) return;
    
    const spare = window.sparesData.find(s => s._id === id);
    if(!spare) return;

    document.getElementById('reorderSpId').value = id;
    document.getElementById('reorderSpTitle').textContent = `${spare.name} (${spare.partNumber})`;
    document.getElementById('reorderSpQty').value = 10;
    document.getElementById('reorderSpPrice').value = spare.unitPrice * 10;
    
    // Populate Supplier Dropdown
    const supSelect = document.getElementById('reorderSpSupplier');
    supSelect.innerHTML = '<option value="">-- Select Supplier --</option>';
    if (window.suppliersData) {
        window.suppliersData.forEach(sup => {
            const opt = document.createElement('option');
            opt.value = sup._id;
            opt.textContent = sup.name;
            // auto select if it's the default supplier via backend relation, if available
            if(spare.supplier && (spare.supplier === sup._id || spare.supplier._id === sup._id)) {
                opt.selected = true;
            }
            supSelect.appendChild(opt);
        });
    }

    document.getElementById('reorderSpMsg').textContent = '';
    modal.style.display = 'flex';
    
    // Auto-update price when qty changes
    document.getElementById('reorderSpQty').oninput = (e) => {
       document.getElementById('reorderSpPrice').value = spare.unitPrice * (e.target.value || 0);
    };
}

function closeReorderModal() {
    const modal = document.getElementById('reorderSpareModal');
    if (modal) modal.style.display = 'none';
}

async function confirmReorder() {
    const id = document.getElementById('reorderSpId').value;
    const qty = Number(document.getElementById('reorderSpQty').value);
    const price = Number(document.getElementById('reorderSpPrice').value);
    const supplierId = document.getElementById('reorderSpSupplier').value;
    const msgBox = document.getElementById('reorderSpMsg');

    if(qty <= 0) {
       msgBox.style.color = "var(--rust)";
       msgBox.textContent = "Quantity must be greater than 0.";
       return;
    }
    if(!supplierId) {
       msgBox.style.color = "var(--rust)";
       msgBox.textContent = "Please select a Supplier for this order.";
       return;
    }

    // Redirect to Checkout
    const spareName = document.getElementById('reorderSpTitle').textContent;
    const checkoutUrl = `payment.html?id=${id}&supplier=${supplierId}&qty=${qty}&price=${price}&name=${encodeURIComponent(spareName)}`;
    window.location.href = checkoutUrl;
}

// -- ORDERS LIST RENDERING --
async function fetchOrdersView() {
    try {
        const res = await fetch('/api/orders');
        const orders = await res.json();
        const list = document.getElementById('ordersListGrid');
        if(!list) return;
        list.innerHTML = '';
        
        if(orders.length === 0) {
            list.innerHTML = '<div style="padding:1rem;color:var(--muted);font-size:0.8rem;">No active purchase orders.</div>';
            return;
        }

        orders.forEach(o => {
            const card = document.createElement('div');
            const isReceived = o.status === 'Received';
            const statusBg = isReceived ? 'var(--teal-lt)' : 'var(--gold-lt)';
            const statusColor = isReceived ? 'var(--teal)' : 'var(--gold)';
            const icon = isReceived ? '✅' : '⏳';

            card.style.cssText = `background:#fff; border:1px solid var(--border); border-radius:10px; padding:1.2rem; transition:all 0.2s; opacity: ${isReceived ? '0.7' : '1'};`;
            card.dataset.orderId = o._id;  // ← mark for direct removal
            card.innerHTML = `
                <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:0.8rem;">
                    <div style="font-weight:700; color:var(--ink); font-size:1rem;">PO: ${o.sparePart ? o.sparePart.name : 'Unknown Part'}</div>
                    <span style="background:${statusBg}; color:${statusColor}; padding:2px 6px; border-radius:4px; font-weight:700; font-size:0.7rem;">${icon} ${o.status}</span>
                </div>
                
                <div style="font-size:0.75rem; color:var(--muted); font-family:'JetBrains Mono',monospace; display:flex; flex-direction:column; gap:0.4rem; margin-bottom: 1rem;">
                    <div>📦 Ordered: <b>${o.quantityOrdered} Units</b></div>
                    <div>🏢 Supplier: <b>${o.supplier ? o.supplier.name : 'Unknown'}</b></div>
                    <div>💰 Cost: ₹${o.agreedPrice}</div>
                    <div style="font-size:0.65rem; color:#aaa; margin-top:0.3rem;">Order ID: ${o._id}</div>
                </div>

                ${!isReceived ? `
                <div style="display:flex; gap: 8px; flex-direction:column;">
                  <div style="display:flex; gap:8px;" id="actions-${o._id}">
                    <button onclick="askReceiveConfirm('${o._id}')" style="flex:1; background:var(--teal-lt); border:none; padding:5px; border-radius:5px; cursor:pointer; font-size:0.75rem; color:var(--teal); font-weight:600;">Mark Received 📥</button>
                    <button onclick="openRefundModal('${o._id}', '${(o.supplier ? o.supplier.name : 'Supplier').replace(/'/g, "\\'")}'  , '${(o.sparePart ? o.sparePart.name : 'Part').replace(/'/g, "\\'")}'  , ${o.agreedPrice}, ${o.quantityOrdered}, this)" style="flex:1; background:var(--rust-lt); border:none; padding:5px; border-radius:5px; cursor:pointer; font-size:0.75rem; color:var(--rust); font-weight:600;">Discard & Refund 💸</button>
                  </div>
                  <div id="confirm-receive-${o._id}" style="display:none; background:#f0fdf4; border:1px solid #86efac; border-radius:6px; padding:8px 10px; font-size:0.75rem; color:#16a34a; font-weight:600; align-items:center; gap:8px;">
                    ✅ Confirm stock received?
                    <button onclick="receiveOrder('${o._id}')" style="margin-left:auto; background:#16a34a; color:#fff; border:none; padding:4px 10px; border-radius:5px; cursor:pointer; font-size:0.72rem; font-weight:700;">Yes, Confirm</button>
                    <button onclick="cancelReceive('${o._id}')" style="background:#e2e8f0; color:#666; border:none; padding:4px 8px; border-radius:5px; cursor:pointer; font-size:0.72rem; font-weight:600;">Cancel</button>
                  </div>
                </div>
                ` : `
                <div style="display:flex; justify-content:flex-end;">
                  <button onclick="deleteOrder('${o._id}', this)" style="background:#f1f5f9; border:none; padding:5px 10px; border-radius:5px; cursor:pointer; font-size:0.7rem; color:#94a3b8; font-weight:600;">Clear Record</button>
                </div>
                `}
            `;
            list.appendChild(card);
        });
    } catch (err) {
        console.error('Failed to fetch orders:', err);
    }
}

/* Show inline confirm bar under the card's action row */
function askReceiveConfirm(orderId, btn) {
    const actionsRow  = document.getElementById('actions-' + orderId);
    const confirmRow  = document.getElementById('confirm-receive-' + orderId);
    if (actionsRow)  actionsRow.style.display  = 'none';
    if (confirmRow)  { confirmRow.style.display = 'flex'; }
}

function cancelReceive(orderId) {
    const actionsRow  = document.getElementById('actions-' + orderId);
    const confirmRow  = document.getElementById('confirm-receive-' + orderId);
    if (confirmRow)  confirmRow.style.display  = 'none';
    if (actionsRow)  actionsRow.style.display  = 'flex';
}

async function receiveOrder(orderId) {
    try {
        const res = await fetch(`/api/orders/${orderId}/receive`, { method: 'PUT' });
        if(res.ok) {
            await fetchOrdersView();
            await fetchSparesView();
        } else {
            alert('Failed to process receiving action');
        }
    } catch (error) { console.error(error); }
}

async function deleteOrder(orderId, btn) {
    // Find the actual card by its data attribute
    const card = document.querySelector(`[data-order-id="${orderId}"]`);

    // Remove any existing popup first
    const existingPop = document.getElementById('clearPop-' + orderId);
    if (existingPop) { existingPop.remove(); return; }

    // Build the mini popup
    const pop = document.createElement('div');
    pop.id = 'clearPop-' + orderId;
    pop.style.cssText = `
        position:absolute; bottom:calc(100% + 8px); right:0;
        background:#1e293b; color:#fff;
        border-radius:10px; padding:12px 16px;
        font-size:0.78rem; font-weight:600;
        box-shadow:0 8px 24px rgba(0,0,0,0.25);
        display:flex; flex-direction:column; gap:10px;
        z-index:999; min-width:200px;
        animation: popIn 0.18s ease;
    `;
    pop.innerHTML = `
        <div style="color:#94a3b8; font-size:0.7rem; text-transform:uppercase; letter-spacing:0.05em;">Clear Record</div>
        <div>Remove this completed order from the list?</div>
        <div style="display:flex; gap:8px;">
            <button id="clearYes-${orderId}" style="flex:1; background:#ef4444; color:#fff; border:none; padding:6px; border-radius:6px; cursor:pointer; font-size:0.75rem; font-weight:700;">🗑️ Delete</button>
            <button onclick="document.getElementById('clearPop-${orderId}').remove()" style="flex:1; background:#334155; color:#cbd5e1; border:none; padding:6px; border-radius:6px; cursor:pointer; font-size:0.75rem; font-weight:600;">Cancel</button>
        </div>
        <style>@keyframes popIn { from { transform:translateY(8px); opacity:0; } to { transform:translateY(0); opacity:1; } }</style>
    `;

    // Anchor popup to the button's parent row
    const btnParent = btn ? btn.parentElement : null;
    if (btnParent) {
        btnParent.style.position = 'relative';
        btnParent.appendChild(pop);
    }

    // Wire the Delete button
    document.getElementById('clearYes-' + orderId).onclick = async () => {
        pop.remove();
        if (btn) { btn.disabled = true; btn.textContent = '⏳'; }
        try {
            const res = await fetch(`/api/orders/${orderId}`, { method: 'DELETE' });
            if (res.ok) {
                if (card) {
                    card.style.transition = 'opacity 0.35s ease, transform 0.35s ease';
                    card.style.opacity = '0';
                    card.style.transform = 'scale(0.94)';
                    setTimeout(() => card.remove(), 380);
                } else {
                    await fetchOrdersView();
                }
            } else {
                alert('Failed to clear record');
                if (btn) { btn.disabled = false; btn.textContent = 'Clear Record'; }
            }
        } catch (err) {
            console.error(err);
            if (btn) { btn.disabled = false; btn.textContent = 'Clear Record'; }
        }
    };

    // Auto-dismiss popup after 4 seconds
    setTimeout(() => { const p = document.getElementById('clearPop-' + orderId); if (p) p.remove(); }, 4000);
}


/* ── REFUND MODAL ── */
function injectRefundModal() {
    if (document.getElementById('refundModal')) return;
    const modal = document.createElement('div');
    modal.id = 'refundModal';
    modal.style.cssText = 'display:none; position:fixed; inset:0; background:rgba(0,0,0,0.55); backdrop-filter:blur(4px); z-index:9999; align-items:center; justify-content:center;';
    modal.innerHTML = `
      <div style="background:#fff; border-radius:16px; width:min(480px,95vw); padding:0; box-shadow:0 24px 60px rgba(0,0,0,0.2); overflow:hidden; animation: slideUp 0.25s ease;">
        <!-- Header -->
        <div style="background:linear-gradient(135deg,#c0392b,#e74c3c); padding:24px 28px; position:relative;">
          <div style="font-size:1.2rem; font-weight:700; color:#fff; margin-bottom:4px;">💸 Discard & Request Refund</div>
          <div style="font-size:0.75rem; color:rgba(255,255,255,0.8);">A formal refund email will be sent to the supplier's company.</div>
          <button onclick="closeRefundModal()" style="position:absolute;top:16px;right:20px;background:rgba(255,255,255,0.2);border:none;color:#fff;font-size:1.1rem;width:30px;height:30px;border-radius:50%;cursor:pointer;display:grid;place-items:center;">✕</button>
        </div>

        <!-- Order Summary Strip -->
        <div id="refundOrderSummary" style="background:#fff8f8; border-bottom:1px solid #fde8e8; padding:14px 28px; display:flex; flex-wrap:wrap; gap:16px; font-size:0.75rem; font-family:'JetBrains Mono',monospace; color:#c0392b;"></div>

        <!-- Body -->
        <div style="padding:24px 28px;">
          <label style="display:block; font-size:0.8rem; font-weight:600; color:#555; margin-bottom:6px; text-transform:uppercase; letter-spacing:0.05em;">Reason for Refund Request</label>
          <textarea id="refundReason" rows="3" placeholder="e.g. Order cancelled by management, goods not required anymore..." style="width:100%; box-sizing:border-box; padding:10px 12px; border:1px solid #e5e7eb; border-radius:8px; font-family:inherit; font-size:0.85rem; color:#333; resize:vertical; outline:none; transition:border 0.2s;" onfocus="this.style.border='1px solid #e74c3c'" onblur="this.style.border='1px solid #e5e7eb'"></textarea>

          <div style="background:#fff8dc; border:1px solid #f5c518; border-radius:8px; padding:10px 14px; font-size:0.75rem; color:#7d5a00; margin-top:12px; line-height:1.6;">
            ⚠️ <b>Note:</b> Once sent, the refund email will be delivered to the supplier's registered email address and the order will be permanently removed from the system.
          </div>

          <div id="refundMsg" style="margin-top:10px; font-size:0.8rem; font-weight:600; min-height:20px;"></div>
        </div>

        <!-- Footer -->
        <div style="padding:16px 28px 24px; display:flex; gap:10px;">
          <button onclick="closeRefundModal()" style="flex:1; padding:10px; border:1px solid #e5e7eb; background:#fff; border-radius:8px; cursor:pointer; font-size:0.85rem; color:#666; font-weight:600;">Cancel</button>
          <button id="sendRefundBtn" onclick="sendRefundAndDiscardOrder()" style="flex:2; padding:10px; background:linear-gradient(135deg,#c0392b,#e74c3c); border:none; border-radius:8px; cursor:pointer; font-size:0.85rem; color:#fff; font-weight:700; transition:opacity 0.2s;">📧 Send</button>
        </div>
      </div>
      <style>@keyframes slideUp { from { transform:translateY(30px); opacity:0; } to { transform:translateY(0); opacity:1; } }</style>
    `;
    document.body.appendChild(modal);
}

let _refundOrderId = null;
let _refundCard = null;

function openRefundModal(orderId, supplierName, spareName, amount, qty, triggerBtn) {
    injectRefundModal();
    _refundOrderId = orderId;
    // Store the card element so we can remove it on success
    _refundCard = triggerBtn ? triggerBtn.closest('div[style]') : null;
    const modal = document.getElementById('refundModal');
    const summary = document.getElementById('refundOrderSummary');
    summary.innerHTML = `
      <span>📦 <b>${spareName}</b></span>
      <span>🏢 ${supplierName}</span>
      <span>🔢 ${qty} Units</span>
      <span>💰 ₹${Number(amount).toLocaleString('en-IN')}</span>
    `;
    document.getElementById('refundReason').value = '';
    document.getElementById('refundMsg').textContent = '';
    const btn = document.getElementById('sendRefundBtn');
    if (btn) { btn.disabled = false; btn.style.opacity = '1'; btn.textContent = '📧 Send'; }
    modal.style.display = 'flex';
}

function closeRefundModal() {
    const modal = document.getElementById('refundModal');
    if (modal) modal.style.display = 'none';
    _refundOrderId = null;
}

async function sendRefundAndDiscardOrder() {
    if (!_refundOrderId) return;
    const reason = document.getElementById('refundReason').value.trim() || 'Order cancelled and discarded by procurement management.';
    const msgBox = document.getElementById('refundMsg');
    const btn = document.getElementById('sendRefundBtn');
    btn.disabled = true;
    btn.style.opacity = '0.6';
    btn.textContent = '⏳ Sending...';
    msgBox.style.color = 'var(--gold)';
    msgBox.textContent = '';
    try {
        const res = await fetch(`/api/orders/${_refundOrderId}/refund`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ reason })
        });
        const data = await res.json();
        if (res.ok) {
            // Change button to Done
            btn.textContent = '✅ Done';
            btn.style.opacity = '1';
            btn.style.background = 'linear-gradient(135deg,#16a34a,#22c55e)';
            msgBox.textContent = '';

            // Fade-out and remove the card from the UI
            if (_refundCard) {
                _refundCard.style.transition = 'opacity 0.4s ease, transform 0.4s ease, max-height 0.4s ease, padding 0.4s ease, margin 0.4s ease';
                _refundCard.style.opacity = '0';
                _refundCard.style.transform = 'scale(0.95)';
                setTimeout(() => {
                    _refundCard.style.maxHeight = '0';
                    _refundCard.style.padding = '0';
                    _refundCard.style.margin = '0';
                    _refundCard.style.border = 'none';
                    setTimeout(() => { _refundCard.remove(); }, 400);
                }, 350);
            }

            // Close modal after short delay
            setTimeout(() => closeRefundModal(), 900);
        } else {
            msgBox.style.color = 'var(--rust)';
            msgBox.textContent = '❌ ' + (data.message || 'Failed to send refund email.');
            btn.disabled = false; btn.style.opacity = '1'; btn.textContent = '📧 Send';
        }
    } catch (err) {
        console.error(err);
        msgBox.style.color = 'var(--rust)';
        msgBox.textContent = '❌ Network error. Please try again.';
        btn.disabled = false; btn.style.opacity = '1'; btn.textContent = '📧 Send';
    }
}

async function deleteSupplier(id) {
    if (!id) { console.error('Delete failed: No ID provided'); return; }
    const confirmed = await showConfirm('Are you sure you want to permanently delete this supplier?');
    if (!confirmed) return;
    try {
        console.log('Sending DELETE request for supplier:', id);
        const res = await fetch(`/api/suppliers/${id}`, { method: 'DELETE' });
        if (res.ok) {
            console.log('Supplier deleted successfully');
            await fetchSuppliers();
        } else {
            const data = await res.json();
            alert('Error deleting supplier: ' + (data.message || res.statusText));
        }
    } catch (error) {
        console.error('Network Error during supplier deletion:', error);
        alert('Could not connect to the server. Please check your connection.');
    }
}
