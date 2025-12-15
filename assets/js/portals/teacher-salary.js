window.Portals = window.Portals || {};

window.Portals.renderTeacherSalary = function (container) {
    container.innerHTML = `
        <div class="welcome-banner">
            <h1>Teacher Salary Portal</h1>
            <p>Manage payroll for teaching staff.</p>
        </div>

        <div style="display: flex; gap: 2rem;">
            <div class="form-card" style="flex: 1;">
                <h3>Process Salary Payment</h3>
                <form id="salary-form">
                    <div class="form-group">
                        <label>Teacher Profile ID</label>
                        <input type="text" name="teacherId" class="form-control" required>
                    </div>
                    <div class="form-group">
                        <label>Month</label>
                        <input type="month" name="month" class="form-control" required>
                    </div>
                    <div class="form-group">
                        <label>Amount</label>
                        <input type="number" name="amount" class="form-control" step="0.01" required>
                    </div>
                    <button type="submit" class="btn-primary">Record Payment</button>
                </form>
                <div id="sal-msg" style="margin-top: 1rem;"></div>
            </div>
            
            <div class="glass-card" style="flex: 1; padding: 1.5rem; background: var(--sidebar-bg); border-radius: 1rem;">
                <h3>Payroll History</h3>
                <div id="salary-list" style="margin-top: 1rem;">
                     <p style="color: var(--text-secondary);">Loading records...</p>
                </div>
            </div>
        </div>
    `;

    loadSalaries(container);

    const form = container.querySelector('#salary-form');
    form.addEventListener('submit', async (e) => {
        e.preventDefault();
        const formData = new FormData(form);
        const data = {
            teacher_id: formData.get('teacherId'),
            month: formData.get('month'), // e.g., "2024-10"
            amount: formData.get('amount'),
            status: 'paid',
            paid_at: new Date().toISOString()
        };

        try {
            const { error } = await window.supabaseClient.from('teacher_salaries').insert([data]);
            if (error) throw error;
            document.getElementById('sal-msg').innerHTML = `<span style="color: var(--success)">Salary recorded.</span>`;
            form.reset();
            loadSalaries(container);
        } catch (err) {
            document.getElementById('sal-msg').innerHTML = `<span style="color: var(--danger)">Error: ${err.message}</span>`;
        }
    });
}

async function loadSalaries(container) {
    const list = container.querySelector('#salary-list');
    try {
        const { data, error } = await window.supabaseClient.from('teacher_salaries').select('*').order('paid_at', { ascending: false }).limit(5);
        if (error) throw error;

        if (!data.length) {
            list.innerHTML = '<p>No records found.</p>';
            return;
        }

        list.innerHTML = data.map(s => `
            <div style="background: rgba(255,255,255,0.05); padding: 1rem; margin-bottom: 0.5rem; border-radius: 0.5rem; display: flex; justify-content: space-between;">
                <div>
                    <h4 style="margin: 0;">${s.month}</h4>
                     <small style="color: var(--text-secondary);">ID: ${s.teacher_id ? s.teacher_id.substring(0, 8) + '...' : 'Unknown'}</small>
                </div>
                <div style="font-weight: bold; color: var(--success);">$${s.amount}</div>
            </div>
        `).join('');
    } catch (err) {
        list.innerHTML = '<p>Error loading list.</p>';
    }
}
