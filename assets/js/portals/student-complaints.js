window.Portals = window.Portals || {};

window.Portals.renderStudentComplaints = function (container) {
    container.innerHTML = `
        <div class="welcome-banner">
            <h1>Student Complaints</h1>
            <p>Log and manage student grievances.</p>
        </div>

        <div class="tabs" style="display: flex; gap: 1rem; margin-bottom: 1.5rem; border-bottom: 2px solid rgba(255,255,255,0.1);">
            <button class="tab-btn active" data-tab="file-complaint" style="background: none; border: none; padding: 0.5rem 1rem; color: var(--text-primary); cursor: pointer; border-bottom: 2px solid var(--accent-color);">File a Complaint</button>
            <button class="tab-btn" data-tab="complaint-records" style="background: none; border: none; padding: 0.5rem 1rem; color: var(--text-secondary); cursor: pointer;">Student Complaint Records</button>
        </div>

        <!-- FILE COMPLAINT TAB -->
        <div id="file-complaint-tab">
            <div class="glass-card" style="padding: 2rem; border-radius: 1rem; max-width: 800px;">
                <h3>New Complaint</h3>
                <form id="complaint-form">
                    
                    <!-- Search Section -->
                    <div style="margin-bottom: 2rem; background: rgba(0,0,0,0.2); padding: 1.5rem; border-radius: 0.5rem;">
                        <label style="color: var(--accent-color); margin-bottom: 0.5rem; display: block;">Search Student</label>
                        <div style="display: flex; gap: 1rem; margin-bottom: 1rem;">
                            <input type="text" id="student-search-input" class="form-control" placeholder="Search by Name, Roll No, or ID..." autocomplete="off">
                            <button type="button" id="search-student-btn" class="btn-primary"><i class="fa-solid fa-search"></i> Search</button>
                        </div>
                        <div id="search-results-dropdown" style="display: none; background: var(--card-bg); border: 1px solid rgba(255,255,255,0.1); border-radius: 0.5rem; max-height: 200px; overflow-y: auto;"></div>
                    </div>

                    <!-- Auto-filled Details -->
                    <div style="display: grid; grid-template-columns: 1fr 1fr 1fr; gap: 1rem; margin-bottom: 1.5rem;">
                        <div class="form-group">
                            <label>Student Name</label>
                            <input type="text" id="auto-name" class="form-control" readonly style="background: rgba(255,255,255,0.05); color: var(--text-secondary);">
                        </div>
                        <div class="form-group">
                            <label>Grade</label>
                            <input type="text" id="auto-grade" class="form-control" readonly style="background: rgba(255,255,255,0.05); color: var(--text-secondary);">
                        </div>
                         <div class="form-group">
                            <label>Student ID/Roll</label>
                            <input type="text" id="auto-id-display" class="form-control" readonly style="background: rgba(255,255,255,0.05); color: var(--text-secondary);">
                        </div>
                        <input type="hidden" name="student_id" id="selected-student-id" required>
                    </div>

                    <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 1.5rem;">
                        <div class="form-group">
                            <label>Date</label>
                            <input type="date" name="complaint_date" class="form-control" value="${new Date().toISOString().split('T')[0]}" required>
                        </div>
                        <div class="form-group">
                            <label>Criticality</label>
                            <select name="criticality" class="form-control" required>
                                <option value="low">Low</option>
                                <option value="medium">Medium</option>
                                <option value="high">High</option>
                            </select>
                        </div>
                    </div>

                    <div class="form-group">
                        <label>Short Description</label>
                        <input type="text" name="title" class="form-control" placeholder="Brief summary of the issue..." required>
                    </div>

                    <button type="submit" class="btn-primary" style="margin-top: 1rem; width: 100%; background: var(--warning); color: black; font-weight: bold;">
                        <i class="fa-solid fa-paper-plane"></i> Submit Complaint
                    </button>
                </form>
                <div id="comp-msg" style="margin-top: 1rem;"></div>
            </div>
        </div>

        <!-- RECENT COMPLAINTS TAB -->
        <div id="complaint-records-tab" style="display: none;">
            <!-- Stats Row -->
             <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(150px, 1fr)); gap: 1rem; margin-bottom: 1.5rem;">
                <div class="glass-card" style="padding: 1rem; text-align: center; background: rgba(0, 123, 255, 0.1); border: 1px solid rgba(0, 123, 255, 0.3);">
                    <h2 id="stat-total" style="color: #60a5fa; margin: 0; font-size: 2rem;">0</h2>
                    <p style="margin: 0; color: var(--text-secondary); font-size: 0.9rem;">Total Complaints</p>
                </div>
                <div class="glass-card" style="padding: 1rem; text-align: center; background: rgba(239, 68, 68, 0.1); border: 1px solid rgba(239, 68, 68, 0.3);">
                    <h2 id="stat-high" style="color: #f87171; margin: 0; font-size: 2rem;">0</h2>
                    <p style="margin: 0; color: var(--text-secondary); font-size: 0.9rem;">High Criticality</p>
                </div>
                <div class="glass-card" style="padding: 1rem; text-align: center; background: rgba(245, 158, 11, 0.1); border: 1px solid rgba(245, 158, 11, 0.3);">
                    <h2 id="stat-medium" style="color: #fbbf24; margin: 0; font-size: 2rem;">0</h2>
                    <p style="margin: 0; color: var(--text-secondary); font-size: 0.9rem;">Medium Criticality</p>
                </div>
                <div class="glass-card" style="padding: 1rem; text-align: center; background: rgba(16, 185, 129, 0.1); border: 1px solid rgba(16, 185, 129, 0.3);">
                    <h2 id="stat-low" style="color: #34d399; margin: 0; font-size: 2rem;">0</h2>
                    <p style="margin: 0; color: var(--text-secondary); font-size: 0.9rem;">Low Criticality</p>
                </div>
            </div>

            <!-- List Section -->
            <div class="glass-card" style="padding: 1.5rem; border-radius: 1rem;">
                <div style="display: flex; flex-wrap: wrap; justify-content: space-between; align-items: end; margin-bottom: 1rem; gap: 1rem;">
                    
                    <div style="flex: 1; min-width: 300px; position: relative;">
                         <label style="font-size: 0.9rem; color: var(--text-secondary); margin-bottom: 0.5rem; display: block;">Filter by Student</label>
                         <div style="display: flex; gap: 0.5rem;">
                            <input type="text" id="records-student-search" class="form-control" placeholder="Type Name or ID..." autocomplete="off">
                            <button id="clear-records-filter" class="btn-primary" style="background: rgba(255,255,255,0.1); display: none;">Clear</button>
                         </div>
                         <div id="records-search-dropdown" style="display: none; position: absolute; top: 100%; left: 0; width: 100%; background: var(--card-bg); border: 1px solid rgba(255,255,255,0.1); border-radius: 0.5rem; max-height: 200px; overflow-y: auto; z-index: 10;"></div>
                    </div>

                    <div style="display: flex; gap: 1rem; align-items: center;">
                         <button id="refresh-complaints" class="btn-primary" style="padding: 0.5rem 1rem; font-size: 0.9rem;"><i class="fa-solid fa-sync"></i> Refresh</button>
                    </div>
                </div>

                <div id="complaints-list-area">
                    <p style="text-align: center; color: var(--text-secondary);">Loading records...</p>
                </div>
            </div>
        </div>
    `;

    // Tab Interface
    const tabs = container.querySelectorAll('.tab-btn');
    const sections = {
        'file-complaint': container.querySelector('#file-complaint-tab'),
        'complaint-records': container.querySelector('#complaint-records-tab')
    };

    let currentRecordsFilterStudentId = null;

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

            if (tab.dataset.tab === 'complaint-records') {
                loadComplaintRecords(container, currentRecordsFilterStudentId);
            }
        });
    });

    // --- SEARCH STUDENT LOGIC (File Complaint) ---
    const searchInput = container.querySelector('#student-search-input');
    const searchBtn = container.querySelector('#search-student-btn');
    const resultsDropdown = container.querySelector('#search-results-dropdown');

    // Auto-fill fields
    const autoName = container.querySelector('#auto-name');
    const autoGrade = container.querySelector('#auto-grade');
    const autoIdDisplay = container.querySelector('#auto-id-display');
    const selectedStudentId = container.querySelector('#selected-student-id');

    async function searchStudents(inputEl, dropdownEl, callback) {
        const query = inputEl.value.trim();
        if (query.length < 2) {
            return;
        }

        try {
            const { data, error } = await window.supabaseClient
                .from('students')
                .select('id, full_name, class_grade, student_code, roll_number')
                .or(`full_name.ilike.%${query}%,student_code.ilike.%${query}%`)
                .limit(10);

            if (error) throw error;

            dropdownEl.style.display = 'block';
            if (!data || data.length === 0) {
                dropdownEl.innerHTML = '<p style="padding: 1rem; text-align: center; color: var(--text-secondary);">No students found.</p>';
            } else {
                dropdownEl.innerHTML = data.map(s => `
                    <div class="student-search-item" 
                         data-id="${s.id}" 
                         data-name="${s.full_name}" 
                         data-grade="${s.class_grade}" 
                         data-roll="${s.roll_number || 'N/A'}"
                         data-code="${s.student_code || 'N/A'}"
                         style="padding: 0.75rem; border-bottom: 1px solid rgba(255,255,255,0.05); cursor: pointer; transition: background 0.2s;">
                        <div style="font-weight: bold; color: var(--text-primary);">${s.full_name}</div>
                        <div style="font-size: 0.85rem; color: var(--text-secondary);">
                            Grade: ${s.class_grade} | Roll: ${s.roll_number || '-'} | ID: ${s.student_code || '-'}
                        </div>
                    </div>
                `).join('');

                dropdownEl.querySelectorAll('.student-search-item').forEach(item => {
                    item.addEventListener('click', () => {
                        callback(item.dataset);
                        dropdownEl.style.display = 'none';
                    });
                });
            }

        } catch (err) {
            console.error(err);
        }
    }

    // Logic for File Complaint Search
    searchBtn.addEventListener('click', () => {
        searchStudents(searchInput, resultsDropdown, (dataset) => {
            selectedStudentId.value = dataset.id;
            autoName.value = dataset.name;
            autoGrade.value = dataset.grade;
            autoIdDisplay.value = `${dataset.code} (Roll: ${dataset.roll})`;
        });
    });
    searchInput.addEventListener('input', (e) => {
        // Debounce can be added here, currently manual button or enter for tab 1
    });

    // --- RECORDS SEARCH LOGIC ---
    const recordsSearchInput = container.querySelector('#records-student-search');
    const recordsDropdown = container.querySelector('#records-search-dropdown');
    const clearFilterBtn = container.querySelector('#clear-records-filter');

    recordsSearchInput.addEventListener('input', (e) => {
        searchStudents(recordsSearchInput, recordsDropdown, (dataset) => {
            recordsSearchInput.value = dataset.name;
            currentRecordsFilterStudentId = dataset.id;
            clearFilterBtn.style.display = 'block';
            loadComplaintRecords(container, currentRecordsFilterStudentId);
        });
    });

    clearFilterBtn.addEventListener('click', () => {
        recordsSearchInput.value = '';
        currentRecordsFilterStudentId = null;
        clearFilterBtn.style.display = 'none';
        loadComplaintRecords(container, null);
    });

    // --- SUBMIT COMPLAINT FORM ---
    const form = container.querySelector('#complaint-form');
    form.addEventListener('submit', async (e) => {
        e.preventDefault();
        const msgDiv = container.querySelector('#comp-msg');

        if (!selectedStudentId.value) {
            msgDiv.innerHTML = '<div style="color: var(--danger); padding: 0.5rem;">Please search and select a student first.</div>';
            return;
        }

        const formData = new FormData(form);
        const submitBtn = form.querySelector('button[type="submit"]');

        const updates = {
            student_id: formData.get('student_id'),
            title: formData.get('title'),
            criticality: formData.get('criticality'),
            complaint_date: formData.get('complaint_date'),
            status: 'pending'
        };

        submitBtn.disabled = true;
        submitBtn.innerHTML = 'Submitting...';

        try {
            const { error } = await window.supabaseClient.from('complaints').insert([updates]);
            if (error) throw error;

            msgDiv.innerHTML = '<div style="color: var(--success); padding: 0.5rem; background: rgba(16, 185, 129, 0.1); border-radius: 4px;">Complaint Logged Successfully.</div>';
            form.reset();
            autoName.value = '';
            autoGrade.value = '';
            autoIdDisplay.value = '';
            selectedStudentId.value = '';

        } catch (err) {
            msgDiv.innerHTML = `<div style="color: var(--danger); padding: 0.5rem;">Error: ${err.message}</div>`;
        } finally {
            submitBtn.disabled = false;
            submitBtn.innerHTML = '<i class="fa-solid fa-paper-plane"></i> Submit Complaint';
        }
    });

    // --- LOAD RECORDS LOGIC ---
    const refreshRecordsBtn = container.querySelector('#refresh-complaints');
    refreshRecordsBtn.addEventListener('click', () => loadComplaintRecords(container, currentRecordsFilterStudentId));

    async function loadComplaintRecords(container, filterStudentId = null) {
        const area = container.querySelector('#complaints-list-area');
        const statTotal = container.querySelector('#stat-total');
        const statHigh = container.querySelector('#stat-high');
        const statMedium = container.querySelector('#stat-medium');
        const statLow = container.querySelector('#stat-low');

        area.innerHTML = '<p style="text-align: center; color: var(--text-secondary);">Loading records...</p>';

        try {
            let query = window.supabaseClient
                .from('complaints')
                .select(`
                    *,
                    students ( full_name, class_grade, roll_number )
                `)
                .order('complaint_date', { ascending: false })
                .order('created_at', { ascending: false });

            if (filterStudentId) {
                query = query.eq('student_id', filterStudentId);
            } else {
                query = query.limit(50); // Limit regular view, but if filtered, show all
            }

            const { data, error } = await query;

            if (error) throw error;

            // Update Stats (Client-side calculation for now based on fetched data, or we could do separate queries)
            // If we only fetch 50, stats might be wrong for "All". 
            // For correct "All Stats", we should ideally run a separate query, but for now lets aggregate based on results 
            // OR do a separate count query. A separate count query is better.

            updateStats(filterStudentId, { statTotal, statHigh, statMedium, statLow });

            if (!data || data.length === 0) {
                area.innerHTML = '<p style="text-align: center; color: var(--text-secondary);">No complaints records found.</p>';
                return;
            }

            let html = `
                <div style="overflow-x: auto;">
                    <table style="width: 100%; border-collapse: collapse; min-width: 600px;">
                        <thead style="background: rgba(0,0,0,0.2); color: var(--text-secondary); font-size: 0.85rem; text-align: left;">
                            <tr>
                                <th style="padding: 1rem;">Date</th>
                                <th style="padding: 1rem;">Student</th>
                                <th style="padding: 1rem;">Grade</th>
                                <th style="padding: 1rem;">Description</th>
                                <th style="padding: 1rem;">Criticality</th>
                                <th style="padding: 1rem;">Status</th>
                            </tr>
                        </thead>
                        <tbody style="font-size: 0.95rem;">
            `;

            data.forEach(c => {
                const studentName = c.students?.full_name || 'Unknown';
                const grade = c.students?.class_grade || '-';

                let critColor = 'var(--text-secondary)';
                if (c.criticality === 'high') critColor = 'var(--danger)';
                if (c.criticality === 'medium') critColor = '#fbbf24';
                if (c.criticality === 'low') critColor = 'var(--success)';

                html += `
                    <tr style="border-bottom: 1px solid rgba(255,255,255,0.05);">
                        <td style="padding: 1rem;">${c.complaint_date || c.created_at.split('T')[0]}</td>
                        <td style="padding: 1rem; font-weight: bold; color: var(--accent-color);">${studentName}</td>
                        <td style="padding: 1rem;">${grade}</td>
                        <td style="padding: 1rem;">${c.title}</td>
                        <td style="padding: 1rem;">
                            <span style="color: ${critColor}; font-weight: bold; text-transform: capitalize;">${c.criticality || 'low'}</span>
                        </td>
                         <td style="padding: 1rem;">
                            <span style="background: rgba(255,255,255,0.1); padding: 2px 8px; border-radius: 10px; font-size: 0.8rem;">${c.status}</span>
                        </td>
                    </tr>
                `;
            });

            html += `</tbody></table></div>`;
            area.innerHTML = html;

        } catch (err) {
            area.innerHTML = `<p style="color: var(--danger); text-align: center;">Error loading records: ${err.message}</p>`;
        }
    }

    async function updateStats(studentId, elements) {
        // Reset
        elements.statTotal.innerText = '-';
        elements.statHigh.innerText = '-';
        elements.statMedium.innerText = '-';
        elements.statLow.innerText = '-';

        try {
            let query = window.supabaseClient.from('complaints').select('criticality');
            if (studentId) {
                query = query.eq('student_id', studentId);
            }

            const { data, error } = await query;
            if (error) throw error;

            const total = data.length;
            const high = data.filter(c => c.criticality === 'high').length;
            const medium = data.filter(c => c.criticality === 'medium').length;
            const low = data.filter(c => (!c.criticality || c.criticality === 'low')).length;

            elements.statTotal.innerText = total;
            elements.statHigh.innerText = high;
            elements.statMedium.innerText = medium;
            elements.statLow.innerText = low;
        } catch (e) {
            console.error("Stats error", e);
        }
    }
}
