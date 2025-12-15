window.Portals = window.Portals || {};

window.Portals.renderStudentFees = function (container) {
    container.innerHTML = `
        <div class="welcome-banner">
            <h1>Student Fees Portal</h1>
            <p>Manage fee payments, view history and structures.</p>
        </div>

        <div class="tabs" style="display: flex; gap: 1rem; margin-bottom: 1.5rem; border-bottom: 2px solid rgba(255,255,255,0.1); overflow-x: auto;">
            <button class="tab-btn active" data-tab="fee-details" style="background: none; border: none; padding: 0.5rem 1rem; color: var(--text-primary); cursor: pointer; border-bottom: 2px solid var(--accent-color); white-space: nowrap;">Fee Details</button>
            <button class="tab-btn" data-tab="collect-fees" style="background: none; border: none; padding: 0.5rem 1rem; color: var(--text-secondary); cursor: pointer; white-space: nowrap;">Collect Fees</button>
            <button class="tab-btn" data-tab="transactions" style="background: none; border: none; padding: 0.5rem 1rem; color: var(--text-secondary); cursor: pointer; white-space: nowrap;">Transactions</button>
            <button class="tab-btn" data-tab="fee-structure" style="background: none; border: none; padding: 0.5rem 1rem; color: var(--text-secondary); cursor: pointer; white-space: nowrap;">Fee Structure</button>
        </div>

        <!-- TAB 1: FEE DETAILS -->
        <div id="fee-details-tab">
            <!-- Search Section -->
            <div class="glass-card" style="padding: 1.5rem; margin-bottom: 1.5rem; border-radius: 1rem;">
                <div style="display: flex; gap: 1rem;">
                    <input type="text" id="detail-search-input" class="form-control" placeholder="Search by Name or Admission ID..." style="flex: 1;">
                    <button id="detail-search-btn" class="btn-primary">Search</button>
                </div>
                <div id="detail-search-results" style="margin-top: 1rem; max-height: 200px; overflow-y: auto; display: none;"></div>
            </div>

            <!-- Profile & Stats Section (Hidden by default) -->
            <div id="student-fee-profile" style="display: none;">
                <div class="glass-card" style="padding: 2rem; border-radius: 1rem; margin-bottom: 2rem; background: linear-gradient(145deg, rgba(255,255,255,0.05) 0%, rgba(0,0,0,0.2) 100%);">
                    <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(200px, 1fr)); gap: 2rem; margin-bottom: 2rem;">
                        <div>
                            <small style="color: var(--text-secondary);">Student Details</small>
                            <h2 id="prof-name" style="margin: 0.5rem 0;">John Doe</h2>
                            <p id="prof-id" style="color: var(--accent-color); font-weight: bold;">SCL001</p>
                            <p id="prof-grade">Grade 10</p>
                        </div>
                        <div>
                            <small style="color: var(--text-secondary);">Parent Info</small>
                            <p style="margin: 0.5rem 0;"><strong>Father:</strong> <span id="prof-father">Mr. Doe</span></p>
                            <p><strong>Phone:</strong> <span id="prof-phone">1234567890</span></p>
                        </div>
                        <div style="background: rgba(0,0,0,0.3); padding: 1rem; border-radius: 0.5rem;">
                            <div style="display: flex; justify-content: space-between; margin-bottom: 0.5rem;">
                                <span>Total Fees:</span>
                                <span id="stat-total" style="font-weight: bold;">₹0</span>
                            </div>
                            <div style="display: flex; justify-content: space-between; margin-bottom: 0.5rem;">
                                <span>Paid:</span>
                                <span id="stat-paid" style="color: var(--success); font-weight: bold;">₹0</span>
                            </div>
                            <div style="display: flex; justify-content: space-between; border-top: 1px solid rgba(255,255,255,0.1); padding-top: 0.5rem;">
                                <span>Due:</span>
                                <span id="stat-due" style="color: var(--danger); font-weight: bold;">₹0</span>
                            </div>
                        </div>
                    </div>

                    <h3>Payment History</h3>
                    <div style="overflow-x: auto;">
                        <table style="width: 100%; border-collapse: collapse; margin-top: 1rem;">
                            <thead style="background: rgba(0,0,0,0.2); color: var(--text-secondary); text-align: left;">
                                <tr>
                                    <th style="padding: 1rem;">Date</th>
                                    <th style="padding: 1rem;">Description</th>
                                    <th style="padding: 1rem;">Amount</th>
                                    <th style="padding: 1rem;">Status</th>
                                </tr>
                            </thead>
                            <tbody id="prof-history-body"></tbody>
                        </table>
                    </div>
                </div>
            </div>
        </div>

        <!-- TAB 2: COLLECT FEES -->
        <div id="collect-fees-tab" style="display: none;">
            <div style="display: flex; gap: 2rem; flex-wrap: wrap;">
                <!-- Form Section -->
                <div class="form-card" style="flex: 1; min-width: 300px;">
                    <h3>Collect Fees</h3>
                    <form id="fee-form">
                        <div class="form-group">
                            <label>Student Admission No. (e.g., SCL001)</label>
                            <div style="display: flex; gap: 0.5rem;">
                                <input type="text" name="studentCode" id="search-code" class="form-control" placeholder="Enter ID" required>
                                <button type="button" id="check-student-btn" class="btn-primary" style="padding: 0 1rem;"><i class="fa-solid fa-search"></i></button>
                            </div>
                            <small id="student-name-display" style="color: var(--accent-color); display: block; margin-top: 0.25rem; min-height: 1.2em;"></small>
                        </div>
                        <input type="hidden" name="studentId" id="real-student-id">
                        
                        <!-- Calculated Due (Read Only) -->
                        <div class="form-group">
                            <label>Current Due Amount (₹)</label>
                            <input type="number" id="current-due-display" class="form-control" style="background: rgba(255,255,255,0.1); color: var(--warning); font-weight: bold;" readonly>
                        </div>

                        <div class="form-group">
                            <label>Description</label>
                            <input type="text" name="description" class="form-control" value="Tuition Fee" required>
                        </div>

                        <div class="form-group">
                            <label>Amount to be Paid (₹)</label>
                            <input type="number" name="amount" id="fee-amount" class="form-control" step="0.01" required>
                        </div>

                        <div class="form-group">
                            <label>Paid Date</label>
                            <input type="date" name="paidDate" id="paid-date-input" class="form-control" required>
                        </div>
                        
                        <div class="form-group">
                            <label>Paid To</label>
                            <input type="text" name="paidTo" class="form-control" placeholder="Receiver Name" required>
                        </div>

                        <div class="form-group">
                            <label>Payment Mode</label>
                            <select name="paymentMode" class="form-control">
                                <option value="CASH">CASH</option>
                                <option value="UPI">UPI</option>
                                <option value="CHEQUE">CHEQUE</option>
                            </select>
                        </div>

                        <button type="submit" class="btn-primary">Collect Fee</button>
                    </form>
                    <div id="msg-area" style="margin-top: 1rem;"></div>
                </div>

                <!-- List Section -->
                <div class="glass-card" style="flex: 1; min-width: 300px; padding: 1.5rem; background: var(--sidebar-bg); border-radius: 1rem; border: var(--glass-border);">
                    <div style="display: flex; justify-content: space-between; align-items: center;">
                        <h3>Recent Transactions</h3>
                        <button id="show-recent-fees-btn" class="btn-primary" style="font-size: 0.8rem; padding: 0.25rem 0.75rem;">Show Latest</button>
                    </div>
                    <div id="fees-list" style="margin-top: 1rem; max-height: 600px; overflow-y: auto;">
                        <p style="color: var(--text-secondary);">Click 'Show Latest' to view.</p>
                    </div>
                </div>
            </div>
        </div>
        
        <!-- TAB 3: TRANSACTIONS (New) -->
        <div id="transactions-tab" style="display: none;">
            <div class="glass-card" style="padding: 1.5rem; background: var(--sidebar-bg); border-radius: 1rem; margin-bottom: 2rem;">
                <h3>Filter Transactions</h3>
                <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(200px, 1fr)); gap: 1rem; margin-top: 1rem;">
                    <div class="form-group">
                        <label>Search (ID, Name, Paid To)</label>
                        <input type="text" id="trans-search-query" class="form-control" placeholder="...">
                    </div>
                    <div class="form-group">
                        <label>From Date</label>
                        <input type="date" id="trans-date-from" class="form-control">
                    </div>
                    <div class="form-group">
                        <label>To Date</label>
                        <input type="date" id="trans-date-to" class="form-control">
                    </div>
                    <div class="form-group">
                        <label>Payment Mode</label>
                        <select id="trans-filter-mode" class="form-control">
                            <option value="">All</option>
                            <option value="CASH">CASH</option>
                            <option value="UPI">UPI</option>
                            <option value="CHEQUE">CHEQUE</option>
                            <option value="OTHER">OTHER</option>
                        </select>
                    </div>
                    <div style="display: flex; align-items: flex-end;">
                        <button id="trans-apply-filters" class="btn-primary" style="width: 100%;">Apply Filters</button>
                    </div>
                </div>
            </div>

            <div class="glass-card" style="padding: 1.5rem; background: var(--sidebar-bg); border-radius: 1rem;">
                <h3 style="margin-bottom: 1rem;">Results</h3>
                <div id="transactions-results-list" style="margin-top: 1rem; max-height: 600px; overflow-y: auto;">
                     <p style="color: var(--text-secondary);">Apply filters to search.</p>
                </div>
            </div>
        </div>

        <!-- TAB 4: FEE STRUCTURE -->
        <div id="fee-structure-tab" style="display: none;">
            <div class="glass-card" style="padding: 2rem; background: var(--sidebar-bg); border-radius: 1rem;">
                <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 1.5rem;">
                    <h3>Grade Fee Structure</h3>
                    <button id="refresh-structure" class="btn-primary" style="background: rgba(255,255,255,0.1);"><i class="fa-solid fa-refresh"></i> Refresh</button>
                </div>
                <div id="structure-list" style="display: grid; grid-template-columns: repeat(auto-fill, minmax(200px, 1fr)); gap: 1rem;">
                    <p>Loading structure...</p>
                </div>
            </div>
        </div>
    `;

    // --- TAB LOGIC ---
    const tabs = container.querySelectorAll('.tab-btn');
    const sections = {
        'fee-details': container.querySelector('#fee-details-tab'),
        'collect-fees': container.querySelector('#collect-fees-tab'),
        'transactions': container.querySelector('#transactions-tab'),
        'fee-structure': container.querySelector('#fee-structure-tab')
    };

    // State to track currently viewed student
    let currentStudentId = null;

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

            if (tab.dataset.tab === 'fee-structure') loadFeeStructure(container);
            // if (tab.dataset.tab === 'collect-fees') loadFees(container);
            if (tab.dataset.tab === 'fee-details' && typeof currentStudentId !== 'undefined' && currentStudentId) {
                loadStudentFeeDetails(currentStudentId, container);
            }
        });
    });

    // --- FEE DETAILS LOGIC ---
    const detailSearchBtn = container.querySelector('#detail-search-btn');
    const detailSearchInput = container.querySelector('#detail-search-input');
    const detailResults = container.querySelector('#detail-search-results');
    const profileSection = container.querySelector('#student-fee-profile');

    detailSearchBtn.addEventListener('click', async () => {
        const query = detailSearchInput.value.trim();
        if (!query) return;

        detailResults.style.display = 'block';
        detailResults.innerHTML = '<p>Searching...</p>';
        currentStudentId = null;

        const { data, error } = await window.supabaseClient
            .from('students')
            .select('*')
            .or(`full_name.ilike.%${query}%,student_code.ilike.%${query}%`)
            .limit(5);

        if (error || !data.length) {
            detailResults.innerHTML = '<p>No students found.</p>';
            return;
        }

        detailResults.innerHTML = data.map(s => `
            <div class="result-item" data-id="${s.id}" style="padding: 0.5rem; border-bottom: 1px solid rgba(255,255,255,0.1); cursor: pointer; transition: background 0.2s;">
                <strong>${s.full_name}</strong> (${s.student_code})
            </div>
        `).join('');

        // Attach Click to Results
        container.querySelectorAll('.result-item').forEach(item => {
            item.addEventListener('click', async () => {
                const studentId = item.dataset.id;
                currentStudentId = studentId; // Track selected student
                detailResults.style.display = 'none'; // Hide results
                detailSearchInput.value = ''; // Clear search
                await loadStudentFeeDetails(studentId, container);
            });

            item.addEventListener('mouseover', () => item.style.background = 'rgba(255,255,255,0.05)');
            item.addEventListener('mouseout', () => item.style.background = 'transparent');
        });
    });

    // --- COLLECT FEES LOGIC ---
    // Set Default Date
    const dateInput = container.querySelector('#paid-date-input');
    if (dateInput) dateInput.valueAsDate = new Date();

    // Check Student & Calculate Due
    const checkBtn = container.querySelector('#check-student-btn');
    checkBtn.addEventListener('click', async () => {
        const codeInput = container.querySelector('#search-code');
        const nameDisplay = container.querySelector('#student-name-display');
        const idInput = container.querySelector('#real-student-id');
        const amountInput = container.querySelector('#fee-amount');
        const currentDueDisplay = container.querySelector('#current-due-display');

        const code = codeInput.value.trim();

        if (!code) return;
        nameDisplay.innerText = "Searching...";

        // 1. Find Student
        const { data: student, error } = await window.supabaseClient
            .from('students')
            .select('id, full_name, class_grade, student_code')
            .eq('student_code', code)
            .single();

        if (error || !student) {
            nameDisplay.innerHTML = "<span style='color: var(--danger)'>Student not found</span>";
            idInput.value = "";
            return;
        }

        nameDisplay.innerHTML = `<i class="fa-solid fa-check"></i> ${student.full_name} (Grade ${student.class_grade})`;
        idInput.value = student.id;

        // 2. Fetch Fee for Grade (Total)
        const { data: feeData } = await window.supabaseClient
            .from('fee_structure')
            .select('amount')
            .eq('class_grade', student.class_grade)
            .single();

        const totalExpected = feeData ? Number(feeData.amount) : 0;

        // 3. Fetch Already Paid
        const { data: paidFees } = await window.supabaseClient
            .from('fees')
            .select('amount')
            .eq('student_id', student.id)
            .eq('status', 'paid');

        const totalPaid = paidFees ? paidFees.reduce((sum, f) => sum + Number(f.amount), 0) : 0;
        const currentDue = totalExpected - totalPaid;

        // 4. Update UI
        currentDueDisplay.value = currentDue > 0 ? currentDue : 0;
        amountInput.value = ""; // User enters what they pay
    });

    // Show/Refresh Recent Transactions
    container.querySelector('#show-recent-fees-btn').addEventListener('click', () => loadFees(container));

    // Submit Fee Record
    const form = container.querySelector('#fee-form');
    form.addEventListener('submit', async (e) => {
        e.preventDefault();
        const formData = new FormData(form);
        const studentId = formData.get('studentId');

        if (!studentId) {
            alert("Please validate student ID first.");
            return;
        }

        // Get Snapshot values
        const currentDue = parseFloat(container.querySelector('#current-due-display').value) || 0;
        const paidAmount = parseFloat(formData.get('amount'));

        const data = {
            student_id: studentId,
            description: formData.get('description'),
            amount: paidAmount,
            status: 'paid', // Always paid in this form
            paid_at: new Date(formData.get('paidDate')).toISOString(),
            payment_mode: formData.get('paymentMode'),
            paid_to: formData.get('paidTo'),
            balance_before: currentDue,
            balance_after: currentDue - paidAmount // Simply snapshot
        };

        const btn = form.querySelector('button[type="submit"]');
        const oldText = btn.innerText;
        btn.innerText = 'Creating...';
        btn.disabled = true;

        try {
            const { error } = await window.supabaseClient.from('fees').insert([data]);
            if (error) throw error;

            document.getElementById('msg-area').innerHTML = `<div style="color: var(--success); margin-top: 1rem;">Fee collected successfully!</div>`;
            form.reset();
            // Reset Date
            container.querySelector('#paid-date-input').valueAsDate = new Date();
            container.querySelector('#student-name-display').innerText = "";
            container.querySelector('#current-due-display').value = "";

            // Reload list
            loadFees(container);
        } catch (err) {
            document.getElementById('msg-area').innerHTML = `<div style="color: var(--danger); margin-top: 1rem;">Error: ${err.message}</div>`;
        } finally {
            btn.innerText = oldText;
            btn.disabled = false;
        }
    });

    // --- TRANSACTIONS LOGIC ---
    container.querySelector('#trans-apply-filters').addEventListener('click', () => {
        const filters = {
            search: container.querySelector('#trans-search-query').value.trim(),
            dateFrom: container.querySelector('#trans-date-from').value,
            dateTo: container.querySelector('#trans-date-to').value,
            mode: container.querySelector('#trans-filter-mode').value
        };
        loadTransactions(container, filters);
    });

    // --- FEE STRUCTURE LOGIC ---
    container.querySelector('#refresh-structure').addEventListener('click', () => loadFeeStructure(container));
}

