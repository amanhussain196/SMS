window.Portals = window.Portals || {};

window.Portals.renderStudentAttendance = function (container) {
    container.innerHTML = `
        <div class="welcome-banner">
            <h1>Student Attendance</h1>
            <p>Mark and view daily attendance.</p>
        </div>

        <div class="form-card">
            <h3>Mark Attendance</h3>
            <form id="attendance-form">
                <div class="form-group">
                    <label>Date</label>
                    <input type="date" name="date" class="form-control" value="${new Date().toISOString().split('T')[0]}" required>
                </div>
                 <div class="form-group">
                    <label>Student ID</label>
                    <input type="text" name="studentId" class="form-control" placeholder="UUID" required>
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
                        <label style="display: flex; align-items: center; gap: 0.5rem; color: white;">
                            <input type="radio" name="status" value="late"> Late
                        </label>
                    </div>
                </div>
                <button type="submit" class="btn-primary">Mark Attendance</button>
            </form>
            <div id="att-msg" style="margin-top: 1rem;"></div>
        </div>
    `;

    const form = container.querySelector('#attendance-form');
    form.addEventListener('submit', async (e) => {
        e.preventDefault();
        const formData = new FormData(form);
        const data = {
            student_id: formData.get('studentId'),
            date: formData.get('date'),
            status: formData.get('status'),
            type: 'student'
        };

        try {
            const { error } = await window.supabaseClient.from('attendance').insert([data]);
            if (error) throw error;
            document.getElementById('att-msg').innerHTML = `<span style="color: var(--success)">Attendance marked.</span>`;
            form.reset();
        } catch (err) {
            document.getElementById('att-msg').innerHTML = `<span style="color: var(--danger)">Error: ${err.message}</span>`;
        }
    });
}
