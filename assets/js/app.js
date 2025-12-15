
// Route Map (Now using global Portals object)
const routes = {
    'dashboard': window.Portals.renderDashboard,
    'student-registration': window.Portals.renderStudentRegistration,
    'student-records': window.Portals.renderStudentRecords,
    'student-fees': window.Portals.renderStudentFees,
    'student-exams': window.Portals.renderStudentExams,
    'student-attendance': window.Portals.renderStudentAttendance,
    'student-complaints': window.Portals.renderStudentComplaints,
    'teacher-attendance': window.Portals.renderTeacherAttendance,
    'teacher-salary': window.Portals.renderTeacherSalary
};

document.addEventListener('DOMContentLoaded', async () => {
    console.log('App Initializing...');

    // 1. Initialize Navigation (Do this first so UI works)
    const navLinks = document.querySelectorAll('.nav-links li[data-portal]');
    const contentArea = document.getElementById('content-area');

    navLinks.forEach(link => {
        link.addEventListener('click', () => {
            // UI Toggle
            navLinks.forEach(l => l.classList.remove('active'));
            link.classList.add('active');

            // Render Content
            const portalName = link.getAttribute('data-portal');
            loadPortal(portalName);
        });
    });

    // 2. Load Default
    loadPortal('dashboard');

    // 3. Check DB Connection (Async, non-blocking)
    try {
        if (window.checkConnection) {
            const connected = await window.checkConnection();
            if (!connected) {
                console.warn('Supabase not connected. Please check credentials.');
            }
        } else {
            console.error('checkConnection function not found. Supabase client script might have failed.');
        }
    } catch (err) {
        console.error('DB Connection Check Failed:', err);
    }

    function loadPortal(name) {
        // Clear Content with Animation
        contentArea.style.opacity = '0';

        setTimeout(() => {
            if (routes[name]) {
                routes[name](contentArea);
                // Re-trigger animation
                contentArea.classList.remove('portal-view');
                void contentArea.offsetWidth; // Trigger reflow
                contentArea.classList.add('portal-view');
            } else {
                contentArea.innerHTML = '<h2>404 - Portal Not Found or Not Loaded</h2>';
                console.error('Route not found:', name, routes);
            }
            contentArea.style.opacity = '1';
        }, 200);
    }
});
