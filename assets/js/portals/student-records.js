window.Portals = window.Portals || {};

window.Portals.renderStudentRecords = function (container) {
    container.innerHTML = `
        <div class="welcome-banner">
            <h1>Student Records</h1>
            <p>Search and view student profiles.</p>
        </div>

        <div class="glass-card" style="padding: 1.5rem; margin-bottom: 2rem; border-radius: 1rem;">
            <form id="student-search-form" style="display: grid; grid-template-columns: repeat(auto-fit, minmax(200px, 1fr)); gap: 1rem; align-items: end;">
                <div class="form-group" style="margin-bottom: 0;">
                    <label>Admission No.</label>
                    <input type="text" name="studentCode" class="form-control" placeholder="e.g. SCL001">
                </div>
                <div class="form-group" style="margin-bottom: 0;">
                    <label>Student Name</label>
                    <input type="text" name="name" class="form-control" placeholder="Partial name...">
                </div>
                <div class="form-group" style="margin-bottom: 0;">
                    <label>Class / Grade</label>
                    <select name="classGrade" class="form-control">
                        <option value="">Any Class</option>
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
                <div class="form-group" style="margin-bottom: 0;">
                    <label>Gender</label>
                    <select name="gender" class="form-control">
                        <option value="">Any Gender</option>
                        <option value="Male">Male</option>
                        <option value="Female">Female</option>
                    </select>
                </div>
                <div style="display: flex; gap: 0.5rem;">
                    <button type="submit" class="btn-primary" style="flex: 1;"><i class="fa-solid fa-search"></i> Search</button>
                    <button type="button" id="clear-search" class="btn-primary" style="background: rgba(255,255,255,0.1); width: 50px;"><i class="fa-solid fa-refresh"></i></button>
                </div>
            </form>
        </div>

        <div id="results-area">
            <div style="text-align: center; color: var(--text-secondary); padding: 3rem;">
                <i class="fa-solid fa-magnifying-glass" style="font-size: 3rem; margin-bottom: 1rem; opacity: 0.5;"></i>
                <p>Enter criteria above to find students.</p>
            </div>
        </div>
    `;

    const form = container.querySelector('#student-search-form');
    const resultsArea = container.querySelector('#results-area');
    const clearBtn = container.querySelector('#clear-search');

    form.addEventListener('submit', async (e) => {
        e.preventDefault();
        const formData = new FormData(form);
        await searchStudents(formData);
    });

    clearBtn.addEventListener('click', () => {
        form.reset();
        resultsArea.innerHTML = `
            <div style="text-align: center; color: var(--text-secondary); padding: 3rem;">
                <i class="fa-solid fa-magnifying-glass" style="font-size: 3rem; margin-bottom: 1rem; opacity: 0.5;"></i>
                <p>Enter criteria above to find students.</p>
            </div>`;
    });

    async function searchStudents(formData) {
        resultsArea.innerHTML = '<p style="text-align: center; color: var(--text-secondary);">Searching...</p>';

        const code = formData.get('studentCode').trim();
        const name = formData.get('name').trim();
        const grade = formData.get('classGrade');
        const gender = formData.get('gender');

        let query = window.supabaseClient.from('students').select('*');

        if (code) query = query.ilike('student_code', `%${code}%`);
        if (name) query = query.ilike('full_name', `%${name}%`);
        if (grade) query = query.eq('class_grade', grade);
        if (gender) query = query.eq('gender', gender);

        query = query.order('student_code', { ascending: true });

        const { data, error } = await query;

        if (error) {
            resultsArea.innerHTML = `<p style="color: var(--danger); text-align: center;">Error: ${error.message}</p>`;
            return;
        }

        if (data.length === 0) {
            resultsArea.innerHTML = `<p style="text-align: center; color: var(--text-secondary);">No profiles found matching criteria.</p>`;
            return;
        }

        // Render Table
        let html = `
            <div style="overflow-x: auto; background: var(--sidebar-bg); border-radius: 0.5rem; border: var(--glass-border);">
                <table style="width: 100%; border-collapse: collapse; min-width: 600px;">
                    <thead style="background: rgba(0,0,0,0.2); color: var(--text-secondary); font-size: 0.85rem; text-align: left;">
                        <tr>
                            <th style="padding: 1rem;">ID</th>
                            <th style="padding: 1rem;">Name</th>
                            <th style="padding: 1rem;">Class</th>
                            <th style="padding: 1rem;">Address</th>
                            <th style="padding: 1rem;">Father's Name</th>
                            <th style="padding: 1rem;">Father's Number</th>
                        </tr>
                    </thead>
                    <tbody style="font-size: 0.9rem;">
        `;

        data.forEach(student => {
            html += `
                <tr style="border-bottom: 1px solid rgba(255,255,255,0.05);">
                    <td style="padding: 1rem; font-weight: bold; color: var(--accent-color);">${student.student_code || 'N/A'}</td>
                    <td style="padding: 1rem;">${student.full_name}</td>
                    <td style="padding: 1rem;">Grade ${student.class_grade}</td>
                    <td style="padding: 1rem;">${student.address || '-'}</td>
                    <td style="padding: 1rem;">${student.father_name || '-'}</td>
                    <td style="padding: 1rem;">${student.father_contact || '-'}</td>
                </tr>
            `;
        });

        html += `</tbody></table></div>`;
        resultsArea.innerHTML = html;
    }
}
