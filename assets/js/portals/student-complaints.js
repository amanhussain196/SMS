window.Portals = window.Portals || {};

window.Portals.renderStudentComplaints = function (container) {
    container.innerHTML = `
        <div class="welcome-banner">
            <h1>Student Complaints</h1>
            <p>Log and manage student grievances.</p>
        </div>

        <div style="display: flex; gap: 2rem;">
            <div class="form-card" style="flex: 1;">
                <h3>File a Complaint</h3>
                <form id="complaint-form">
                    <div class="form-group">
                        <label>Student ID</label>
                        <input type="text" name="studentId" class="form-control" required>
                    </div>
                    <div class="form-group">
                        <label>Title</label>
                        <input type="text" name="title" class="form-control" placeholder="Subject of complaint" required>
                    </div>
                    <div class="form-group">
                        <label>Description</label>
                        <textarea name="description" class="form-control" rows="4"></textarea>
                    </div>
                    <button type="submit" class="btn-primary" style="background: var(--warning); color: #000;">Submit Complaint</button>
                </form>
                <div id="comp-msg" style="margin-top: 1rem;"></div>
            </div>

            <div class="glass-card" style="flex: 1; padding: 1.5rem; background: var(--sidebar-bg); border-radius: 1rem;">
                <h3>Recent Complaints</h3>
                <div id="complaints-list" style="margin-top: 1rem;">
                    <!-- List loaded via JS -->
                    <p style="color: var(--text-secondary);">Loading...</p>
                </div>
            </div>
        </div>
    `;

    loadComplaints(container);

    const form = container.querySelector('#complaint-form');
    form.addEventListener('submit', async (e) => {
        e.preventDefault();
        const formData = new FormData(form);
        const data = {
            student_id: formData.get('studentId'),
            title: formData.get('title'),
            description: formData.get('description'),
            status: 'pending'
        };

        try {
            const { error } = await window.supabaseClient.from('complaints').insert([data]);
            if (error) throw error;
            document.getElementById('comp-msg').innerHTML = `<span style="color: var(--success)">Complaint submitted.</span>`;
            form.reset();
            loadComplaints(container);
        } catch (err) {
            document.getElementById('comp-msg').innerHTML = `<span style="color: var(--danger)">Error: ${err.message}</span>`;
        }
    });
}

async function loadComplaints(container) {
    const list = container.querySelector('#complaints-list');
    try {
        const { data, error } = await window.supabaseClient.from('complaints').select('*').order('created_at', { ascending: false }).limit(5);
        if (error) throw error;

        if (!data.length) {
            list.innerHTML = '<p>No complaints found.</p>';
            return;
        }

        list.innerHTML = data.map(c => `
            <div style="background: rgba(255,255,255,0.05); padding: 1rem; margin-bottom: 0.5rem; border-radius: 0.5rem; border-left: 3px solid ${c.status === 'pending' ? 'var(--warning)' : 'var(--success)'}">
                <h4 style="margin: 0;">${c.title}</h4>
                <p style="font-size: 0.8rem; color: var(--text-secondary); margin: 0.25rem 0;">${c.description}</p>
                <small style="padding: 2px 6px; background: rgba(0,0,0,0.3); border-radius: 4px;">${c.status}</small>
            </div>
        `).join('');

    } catch (err) {
        list.innerHTML = '<p>Error loading list.</p>';
    }
}
