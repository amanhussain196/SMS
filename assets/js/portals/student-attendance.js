window.Portals = window.Portals || {};

window.Portals.renderStudentAttendance = function (container) {
    container.innerHTML = `
        <div class="welcome-banner">
            <h1>Student Attendance</h1>
            <p>Mark daily attendance per class.</p>
        </div>

        <div class="glass-card" style="padding: 1.5rem; margin-bottom: 2rem; border-radius: 1rem;">
            <form id="attendance-filter-form" style="display: grid; grid-template-columns: repeat(auto-fit, minmax(200px, 1fr)); gap: 1rem; align-items: end;">
                <div class="form-group" style="margin-bottom: 0;">
                    <label>Date</label>
                    <input type="date" name="date" class="form-control" value="${new Date().toISOString().split('T')[0]}" required>
                </div>
                <div class="form-group" style="margin-bottom: 0;">
                    <label>Class / Grade</label>
                    <select name="classGrade" class="form-control" required>
                        <option value="">Select Grade</option>
                        <option value="1">Grade 1</option>
                        <option value="2">Grade 2</option>
                        <option value="3">Grade 3</option>
                        <option value="4">Grade 4</option>
                        <option value="5">Grade 5</option>
                        <option value="6">Grade 6</option>
                        <option value="7">Grade 7</option>
                        <option value="8">Grade 8</option>
                        <option value="9">Grade 9</option>
                        <option value="10">Grade 10</option>
                        <option value="11">Grade 11</option>
                        <option value="12">Grade 12</option>
                    </select>
                </div>
                <div style="display: flex;">
                    <button type="submit" class="btn-primary" style="flex: 1;"><i class="fa-solid fa-list-check"></i> Load Class</button>
                </div>
            </form>
        </div>

        <div id="attendance-list-area" style="display: none;">
            <!-- Student List Table -->
        </div>

        <div id="attendance-action-area" style="display: none; margin-top: 2rem; text-align: center;">
            <button id="save-attendance-btn" class="btn-primary" style="padding: 1rem 3rem; font-size: 1.1rem;">
                <i class="fa-solid fa-save"></i> Save Attendance
            </button>
        </div>

        <div id="attendance-summary-area" style="display: none; margin-top: 2rem;">
            <!-- Summary Stats -->
        </div>
    `;

    const filterForm = container.querySelector('#attendance-filter-form');
    const listArea = container.querySelector('#attendance-list-area');
    const actionArea = container.querySelector('#attendance-action-area');
    const saveBtn = container.querySelector('#save-attendance-btn');
    const summaryArea = container.querySelector('#attendance-summary-area');

    let currentStudents = [];
    let currentDate = '';

    // Load initial status
    updateGradeOptions(filterForm.querySelector('input[name="date"]').value);

    // Listen to Date Change
    filterForm.querySelector('input[name="date"]').addEventListener('change', (e) => {
        updateGradeOptions(e.target.value);
    });

    async function updateGradeOptions(date) {
        if (!date) return;

        try {
            const { data, error } = await window.supabaseClient.rpc('get_grades_with_attendance', { check_date: date });
            const markedGrades = (data || []).map(r => r.class_grade);

            const select = filterForm.querySelector('select[name="classGrade"]');
            Array.from(select.options).forEach(opt => {
                if (!opt.value) return; // Skip "Select Grade"

                // Remove existing indicators
                let label = opt.text.replace(' 🔴', '').replace(' ✅', '');

                if (markedGrades.includes(opt.value)) {
                    // Marked -> Add Green Check (Optional, but good for clarity)
                    opt.text = label + ' ✅';
                } else {
                    // Not Marked -> Add Red Circle
                    opt.text = label + ' 🔴';
                }
            });
        } catch (e) {
            console.error(e);
        }
    }

    filterForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        const formData = new FormData(filterForm);
        const grade = formData.get('classGrade');
        const date = formData.get('date');
        currentDate = date;

        await loadClassData(grade, date);
    });

    saveBtn.addEventListener('click', async () => {
        await saveAttendance();
    });

    async function loadClassData(grade, date) {
        listArea.style.display = 'block';
        listArea.innerHTML = '<p style="text-align: center; color: var(--text-secondary);">Loading class data...</p>';
        actionArea.style.display = 'none';
        summaryArea.style.display = 'none';

        try {
            // 1. Fetch Students Ordered by Roll Number
            const { data: students, error: studentError } = await window.supabaseClient
                .from('students')
                .select('id, full_name, roll_number, class_grade')
                .eq('class_grade', grade)
                .order('roll_number', { ascending: true });

            if (studentError) throw studentError;

            if (!students || students.length === 0) {
                listArea.innerHTML = `<p style="text-align: center; color: var(--text-secondary);">No students found in Grade ${grade}.</p>`;
                return;
            }

            currentStudents = students;

            // 2. Fetch Existing Attendance for this Date
            const { data: attendanceData, error: attError } = await window.supabaseClient
                .from('attendance')
                .select('student_id, status')
                .eq('date', date)
                .in('student_id', students.map(s => s.id));

            if (attError) console.error("Error fetching existing attendance:", attError);

            const attendanceMap = {};
            if (attendanceData) {
                attendanceData.forEach(r => attendanceMap[r.student_id] = r.status);
            }

            // 3. Render Table
            renderTable(students, attendanceMap);
            actionArea.style.display = 'block';

        } catch (err) {
            listArea.innerHTML = `<p style="color: var(--danger); text-align: center;">Error: ${err.message}</p>`;
        }
    }

    function renderTable(students, attendanceMap) {
        let html = `
            <div style="overflow-x: auto; background: var(--sidebar-bg); border-radius: 0.5rem; border: var(--glass-border);">
                <table style="width: 100%; border-collapse: collapse; min-width: 600px;">
                    <thead style="background: rgba(0,0,0,0.2); color: var(--text-secondary); font-size: 0.85rem; text-align: left;">
                        <tr>
                            <th style="padding: 1rem; width: 80px;">Roll No</th>
                            <th style="padding: 1rem;">Student Name</th>
                            <th style="padding: 1rem; width: 250px;">Status</th>
                        </tr>
                    </thead>
                    <tbody style="font-size: 0.95rem;">
        `;

        students.forEach((student, index) => {
            const existingStatus = attendanceMap[student.id] || 'present'; // Default to Present
            const isPresent = existingStatus === 'present';
            const isAbsent = existingStatus === 'absent';

            html += `
                <tr style="border-bottom: 1px solid rgba(255,255,255,0.05); background: ${isAbsent ? 'rgba(239, 68, 68, 0.05)' : 'transparent'}">
                    <td style="padding: 1rem; font-weight: bold; color: var(--accent-color); text-align: center;">${student.roll_number || (index + 1)}</td>
                    <td style="padding: 1rem;">${student.full_name}</td>
                    <td style="padding: 1rem;">
                        <div style="display: flex; gap: 1.5rem;">
                            <label style="cursor: pointer; display: flex; align-items: center; gap: 0.5rem;">
                                <input type="radio" name="status_${student.id}" value="present" ${isPresent ? 'checked' : ''} style="accent-color: var(--success); transform: scale(1.2);">
                                <span style="color: ${isPresent ? 'var(--success)' : 'inherit'}">Present</span>
                            </label>
                            <label style="cursor: pointer; display: flex; align-items: center; gap: 0.5rem;">
                                <input type="radio" name="status_${student.id}" value="absent" ${isAbsent ? 'checked' : ''} style="accent-color: var(--danger); transform: scale(1.2);">
                                <span style="color: ${isAbsent ? 'var(--danger)' : 'inherit'}">Absent</span>
                            </label>
                        </div>
                    </td>
                </tr>
            `;
        });

        html += `</tbody></table></div>`;
        listArea.innerHTML = html;

        // Add visual toggle effect
        const radios = listArea.querySelectorAll('input[type="radio"]');
        radios.forEach(radio => {
            radio.addEventListener('change', (e) => {
                const row = e.target.closest('tr');
                if (e.target.value === 'absent') {
                    row.style.background = 'rgba(239, 68, 68, 0.05)';
                    row.querySelector('span:nth-child(2)').style.color = 'var(--danger)';
                    // Reset present color
                    const presentSpan = row.querySelectorAll('span')[0];
                    if (presentSpan) presentSpan.style.color = 'inherit';

                } else {
                    row.style.background = 'transparent';
                    row.querySelector('span').style.color = 'var(--success)';
                    // Reset absent color
                    const absentSpan = row.querySelectorAll('span')[1];
                    if (absentSpan) absentSpan.style.color = 'inherit';
                }
            });
        });
    }

    async function saveAttendance() {
        const btn = document.getElementById('save-attendance-btn');
        const originalText = btn.innerHTML;
        btn.innerHTML = '<i class="fa-solid fa-spinner fa-spin"></i> Saving...';
        btn.disabled = true;

        const records = [];
        let presentCount = 0;
        let absentCount = 0;
        const absentees = [];

        currentStudents.forEach(student => {
            const statusRadio = listArea.querySelector(`input[name="status_${student.id}"]:checked`);
            const status = statusRadio ? statusRadio.value : 'present'; // Fallback

            records.push({
                student_id: student.id,
                date: currentDate,
                status: status,
                type: 'student'
            });

            if (status === 'present') presentCount++;
            else {
                absentCount++;
                absentees.push(student.full_name);
            }
        });

        try {
            // Upsert records (requires unique index on student_id + date)
            const { error } = await window.supabaseClient
                .from('attendance')
                .upsert(records, { onConflict: 'student_id, date' });

            if (error) throw error;

            renderSummary(presentCount, absentCount, absentees);

        } catch (err) {
            alert("Failed to save attendance: " + err.message);
        } finally {
            btn.innerHTML = originalText;
            btn.disabled = false;
        }
    }

    function renderSummary(present, absent, absentees) {
        summaryArea.style.display = 'block';

        let absenteeListHtml = '';
        if (absentees.length > 0) {
            absenteeListHtml = `
                <div style="margin-top: 1rem; text-align: left; background: rgba(0,0,0,0.2); padding: 1rem; border-radius: 0.5rem;">
                    <h5 style="color: var(--danger); margin-bottom: 0.5rem;">Absentees List:</h5>
                    <ul style="margin: 0; padding-left: 1.2rem; color: var(--text-secondary);">
                        ${absentees.map(name => `<li>${name}</li>`).join('')}
                    </ul>
                </div>
            `;
        } else {
            absenteeListHtml = `<p style="color: var(--success); margin-top: 1rem;">No Absentees! 🎉</p>`;
        }

        summaryArea.innerHTML = `
            <div style="background: var(--sidebar-bg); border: 1px solid var(--success); padding: 2rem; border-radius: 1rem; text-align: center;">
                <h2 style="color: var(--success); margin-bottom: 1.5rem;"><i class="fa-solid fa-check-circle"></i> Attendance Saved</h2>
                
                <div style="display: grid; grid-template-columns: 1fr 1fr 1fr; gap: 1rem; margin-bottom: 1.5rem;">
                    <div style="background: rgba(255,255,255,0.05); padding: 1rem; border-radius: 0.5rem;">
                        <div style="font-size: 0.9rem; color: var(--text-secondary);">Total Students</div>
                        <div style="font-size: 1.5rem; font-weight: bold; color: white;">${present + absent}</div>
                    </div>
                    <div style="background: rgba(16, 185, 129, 0.1); padding: 1rem; border-radius: 0.5rem;">
                        <div style="font-size: 0.9rem; color: var(--success);">Present</div>
                        <div style="font-size: 1.5rem; font-weight: bold; color: var(--success);">${present}</div>
                    </div>
                    <div style="background: rgba(239, 68, 68, 0.1); padding: 1rem; border-radius: 0.5rem;">
                        <div style="font-size: 0.9rem; color: var(--danger);">Absent</div>
                        <div style="font-size: 1.5rem; font-weight: bold; color: var(--danger);">${absent}</div>
                    </div>
                </div>

                ${absenteeListHtml}
            </div>
        `;

        // Scroll to summary
        summaryArea.scrollIntoView({ behavior: 'smooth' });
    }
}