// Function to load and display specific student fee details
async function loadStudentFeeDetails(studentId, container) {
    const profileSection = container.querySelector('#student-fee-profile');

    // 1. Fetch Student Info
    const { data: student } = await window.supabaseClient
        .from('students')
        .select('*')
        .eq('id', studentId)
        .single();

    // 2. Fetch Fee Structure for Grade (Total Expected Fee)
    const { data: feeStructure } = await window.supabaseClient
        .from('fee_structure')
        .select('amount')
        .eq('class_grade', student.class_grade)
        .single();

    const totalExpected = feeStructure ? Number(feeStructure.amount) : 0;

    // 3. Fetch Fee Records (Payment History)
    const { data: fees } = await window.supabaseClient
        .from('fees')
        .select('*')
        .eq('student_id', studentId)
        .order('created_at', { ascending: false });

    // 4. Calculate Stats
    let paid = 0;

    if (fees) {
        fees.forEach(f => {
            if (f.status === 'paid') paid += Number(f.amount);
        });
    }

    const due = totalExpected - paid;

    // 5. Update UI
    container.querySelector('#prof-name').innerText = student.full_name;
    container.querySelector('#prof-id').innerText = student.student_code;
    container.querySelector('#prof-grade').innerText = 'Grade ' + student.class_grade;
    container.querySelector('#prof-father').innerText = student.father_name || 'N/A';
    container.querySelector('#prof-phone').innerText = student.father_contact || 'N/A';

    container.querySelector('#stat-total').innerText = '₹' + totalExpected;
    container.querySelector('#stat-paid').innerText = '₹' + paid;
    container.querySelector('#stat-due').innerText = '₹' + (due > 0 ? due : 0);

    const tbody = container.querySelector('#prof-history-body');
    if (!fees || !fees.length) {
        tbody.innerHTML = '<tr><td colspan="4" style="padding:1rem; text-align:center;">No records found.</td></tr>';
    } else {
        tbody.innerHTML = fees.map(f => `
            <tr style="border-bottom: 1px solid rgba(255,255,255,0.05);">
                <td style="padding: 1rem;">${new Date(f.created_at).toLocaleDateString()}</td>
                <td style="padding: 1rem;">${f.description}</td>
                <td style="padding: 1rem;">₹${f.amount}</td>
                <td style="padding: 1rem;">
                    <span style="color: ${f.status === 'paid' ? 'var(--success)' : 'var(--warning)'}; font-weight: bold;">
                        ${f.status ? f.status.toUpperCase() : 'N/A'}
                    </span>
                </td>
            </tr>
        `).join('');
    }

    profileSection.style.display = 'block';
}

