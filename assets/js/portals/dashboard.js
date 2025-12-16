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
                    <p class="stat-number" id="dash-total-students">Loading...</p>
                </div>
            </div>
            <div class="stat-card">
                <div class="stat-icon orange"><i class="fa-solid fa-chalkboard-user"></i></div>
                <div class="stat-info">
                    <h3>Teachers</h3>
                    <p class="stat-number" id="dash-total-teachers">Loading...</p>
                </div>
            </div>
            <div class="stat-card">
                <div class="stat-icon green"><i class="fa-solid fa-sack-dollar"></i></div>
                <div class="stat-info">
                    <h3>Revenue (Total)</h3>
                    <p class="stat-number" id="dash-total-revenue">Loading...</p>
                </div>
            </div>
        </div>
        
        <div style="margin-top: 2rem; display: grid; grid-template-columns: 1fr 1fr; gap: 1.5rem;">
            <div class="glass-card" style="padding: 1.5rem; background: var(--sidebar-bg); border-radius: 1rem;">
                <h3>Recent Activities</h3>
                <ul id="dash-recent-activities" style="list-style: none; margin-top: 1rem; color: var(--text-secondary);">
                    <li>Loading activities...</li>
                </ul>
            </div>
             <div class="glass-card" style="padding: 1.5rem; background: var(--sidebar-bg); border-radius: 1rem;">
                <h3>Quick Actions</h3>
                 <div style="display: flex; gap: 0.5rem; margin-top: 1rem; flex-wrap: wrap;">
                    <button class="btn-primary" onclick="document.querySelector('[data-portal=student-registration]').click()" style="flex: 1 1 120px; font-size: 0.8rem; text-align: center; padding: 0.75rem 0.5rem;">
                        <i class="fa-solid fa-user-plus" style="margin-bottom: 0.3rem; display: block; font-size: 1.2rem;"></i> Register Student
                    </button>
                    <button class="btn-primary" onclick="document.querySelector('[data-portal=student-records]').click()" style="flex: 1 1 120px; font-size: 0.8rem; text-align: center; padding: 0.75rem 0.5rem; background: var(--sidebar-bg); border: 1px solid var(--accent-color);">
                        <i class="fa-solid fa-address-book" style="margin-bottom: 0.3rem; display: block; font-size: 1.2rem; color: var(--accent-color);"></i> Find Student
                    </button>
                    <button class="btn-primary" onclick="document.querySelector('[data-portal=student-attendance]').click()" style="flex: 1 1 120px; font-size: 0.8rem; text-align: center; padding: 0.75rem 0.5rem; background: var(--sidebar-bg); border: 1px solid var(--success);">
                        <i class="fa-solid fa-clipboard-user" style="margin-bottom: 0.3rem; display: block; font-size: 1.2rem; color: var(--success);"></i> Attendance
                    </button>
                    <button class="btn-primary" onclick="document.querySelector('[data-portal=student-fees]').click()" style="flex: 1 1 120px; font-size: 0.8rem; text-align: center; padding: 0.75rem 0.5rem; background: var(--sidebar-bg); border: 1px solid var(--warning);">
                        <i class="fa-solid fa-credit-card" style="margin-bottom: 0.3rem; display: block; font-size: 1.2rem; color: var(--warning);"></i> Fee Portal
                    </button>
                     <button class="btn-primary" onclick="document.querySelector('[data-portal=student-exams]').click()" style="flex: 1 1 120px; font-size: 0.8rem; text-align: center; padding: 0.75rem 0.5rem; background: var(--sidebar-bg); border: 1px solid #a855f7;">
                        <i class="fa-solid fa-file-signature" style="margin-bottom: 0.3rem; display: block; font-size: 1.2rem; color: #a855f7;"></i> Exams Portal
                    </button>
                 </div>
            </div>
        </div>
    `;

    loadDashboardStats();
}

async function loadDashboardStats() {
    try {
        // 1. Total Students
        const { count: studentCount, error: err1 } = await window.supabaseClient
            .from('students')
            .select('*', { count: 'exact', head: true });

        if (!err1) {
            document.getElementById('dash-total-students').innerText = studentCount || 0;
        }

        // 2. Total Teachers
        const { count: teacherCount, error: err2 } = await window.supabaseClient
            .from('profiles')
            .select('*', { count: 'exact', head: true })
            .eq('role', 'teacher');

        if (!err2) {
            document.getElementById('dash-total-teachers').innerText = teacherCount || 0;
        }

        // 3. Revenue (Sum of paid fees)
        const { data: feesData, error: err3 } = await window.supabaseClient
            .from('fees')
            .select('amount')
            .eq('status', 'paid');

        if (!err3 && feesData) {
            const totalRevenue = feesData.reduce((sum, item) => sum + parseFloat(item.amount || 0), 0);
            document.getElementById('dash-total-revenue').innerText = '$' + totalRevenue.toLocaleString();
        }

        // 4. Recent Activities (Combine recent students and complaints for a feed)
        const activitiesList = document.getElementById('dash-recent-activities');

        // Fetch last 3 students
        const { data: recentStudents } = await window.supabaseClient
            .from('students')
            .select('full_name, registration_date')
            .order('registration_date', { ascending: false })
            .limit(3);

        // Fetch last 2 complaints
        const { data: recentComplaints } = await window.supabaseClient
            .from('complaints')
            .select('title, created_at')
            .order('created_at', { ascending: false })
            .limit(2);

        let feed = [];
        if (recentStudents) {
            recentStudents.forEach(s => feed.push({
                type: 'student',
                text: `New student registered: ${s.full_name}`,
                date: new Date(s.registration_date),
                icon: 'fa-user-plus',
                color: 'var(--success)'
            }));
        }
        if (recentComplaints) {
            recentComplaints.forEach(c => feed.push({
                type: 'complaint',
                text: `Complaint: ${c.title}`,
                date: new Date(c.created_at),
                icon: 'fa-circle-exclamation',
                color: 'var(--warning)'
            }));
        }

        // Sort by date desc
        feed.sort((a, b) => b.date - a.date);

        if (feed.length === 0) {
            activitiesList.innerHTML = '<li>No recent activity.</li>';
        } else {
            activitiesList.innerHTML = feed.map(item => `
                <li style="margin-bottom: 0.8rem; display: flex; align-items: center; font-size: 0.9rem;">
                    <i class="fa-solid ${item.icon}" style="color: ${item.color}; margin-right: 0.8rem;"></i> 
                    <span>${item.text} <span style="font-size:0.75em; opacity: 0.6; margin-left:5px;">(${item.date.toLocaleDateString()})</span></span>
                </li>
            `).join('');
        }

    } catch (err) {
        console.error("Dashboard error:", err);
    }
}
