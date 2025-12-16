window.Portals = window.Portals || {};

window.Portals.renderStudentExams = function (container) {
    container.innerHTML = `
        <div class="welcome-banner">
            <h1>Exams & Marks Portal</h1>
            <p>Schedule exams and enter student marks.</p>
        </div>

        <div class="tabs" style="display: flex; gap: 1rem; margin-bottom: 1.5rem; border-bottom: 2px solid rgba(255,255,255,0.1);">
            <button class="tab-btn active" data-tab="create-exam" style="background: none; border: none; padding: 0.5rem 1rem; color: var(--text-primary); cursor: pointer; border-bottom: 2px solid var(--accent-color);">Create Exam</button>
            <button class="tab-btn" data-tab="view-schedule" style="background: none; border: none; padding: 0.5rem 1rem; color: var(--text-secondary); cursor: pointer;">View Schedule</button>
            <button class="tab-btn" data-tab="enter-marks" style="background: none; border: none; padding: 0.5rem 1rem; color: var(--text-secondary); cursor: pointer;">Enter Marks</button>
            <button class="tab-btn" data-tab="view-results" style="background: none; border: none; padding: 0.5rem 1rem; color: var(--text-secondary); cursor: pointer;">View Results</button>
        </div>

        <!-- CREATE EXAM TAB -->
        <div id="create-exam-tab">
            <div class="glass-card" style="padding: 2rem; border-radius: 1rem;">
                <h3>Schedule New Exam</h3>
                <form id="create-exam-form">
                    <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 1.5rem; margin-bottom: 1.5rem;">
                         <div class="form-group">
                            <label>Exam Name</label>
                            <input type="text" name="name" class="form-control" placeholder="e.g. Final Term 2024" required>
                        </div>
                        <div class="form-group">
                            <label>Start Date</label>
                            <input type="date" name="date" class="form-control" value="${new Date().toISOString().split('T')[0]}" required>
                        </div>
                    </div>

                    <div class="form-group">
                        <label>Select Grades (Multiple)</label>
                        <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(80px, 1fr)); gap: 0.5rem; background: rgba(0,0,0,0.2); padding: 1rem; border-radius: 0.5rem;">
                            ${[1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12].map(g => `
                                <label style="display: flex; align-items: center; gap: 0.5rem; cursor: pointer; padding: 0.5rem; background: rgba(255,255,255,0.05); border-radius: 0.25rem;">
                                    <input type="checkbox" name="grades" value="${g}" style="accent-color: var(--accent-color);"> Grade ${g}
                                </label>
                            `).join('')}
                        </div>
                    </div>

                    <div class="form-group">
                        <label>Number of Subjects</label>
                        <input type="number" id="num-subjects" name="numSubjects" class="form-control" min="1" max="15" placeholder="Enter number..." required>
                    </div>

                    <div id="subjects-container" style="margin-top: 2rem;"></div>

                    <button type="submit" class="btn-primary" style="margin-top: 1.5rem; width: 100%;">Schedule Exam</button>
                    <div id="exam-msg" style="margin-top: 1rem;"></div>
                </form>
            </div>
        </div>

        <!-- VIEW SCHEDULE TAB -->
        <div id="view-schedule-tab" style="display: none;">
            <div class="glass-card" style="padding: 1.5rem; border-radius: 1rem; margin-bottom: 2rem;">
                <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 1rem;">
                    <h3>Scheduled Exams</h3>
                    <button id="refresh-schedule" class="btn-primary" style="font-size: 0.9rem; padding: 0.5rem 1rem;"><i class="fa-solid fa-sync"></i> Refresh</button>
                </div>
                <div id="schedule-list-area">
                    <p style="text-align: center; color: var(--text-secondary);">Loading schedule...</p>
                </div>
            </div>
        </div>

        <!-- ENTER MARKS TAB -->
        <div id="enter-marks-tab" style="display: none;">
            <div class="glass-card" style="padding: 1.5rem; border-radius: 1rem; margin-bottom: 2rem;">
                <form id="marks-filter-form" style="display: grid; grid-template-columns: repeat(auto-fit, minmax(200px, 1fr)); gap: 1rem; align-items: end;">
                    <div class="form-group" style="margin-bottom: 0;">
                        <label>Select Grade</label>
                        <select name="classGrade" id="marks-grade-select" class="form-control" required>
                            <option value="">Select Grade</option>
                            ${[1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12].map(g => `<option value="${g}">Grade ${g}</option>`).join('')}
                        </select>
                    </div>
                    <div class="form-group" style="margin-bottom: 0;">
                        <label>Select Exam</label>
                        <select name="examId" id="marks-exam-select" class="form-control" disabled required>
                            <option value="">Select Grade First</option>
                        </select>
                    </div>
                    <div style="display: flex;">
                        <button type="submit" class="btn-primary" style="flex: 1;"><i class="fa-solid fa-search"></i> Load Data</button>
                    </div>
                </form>
            </div>

            <div id="marks-list-area" style="display: none;"></div>
        </div>

        <!-- VIEW RESULTS TAB -->
        <div id="view-results-tab" style="display: none;">
             <div class="glass-card" style="padding: 1.5rem; border-radius: 1rem; margin-bottom: 2rem;">
                <form id="results-filter-form" style="display: grid; grid-template-columns: repeat(auto-fit, minmax(200px, 1fr)); gap: 1rem; align-items: end;">
                    <div class="form-group" style="margin-bottom: 0;">
                        <label>Select Grade</label>
                        <select name="classGrade" id="results-grade-select" class="form-control" required>
                            <option value="">Select Grade</option>
                            ${[1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12].map(g => `<option value="${g}">Grade ${g}</option>`).join('')}
                        </select>
                    </div>
                    <div class="form-group" style="margin-bottom: 0;">
                        <label>Select Exam</label>
                        <select name="examId" id="results-exam-select" class="form-control" disabled required>
                            <option value="">Select Grade First</option>
                        </select>
                    </div>
                    <div style="display: flex;">
                        <button type="submit" class="btn-primary" style="flex: 1;"><i class="fa-solid fa-trophy"></i> Generate Result</button>
                    </div>
                </form>
            </div>

            <div id="results-list-area" style="display: none;"></div>
        </div>
    `;

    // Tab Interface
    const tabs = container.querySelectorAll('.tab-btn');
    const sections = {
        'create-exam': container.querySelector('#create-exam-tab'),
        'view-schedule': container.querySelector('#view-schedule-tab'),
        'enter-marks': container.querySelector('#enter-marks-tab'),
        'view-results': container.querySelector('#view-results-tab')
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

            if (tab.dataset.tab === 'view-schedule') {
                loadSchedule(container);
            }
        });
    });

    // --- CREATE EXAM LOGIC ---
    const numSubjInput = container.querySelector('#num-subjects');
    const subjContainer = container.querySelector('#subjects-container');

    numSubjInput.addEventListener('input', (e) => {
        const count = parseInt(e.target.value) || 0;
        if (count > 20) return;
        subjContainer.innerHTML = '';
        if (count > 0) {
            subjContainer.innerHTML = `<h4 style="color: var(--accent-color); margin-bottom: 1rem; border-bottom: 1px solid rgba(255,255,255,0.1); padding-bottom: 0.5rem;">Subject Details</h4>`;
            for (let i = 0; i < count; i++) {
                subjContainer.innerHTML += `
                    <div style="display: grid; grid-template-columns: 2fr 1fr; gap: 1rem; margin-bottom: 1rem; animation: slideIn 0.3s ease-out;">
                        <input type="text" name="subject_name_${i}" class="form-control" placeholder="Subject Name ${i + 1}" required>
                        <input type="number" name="max_marks_${i}" class="form-control" placeholder="Max Marks" value="100" required>
                    </div>
                `;
            }
        }
    });

    const examForm = container.querySelector('#create-exam-form');
    examForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        const formData = new FormData(examForm);
        const btn = examForm.querySelector('button[type="submit"]');
        const msg = container.querySelector('#exam-msg');

        const name = formData.get('name');
        const date = formData.get('date');
        const count = parseInt(formData.get('numSubjects'));
        const grades = [];
        examForm.querySelectorAll('input[name="grades"]:checked').forEach(cb => grades.push(cb.value));

        if (grades.length === 0) {
            msg.innerHTML = `<div style="color: var(--danger); padding: 1rem;">Please select at least one grade.</div>`;
            return;
        }

        const subjects = [];
        for (let i = 0; i < count; i++) {
            subjects.push({
                name: formData.get(`subject_name_${i}`),
                max_marks: formData.get(`max_marks_${i}`)
            });
        }

        btn.disabled = true;
        btn.innerHTML = 'Creating Exams...';

        try {
            const inserts = grades.map(grade => ({
                name: name,
                date: date,
                class_grade: grade,
                subjects_definition: subjects
            }));

            const { error } = await window.supabaseClient.from('exams').insert(inserts);
            if (error) throw error;

            msg.innerHTML = `<div style="color: var(--success); padding: 1rem;">Exams Created Successfully!</div>`;
            examForm.reset();
            subjContainer.innerHTML = '';
        } catch (err) {
            msg.innerHTML = `<div style="color: var(--danger); padding: 1rem;">Error: ${err.message}</div>`;
        } finally {
            btn.disabled = false;
            btn.innerHTML = 'Schedule Exam';
        }
    });

    // --- SCHEDULE LOGIC ---
    const refreshBtn = container.querySelector('#refresh-schedule');
    refreshBtn.addEventListener('click', () => loadSchedule(container));

    async function loadSchedule(container) {
        const area = container.querySelector('#schedule-list-area');
        area.innerHTML = '<p style="text-align: center; color: var(--text-secondary);">Loading schedules...</p>';

        try {
            const { data, error } = await window.supabaseClient
                .from('exams')
                .select('*')
                .order('date', { ascending: false });

            if (error) throw error;

            if (!data || data.length === 0) {
                area.innerHTML = '<p style="text-align: center; color: var(--text-secondary);">No exams scheduled yet.</p>';
                return;
            }

            let html = `
                <div style="overflow-x: auto;">
                    <table style="width: 100%; border-collapse: collapse; min-width: 600px;">
                        <thead style="background: rgba(0,0,0,0.2); color: var(--text-secondary); font-size: 0.85rem; text-align: left;">
                            <tr>
                                <th style="padding: 1rem;">Exam Name</th>
                                <th style="padding: 1rem;">Grade</th>
                                <th style="padding: 1rem;">Start Date</th>
                                <th style="padding: 1rem;">Subjects</th>
                                <th style="padding: 1rem; text-align: right;">Action</th>
                            </tr>
                        </thead>
                        <tbody style="font-size: 0.95rem;">
            `;

            data.forEach(ex => {
                const subjects = ex.subjects_definition || [];
                const subjBadges = subjects.map(s =>
                    `<span style="background: rgba(255,255,255,0.1); padding: 2px 6px; border-radius: 4px; font-size: 0.8em; margin-right: 4px;">${s.name} (${s.max_marks})</span>`
                ).join('');

                html += `
                    <tr style="border-bottom: 1px solid rgba(255,255,255,0.05);">
                        <td style="padding: 1rem; font-weight: bold; color: var(--accent-color);">${ex.name}</td>
                        <td style="padding: 1rem;">Grade ${ex.class_grade}</td>
                        <td style="padding: 1rem;">${ex.date}</td>
                        <td style="padding: 1rem;">${subjBadges}</td>
                        <td style="padding: 1rem; text-align: right;">
                            <button class="delete-exam-btn btn-primary" data-id="${ex.id}" style="background: rgba(239, 68, 68, 0.2); color: var(--danger); padding: 0.4rem 0.8rem; font-size: 0.8rem; border: 1px solid var(--danger);">
                                <i class="fa-solid fa-trash"></i>
                            </button>
                        </td>
                    </tr>
                `;
            });

            html += `</tbody></table></div>`;
            area.innerHTML = html;

            // Attach Delete Listeners
            area.querySelectorAll('.delete-exam-btn').forEach(btn => {
                btn.addEventListener('click', async () => {
                    const id = btn.dataset.id;
                    if (!confirm('Are you sure you want to delete this exam schedule? This might delete associated marks!')) return;

                    btn.innerHTML = '<i class="fa-solid fa-spinner fa-spin"></i>';
                    btn.disabled = true;

                    try {
                        const { error } = await window.supabaseClient.from('exams').delete().eq('id', id);
                        if (error) throw error;
                        // Reload
                        loadSchedule(container);
                    } catch (e) {
                        alert('Error deleting: ' + e.message);
                        btn.innerHTML = '<i class="fa-solid fa-trash"></i>';
                        btn.disabled = false;
                    }
                });
            });

        } catch (err) {
            area.innerHTML = `<p style="color: var(--danger); text-align: center;">Error loading schedule: ${err.message}</p>`;
        }
    }

    // --- ENTER MARKS LOGIC ---
    const marksFilterForm = container.querySelector('#marks-filter-form');
    const marksGradeSelect = container.querySelector('#marks-grade-select');
    const marksExamSelect = container.querySelector('#marks-exam-select');
    const marksListArea = container.querySelector('#marks-list-area');

    // Load exams when grade changes
    marksGradeSelect.addEventListener('change', async (e) => {
        const grade = e.target.value;
        marksExamSelect.innerHTML = '<option value="">Loading...</option>';
        marksExamSelect.disabled = true;

        if (!grade) {
            marksExamSelect.innerHTML = '<option value="">Select Grade First</option>';
            return;
        }

        try {
            const { data, error } = await window.supabaseClient
                .from('exams')
                .select('id, name, date')
                .eq('class_grade', grade)
                .order('date', { ascending: false });

            if (error) throw error;

            if (!data || data.length === 0) {
                marksExamSelect.innerHTML = '<option value="">No exams found for this grade</option>';
            } else {
                marksExamSelect.innerHTML = '<option value="">Select Exam</option>';
                data.forEach(ex => {
                    marksExamSelect.innerHTML += `<option value="${ex.id}">${ex.name} (${ex.date})</option>`;
                });
                marksExamSelect.disabled = false;
            }
        } catch (err) {
            console.error(err);
            marksExamSelect.innerHTML = '<option value="">Error loading exams</option>';
        }
    });

    marksFilterForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        const examId = marksExamSelect.value;
        const grade = marksGradeSelect.value;
        await loadMarksEntryTable(grade, examId);
    });

    async function loadMarksEntryTable(grade, examId) {
        marksListArea.style.display = 'block';
        marksListArea.innerHTML = '<p style="text-align: center; color: var(--text-secondary);">Loading students and marks...</p>';

        try {
            // 1. Fetch Exam Details (Subjects)
            const { data: examData, error: examError } = await window.supabaseClient
                .from('exams')
                .select('*')
                .eq('id', examId)
                .single();

            if (examError) throw examError;

            const subjects = examData.subjects_definition || [];
            if (subjects.length === 0) {
                marksListArea.innerHTML = '<p style="color: var(--danger); text-align: center;">This exam has no subjects defined. Cannot enter marks.</p>';
                return;
            }

            // 2. Fetch Students
            const { data: students, error: studentError } = await window.supabaseClient
                .from('students')
                .select('id, full_name, roll_number')
                .eq('class_grade', grade)
                .order('roll_number', { ascending: true });

            if (studentError) throw studentError;

            if (students.length === 0) {
                marksListArea.innerHTML = '<p style="text-align: center; color: var(--text-secondary);">No students found in this grade.</p>';
                return;
            }

            // 3. Fetch Existing Marks for this Exam
            const { data: existingMarks, error: marksError } = await window.supabaseClient
                .from('marks')
                .select('student_id, subject, score')
                .eq('exam_id', examId);

            if (marksError) console.error(marksError);

            // Structure marks for easy lookup: marksMap[studentId][subjectName] = score
            const marksMap = {};
            if (existingMarks) {
                existingMarks.forEach(m => {
                    if (!marksMap[m.student_id]) marksMap[m.student_id] = {};
                    marksMap[m.student_id][m.subject] = m.score;
                });
            }

            // 4. Render Table
            let html = `
                <div style="overflow-x: auto; background: var(--sidebar-bg); border-radius: 0.5rem; border: var(--glass-border);">
                    <table style="width: 100%; border-collapse: collapse; min-width: 800px;">
                        <thead style="background: rgba(0,0,0,0.2); color: var(--text-secondary); font-size: 0.85rem; text-align: left;">
                            <tr>
                                <th style="padding: 1rem; width: 60px;">Roll</th>
                                <th style="padding: 1rem; width: 200px;">Student Name</th>
                                ${subjects.map(s => `<th style="padding: 1rem; min-width: 100px;">${s.name} <br><span style="font-size: 0.7em;">(/${s.max_marks})</span></th>`).join('')}
                                <th style="padding: 1rem; text-align: right; width: 100px;">Action</th>
                            </tr>
                        </thead>
                        <tbody style="font-size: 0.95rem;">
            `;

            students.forEach(student => {
                const sMarks = marksMap[student.id] || {};

                html += `
                    <tr style="border-bottom: 1px solid rgba(255,255,255,0.05);" data-student-id="${student.id}">
                        <td style="padding: 1rem; font-weight: bold; color: var(--accent-color);">${student.roll_number || '-'}</td>
                        <td style="padding: 1rem;">${student.full_name}</td>
                        ${subjects.map((subj, i) => {
                    const val = sMarks[subj.name] !== undefined ? sMarks[subj.name] : '';
                    return `
                                <td style="padding: 1rem;">
                                    <input type="number" 
                                        class="form-control mark-input" 
                                        data-subject="${subj.name}" 
                                        value="${val}" 
                                        max="${subj.max_marks}" 
                                        min="0"
                                        placeholder="-"
                                        style="width: 80px; padding: 0.4rem;"
                                    >
                                </td>
                            `;
                }).join('')}
                        <td style="padding: 1rem; text-align: right;">
                            <button class="save-row-btn btn-primary" style="padding: 0.4rem 1rem; font-size: 0.8rem;">
                                <i class="fa-solid fa-save"></i> Save
                            </button>
                        </td>
                    </tr>
                 `;
            });

            html += `</tbody></table></div>`;
            marksListArea.innerHTML = html;

            // Attach Save Listeners
            marksListArea.querySelectorAll('.save-row-btn').forEach(btn => {
                btn.addEventListener('click', async (e) => {
                    const row = e.target.closest('tr');
                    const studentId = row.dataset.studentId;
                    const inputs = row.querySelectorAll('.mark-input');
                    const originalText = btn.innerHTML;

                    btn.innerHTML = '<i class="fa-solid fa-spinner fa-spin"></i>';
                    btn.disabled = true;

                    const upsertData = [];
                    inputs.forEach(input => {
                        const subject = input.dataset.subject;
                        const score = input.value;

                        if (score !== '') {
                            upsertData.push({
                                exam_id: examId,
                                student_id: studentId,
                                subject: subject,
                                score: parseFloat(score)
                            });
                        }
                    });

                    if (upsertData.length === 0) {
                        alert("Please enter at least one mark.");
                        btn.innerHTML = originalText;
                        btn.disabled = false;
                        return;
                    }

                    try {
                        const { error } = await window.supabaseClient
                            .from('marks')
                            .upsert(upsertData, { onConflict: 'exam_id, student_id, subject' });

                        if (error) throw error;

                        // Visual Feedback
                        btn.innerHTML = '<i class="fa-solid fa-check"></i> Saved';
                        btn.style.background = 'var(--success)';
                        setTimeout(() => {
                            btn.innerHTML = originalText;
                            btn.style.background = ''; // reset
                            btn.className = 'save-row-btn btn-primary'; // maintain class
                        }, 2000);

                    } catch (err) {
                        alert('Failed to save marks: ' + err.message);
                        btn.innerHTML = originalText;
                    } finally {
                        btn.disabled = false;
                    }
                });
            });

        } catch (err) {
            marksListArea.innerHTML = `<p style="color: var(--danger); text-align: center;">Error: ${err.message}</p>`;
        }
    }

    // --- VIEW RESULTS LOGIC ---
    const resultsFilterForm = container.querySelector('#results-filter-form');
    const resultsGradeSelect = container.querySelector('#results-grade-select');
    const resultsExamSelect = container.querySelector('#results-exam-select');
    const resultsListArea = container.querySelector('#results-list-area');

    resultsGradeSelect.addEventListener('change', async (e) => {
        const grade = e.target.value;
        resultsExamSelect.innerHTML = '<option value="">Loading...</option>';
        resultsExamSelect.disabled = true;

        if (!grade) {
            resultsExamSelect.innerHTML = '<option value="">Select Grade First</option>';
            return;
        }

        try {
            const { data, error } = await window.supabaseClient
                .from('exams')
                .select('id, name, date')
                .eq('class_grade', grade)
                .order('date', { ascending: false });

            if (error) throw error;

            if (!data || data.length === 0) {
                resultsExamSelect.innerHTML = '<option value="">No exams found for this grade</option>';
            } else {
                resultsExamSelect.innerHTML = '<option value="">Select Exam</option>';
                data.forEach(ex => {
                    resultsExamSelect.innerHTML += `<option value="${ex.id}">${ex.name} (${ex.date})</option>`;
                });
                resultsExamSelect.disabled = false;
            }
        } catch (err) {
            console.error(err);
            resultsExamSelect.innerHTML = '<option value="">Error loading exams</option>';
        }
    });

    resultsFilterForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        const examId = resultsExamSelect.value;
        const grade = resultsGradeSelect.value;
        await generateResults(grade, examId);
    });

    async function generateResults(grade, examId) {
        resultsListArea.style.display = 'block';
        resultsListArea.innerHTML = '<p style="text-align: center; color: var(--text-secondary);">Calculating Results...</p>';

        try {
            // 1. Fetch Exam (Subjects and Max Marks)
            const { data: examData, error: examError } = await window.supabaseClient
                .from('exams')
                .select('*')
                .eq('id', examId)
                .single();

            if (examError) throw examError;

            const subjects = examData.subjects_definition || [];
            if (subjects.length === 0) {
                resultsListArea.innerHTML = '<p style="color: var(--danger); text-align: center;">No subjects defined for this exam.</p>';
                return;
            }

            // Calculate Total Max Marks
            const totalMaxMarks = subjects.reduce((sum, sub) => sum + parseFloat(sub.max_marks || 0), 0);

            // 2. Fetch Students
            const { data: students, error: studentError } = await window.supabaseClient
                .from('students')
                .select('id, full_name, roll_number')
                .eq('class_grade', grade)
                .order('roll_number', { ascending: true });

            if (studentError) throw studentError;

            // 3. Fetch All Marks
            const { data: marks, error: marksError } = await window.supabaseClient
                .from('marks')
                .select('student_id, subject, score')
                .eq('exam_id', examId);

            if (marksError) throw marksError;

            // 4. Process Data
            // Map student data with their marks
            const results = students.map(student => {
                const studentMarks = marks.filter(m => m.student_id === student.id);
                let obtainedTotal = 0;

                const marksObj = {};
                studentMarks.forEach(m => {
                    marksObj[m.subject] = m.score;
                    obtainedTotal += m.score;
                });

                const percentage = (obtainedTotal / totalMaxMarks) * 100;

                return {
                    ...student,
                    marks: marksObj,
                    obtainedTotal,
                    percentage: percentage.toFixed(2)
                };
            });

            // Sort by Percentage Descending for Ranking
            results.sort((a, b) => b.percentage - a.percentage);

            // 5. Render
            let html = `
                 <div class="glass-card" style="padding: 1.5rem; margin-top: 1rem;">
                     <div style="display:flex; justify-content:space-between; margin-bottom:1rem;">
                         <h2 style="color:var(--accent-color);">${examData.name} - Grade ${grade} Results</h2>
                         <button onclick="window.print()" class="btn-primary"><i class="fa-solid fa-print"></i> Print Result</button>
                     </div>
                     
                     <div id="printable-area">
                         <style>
                             @media print {
                                 body * { visibility: hidden; }
                                 #printable-area, #printable-area * { visibility: visible; }
                                 #printable-area { position: absolute; left: 0; top: 0; width: 100%; color: black;}
                                 table { border-collapse: collapse; width: 100%; }
                                 th, td { border: 1px solid #000; padding: 8px; text-align: left; }
                                 th { background-color: #f2f2f2; }
                                 .no-print { display: none; }
                             }
                         </style>
                         <table style="width: 100%; border-collapse: collapse;">
                             <thead>
                                 <tr style="background: rgba(255,255,255,0.1); color: var(--text-primary);">
                                     <th style="padding: 1rem; border: 1px solid rgba(255,255,255,0.1);">Rank</th>
                                     <th style="padding: 1rem; border: 1px solid rgba(255,255,255,0.1);">Roll</th>
                                     <th style="padding: 1rem; border: 1px solid rgba(255,255,255,0.1);">Name</th>
                                     ${subjects.map(s => `<th style="padding: 1rem; border: 1px solid rgba(255,255,255,0.1);">${s.name} <br><small>(${s.max_marks})</small></th>`).join('')}
                                     <th style="padding: 1rem; border: 1px solid rgba(255,255,255,0.1);">Total <br><small>(${totalMaxMarks})</small></th>
                                     <th style="padding: 1rem; border: 1px solid rgba(255,255,255,0.1);">%</th>
                                 </tr>
                             </thead>
                             <tbody>
             `;

            results.forEach((r, index) => {
                html += `
                     <tr style="border-bottom: 1px solid rgba(255,255,255,0.05);">
                         <td style="padding: 1rem; border: 1px solid rgba(255,255,255,0.1); font-weight:bold; color: var(--accent-color);">#${index + 1}</td>
                         <td style="padding: 1rem; border: 1px solid rgba(255,255,255,0.1);">${r.roll_number || '-'}</td>
                         <td style="padding: 1rem; border: 1px solid rgba(255,255,255,0.1);">${r.full_name}</td>
                         ${subjects.map(s => `
                             <td style="padding: 1rem; border: 1px solid rgba(255,255,255,0.1);">
                                 ${r.marks[s.name] !== undefined ? r.marks[s.name] : '-'}
                             </td>
                         `).join('')}
                         <td style="padding: 1rem; border: 1px solid rgba(255,255,255,0.1); font-weight:bold;">${r.obtainedTotal}</td>
                         <td style="padding: 1rem; border: 1px solid rgba(255,255,255,0.1);">${r.percentage}%</td>
                     </tr>
                 `;
            });

            html += `</tbody></table></div></div>`;
            resultsListArea.innerHTML = html;

        } catch (err) {
            resultsListArea.innerHTML = `<p style="color: var(--danger); text-align: center;">Error generating results: ${err.message}</p>`;
        }
    }
}