async function loadFeeStructure(container) {
    const list = container.querySelector('#structure-list');
    list.innerHTML = '<p>Loading...</p>';

    const { data, error } = await window.supabaseClient
        .from('fee_structure')
        .select('*')
        .order('class_grade', { ascending: true });

    if (error) {
        list.innerHTML = `<p style="color: var(--danger)">Error loading structure</p>`;
        return;
    }

    // Sort numerically 
    data.sort((a, b) => parseInt(a.class_grade) - parseInt(b.class_grade));

    list.innerHTML = data.map(item => `
        <div style="background: rgba(0,0,0,0.2); padding: 1rem; border-radius: 0.5rem; text-align: center; border: 1px solid rgba(255,255,255,0.05);">
            <h4 style="color: var(--text-secondary); margin-bottom: 0.5rem;">Grade ${item.class_grade}</h4>
            <div style="display: flex; gap: 0.5rem; justify-content: center; align-items: center;">
                <span style="font-size: 1.2rem; font-weight: bold; color: var(--success);">₹</span>
                <input type="number" 
                    value="${item.amount}" 
                    class="grade-fee-input" 
                    data-id="${item.id}"
                    style="width: 80px; background: transparent; border: none; border-bottom: 1px solid var(--text-secondary); color: white; font-size: 1.2rem; text-align: center; font-weight: bold;"
                >
            </div>
            <button class="save-fee-btn btn-primary" data-id="${item.id}" style="margin-top: 0.75rem; padding: 0.25rem 0.75rem; font-size: 0.8rem; width: 100%;">Save</button>
        </div>
    `).join('');

    container.querySelectorAll('.save-fee-btn').forEach(btn => {
        btn.addEventListener('click', async (e) => {
            const id = e.target.dataset.id;
            const input = e.target.previousElementSibling.querySelector('input');
            const newAmount = input.value;

            e.target.innerText = '...';

            const { error } = await window.supabaseClient
                .from('fee_structure')
                .update({ amount: newAmount })
                .eq('id', id);

            if (!error) {
                e.target.innerText = 'Saved';
                setTimeout(() => e.target.innerText = 'Save', 2000);
            } else {
                e.target.innerText = 'Error';
            }
        });
    });
}

