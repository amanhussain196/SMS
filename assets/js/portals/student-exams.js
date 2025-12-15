window.Portals = window.Portals || {};

window.Portals.renderStudentExams = function (container) {
    container.innerHTML = `
        <div class="welcome-banner">
            <h1>Exams & Marks Portal</h1>
            <p>Schedule exams and enter student marks.</p>
        </div>

        <div class="tabs" style="display: flex; gap: 1rem; margin-bottom: 1.5rem; border-bottom: 2px solid rgba(255,255,255,0.1);">
            <button class="tab-btn active" data-tab="create-exam" style="background: none; border: none; padding: 0.5rem 1rem; color: var(--text-primary); cursor: pointer; border-bottom: 2px solid var(--accent-color);">Create Exam</button>
            <button class="tab-btn" data-tab="enter-marks" style="background: none; border: none; padding: 0.5rem 1rem; color: var(--text-secondary); cursor: pointer;">Enter Marks</button>
        </div>

        <div id="create-exam-tab">
            <div class="form-card">
                <h3>Schedule New Exam</h3>
                <form id="create-exam-form">
                    <div class="form-group">
                        <label>Exam Name</label>
                        <input type="text" name="name" class="form-control" placeholder="e.g. Final Term 2024" required>
                    </div>
                    <div class="form-group">
                        <label>Date</label>
                        <input type="date" name="date" class="form-control" required>
                    </div>
                    <div class="form-group">
                        <label>Class / Grade</label>
                        <select name="classGrade" class="form-control" required>
                            <option value="">Select Class</option>
                            <option value="10">Grade 10</option>
                            <option value="11">Grade 11</option>
                            <option value="12">Grade 12</option>
                        </select>
                    </div>
                    <button type="submit" class="btn-primary">Schedule Exam</button>
                </form>
                <div id="exam-msg" style="margin-top: 1rem;"></div>
            </div>
        </div>

        <div id="enter-marks-tab" style="display: none;">
             <div class="form-card">
                <h3>Record Marks</h3>
                <form id="marks-form">
                    <div class="form-group">
                        <label>Select Exam</label>
                        <select id="exam-select" name="examId" class="form-control" required>
                            <option value="">Loading exams...</option>
                        </select>
                    </div>
                    <div class="form-group">
                        <label>Student ID</label>
                        <input type="text" name="studentId" class="form-control" required>
                    </div>
                    <div class="form-group">
                        <label>Subject</label>
                        <input type="text" name="subject" class="form-control" placeholder="Maths" required>
                    </div>
                    <div class="form-group">
                        <label>Score</label>
                        <input type="number" name="score" class="form-control" max="100" required>
                    </div>
                    <button type="submit" class="btn-primary">Save Marks</button>
                </form>
                <div id="marks-msg" style="margin-top: 1rem;"></div>
            </div>
        </div>
    `;

    // Tab Switching Logic
    const tabs = container.querySelectorAll('.tab-btn');
    const sections = {
        'create-exam': container.querySelector('#create-exam-tab'),
        'enter-marks': container.querySelector('#enter-marks-tab')
    };

    tabs.forEach(tab => {
        tab.addEventListener('click', () => {
            tabs.forEach(t => {
                t.classList.remove('active');
                t.style.color = 'var(--text-secondary)';
                t.style.borderBottom = 'none';
            });
            tab.classList.add('active');
            tab.style.color = 'var(--text-primary)';
            tab.style.borderBottom = '2px solid var(--accent-color)';

            Object.values(sections).forEach(s => s.style.display = 'none');
            sections[tab.dataset.tab].style.display = 'block';

            if (tab.dataset.tab === 'enter-marks') {
                loadExamsDropdown(container);
            }
        });
    });

    // Create Exam Form
    const examForm = container.querySelector('#create-exam-form');
    examForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        const formData = new FormData(examForm);
        const data = {
            name: formData.get('name'),
            date: formData.get('date'),
            class_grade: formData.get('classGrade')
        };

        try {
            const { error } = await window.supabaseClient.from('exams').insert([data]);
            if (error) throw error;
            document.getElementById('exam-msg').innerHTML = `<span style="color: var(--success)">Exam created!</span>`;
            examForm.reset();
        } catch (err) {
            document.getElementById('exam-msg').innerHTML = `<span style="color: var(--danger)">Error: ${err.message}</span>`;
        }
    });

    // Marks Form
    const marksForm = container.querySelector('#marks-form');
    marksForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        const formData = new FormData(marksForm);
        const data = {
            exam_id: formData.get('examId'),
            student_id: formData.get('studentId'),
            subject: formData.get('subject'),
            score: formData.get('score')
        };

        try {
            const { error } = await window.supabaseClient.from('marks').insert([data]);
            if (error) throw error;
            document.getElementById('marks-msg').innerHTML = `<span style="color: var(--success)">Marks saved!</span>`;
            marksForm.reset();
        } catch (err) {
            document.getElementById('marks-msg').innerHTML = `<span style="color: var(--danger)">Error: ${err.message}</span>`;
        }
    });
}

async function loadExamsDropdown(container) {
    const select = container.querySelector('#exam-select');
    try {
        const { data, error } = await window.supabaseClient.from('exams').select('id, name');
        if (error) throw error;

        select.innerHTML = '<option value="">Select Exam</option>';
        data.forEach(ex => {
            select.innerHTML += `<option value="${ex.id}">${ex.name}</option>`;
        });
    } catch (err) {
        select.innerHTML = '<option value="">Error loading exams</option>';
    }
}
