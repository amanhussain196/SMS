window.Portals = window.Portals || {};

window.Portals.renderDashboard = function (container) {
    container.innerHTML = `
        <div class="welcome-banner">
            <h1>Dashboard</h1>
            <p>Overview of school activities.</p>
        </div>
        <div class="stats-grid">
            <div class="stat-card">
                <div class="stat-icon purple"><i class="fa-solid fa-users"></i></div>
                <div class="stat-info">
                    <h3>Total Students</h3>
                    <p class="stat-number">1,240</p>
                </div>
            </div>
            <div class="stat-card">
                <div class="stat-icon orange"><i class="fa-solid fa-chalkboard-user"></i></div>
                <div class="stat-info">
                    <h3>Teachers</h3>
                    <p class="stat-number">85</p>
                </div>
            </div>
            <div class="stat-card">
                <div class="stat-icon green"><i class="fa-solid fa-sack-dollar"></i></div>
                <div class="stat-info">
                    <h3>Revenue (Oct)</h3>
                    <p class="stat-number">$45k</p>
                </div>
            </div>
        </div>
        
        <div style="margin-top: 2rem; display: grid; grid-template-columns: 1fr 1fr; gap: 1.5rem;">
            <div class="glass-card" style="padding: 1.5rem; background: var(--sidebar-bg); border-radius: 1rem;">
                <h3>Recent Activities</h3>
                <ul style="list-style: none; margin-top: 1rem; color: var(--text-secondary);">
                    <li style="margin-bottom: 0.5rem;"><i class="fa-solid fa-circle-check" style="color: var(--success); margin-right: 0.5rem;"></i> New student registered: John Doe</li>
                    <li style="margin-bottom: 0.5rem;"><i class="fa-solid fa-circle-exclamation" style="color: var(--warning); margin-right: 0.5rem;"></i> Complaint pending review</li>
                    <li><i class="fa-solid fa-file-invoice-dollar" style="color: var(--accent-color); margin-right: 0.5rem;"></i> Fees updated for Class 10</li>
                </ul>
            </div>
             <div class="glass-card" style="padding: 1.5rem; background: var(--sidebar-bg); border-radius: 1rem;">
                <h3>Quick Actions</h3>
                 <div style="display: flex; gap: 1rem; margin-top: 1rem; flex-wrap: wrap;">
                    <button class="btn-primary" style="font-size: 0.8rem;">Add Student</button>
                    <button class="btn-primary" style="background: var(--sidebar-bg); border: 1px solid var(--accent-color); font-size: 0.8rem;">View Reports</button>
                 </div>
            </div>
        </div>
    `;
}