// Re-using the same template as loadFees but with filters support
async function loadTransactions(container, filters = {}) {
    const listContainer = container.querySelector('#transactions-results-list');
    listContainer.innerHTML = '<p>Loading...</p>';

    try {
        let query = window.supabaseClient
            .from('fees')
            .select(`
                *,
                students!inner(full_name, student_code, class_grade)
            `)
            .order('paid_at', { ascending: false });

        // Apply Filters
        if (filters.dateFrom) query = query.gte('paid_at', filters.dateFrom);
        if (filters.dateTo) query = query.lte('paid_at', filters.dateTo + 'T23:59:59'); // End of day
        if (filters.mode) query = query.eq('payment_mode', filters.mode);

        let data = [];
        const { data: results, error } = await query;

        if (error) throw error;

        data = results;

        if (filters.search) {
            const q = filters.search.toLowerCase();
            data = data.filter(f =>
                (f.paid_to && f.paid_to.toLowerCase().includes(q)) ||
                (f.students && (
                    f.students.full_name.toLowerCase().includes(q) ||
                    f.students.student_code.toLowerCase().includes(q)
                ))
            );
        }

        if (!data || data.length === 0) {
            listContainer.innerHTML = `<p style="color: var(--text-secondary);">No matching records found.</p>`;
            return;
        }

        renderTransactionList(listContainer, data);

    } catch (err) {
        console.error(err);
        listContainer.innerHTML = `<p style="color: var(--danger);">Failed to load: ${err.message}</p>`;
    }
}

