window.Portals = window.Portals || {};

window.Portals.renderTeacherAttendance = function (container) {
    container.innerHTML = `
        <div class="welcome-banner">
            <h1>Teacher Attendance</h1>
            <p>Track teacher presence.</p>
        </div>

        <div class="form-card">
            <h3>Mark Teacher Attendance</h3>
            <form id="t-attendance-form">
                <div class="form-group">
                    <label>Date</label>
                    <input type="date" name="date" class="form-control" value="${new Date().toISOString().split('T')[0]}" required>
                </div>
                 <div class="form-group">
                    <label>Teacher Profile ID</label>
                    <input type="text" name="teacherId" class="form-control" placeholder="Profile UUID" required>
                </div>
                <div class="form-group">
                    <label>Status</label>
                    <div style="display: flex; gap: 1rem; margin-top: 0.5rem;">
                        <label style="display: flex; align-items: center; gap: 0.5rem; color: white;">
                            <input type="radio" name="status" value="present" checked> Present
                        </label>
                        <label style="display: flex; align-items: center; gap: 0.5rem; color: white;">
                            <input type="radio" name="status" value="absent"> Absent
                        </label>
                    </div>
                </div>
                <button type="submit" class="btn-primary">Mark Attendance</button>
            </form>
            <div id="t-att-msg" style="margin-top: 1rem;"></div>
        </div>
    `;

    const form = container.querySelector('#t-attendance-form');
    form.addEventListener('submit', async (e) => {
        e.preventDefault();
        const formData = new FormData(form);
        const data = {
            user_id: formData.get('teacherId'), // Maps to profiles table
            date: formData.get('date'),
            status: formData.get('status'),
            type: 'teacher'
        };

        try {
            const { error } = await window.supabaseClient.from('attendance').insert([data]);
            if (error) throw error;
            document.getElementById('t-att-msg').innerHTML = `<span style="color: var(--success)">Attendance marked.</span>`;
            form.reset();
        } catch (err) {
            document.getElementById('t-att-msg').innerHTML = `<span style="color: var(--danger)">Error: ${err.message}</span>`;
        }
    });
}