async function loadFees(container) {
    const listContainer = container.querySelector('#fees-list');
    try {
        const { data, error } = await window.supabaseClient
            .from('fees')
            .select(`
                *,
                students (student_code, full_name, class_grade)
            `)
            .order('created_at', { ascending: false })
            .limit(10);

        if (error) {
            console.error('Fees Load Error:', error);
            listContainer.innerHTML = `<p style="color: var(--danger);">Error loading: ${error.message}</p>`;
            return;
        }

        if (!data || data.length === 0) {
            listContainer.innerHTML = `<p style="color: var(--text-secondary);">No fee records found.</p>`;
            return;
        }

        renderTransactionList(listContainer, data);

    } catch (err) {
        console.error(err);
        listContainer.innerHTML = `<p style="color: var(--danger);">Failed to load list: ${err.message}</p>`;
    }
}

function renderTransactionList(container, data) {
    container.innerHTML = data.map((fee) => {
        const student = fee.students || {};
        const dateStr = new Date(fee.paid_at || fee.created_at).toLocaleDateString();

        return `
        <div class="transaction-item" style="background: rgba(255,255,255,0.05); border-radius: 0.5rem; margin-bottom: 0.5rem; overflow: hidden; border: 1px solid transparent; transition: all 0.2s;">
            <!-- Header (Always Visible) -->
            <div class="trans-header" onclick="this.parentElement.classList.toggle('expanded')" style="padding: 1rem; display: flex; justify-content: space-between; align-items: center; cursor: pointer;">
                <div>
                    <h4 style="margin: 0; font-size: 0.95rem;">${fee.description}</h4>
                    <small style="color: var(--text-secondary);">${student.full_name} (${student.student_code})</small>
                </div>
                <div style="text-align: right;">
                    <div style="font-weight: bold; color: var(--success);">- ₹${fee.amount}</div>
                    <small style="font-size: 0.7rem; color: var(--text-secondary);">${dateStr}</small>
                </div>
            </div>

            <!-- Expanded Details (Hidden by default) -->
            <div class="trans-details" style="padding: 0 1rem 1rem 1rem; display: none; border-top: 1px solid rgba(255,255,255,0.05); font-size: 0.9rem; color: var(--text-secondary);">
                <div style="margin-top: 0.5rem; display: grid; grid-template-columns: 1fr 1fr; gap: 0.5rem;">
                    <div>
                        <strong>Student ID:</strong> ${student.student_code}<br>
                        <strong>Name:</strong> ${student.full_name}<br>
                        <strong>Grade:</strong> ${student.class_grade}
                    </div>
                    <div style="text-align: right;">
                        <strong>Date:</strong> ${dateStr}<br>
                        <strong>Paid To:</strong> ${fee.paid_to || 'N/A'}<br>
                        <strong>Mode:</strong> ${fee.payment_mode || 'N/A'}
                    </div>
                </div>
                
                <hr style="border: 0; border-top: 1px dashed rgba(255,255,255,0.1); margin: 0.5rem 0;">

                <div style="display: flex; justify-content: space-between;">
                    <span>Due Before:</span>
                    <span>₹${fee.balance_before !== null ? fee.balance_before : '-'}</span>
                </div>
                <div style="display: flex; justify-content: space-between; font-weight: bold; color: var(--text-primary); margin: 0.25rem 0;">
                    <span>Paid Amount:</span>
                    <span>₹${fee.amount}</span>
                </div>
                <div style="display: flex; justify-content: space-between; color: ${fee.balance_after == 0 ? 'var(--success)' : 'var(--warning)'}">
                    <span>Remaining Due:</span>
                    <span>₹${fee.balance_after !== null ? fee.balance_after : '-'}</span>
                </div>

                <div style="margin-top: 1rem; text-align: right;">
                    <button class="btn-primary" onclick="alert('Printing functionality to be implemented for Fee ID: ${fee.id}')" style="padding: 0.25rem 1rem; font-size: 0.8rem;"><i class="fa-solid fa-print"></i> Print Receipt</button>
                </div>
            </div>
        </div>
        <style>
            .transaction-item.expanded { background: rgba(255,255,255,0.1) !important; border-color: var(--accent-color) !important; }
            .transaction-item.expanded .trans-details { display: block !important; }
        </style>
        `;
    }).join('');
}
