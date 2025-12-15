window.Portals = window.Portals || {};

window.Portals.renderStudentRegistration = function (container) {
    container.innerHTML = `
        <div class="welcome-banner">
            <h1>Student Registration</h1>
            <p>Register a new student into the system.</p>
        </div>
        
        <div class="form-card" style="max-width: 800px;">
            <form id="student-reg-form">
                <!-- 0. System Info -->
                <h4 style="color: var(--accent-color); border-bottom: 1px solid rgba(255,255,255,0.1); padding-bottom: 0.5rem; margin-bottom: 1rem;">Admission Info</h4>
                <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 1rem;">
                    <div class="form-group">
                        <label>Admission Number (Auto)</label>
                        <input type="text" id="preview-id" class="form-control" value="Loading..." readonly style="background: rgba(0,0,0,0.2); cursor: not-allowed; color: var(--accent-color); font-weight: bold;">
                    </div>
                    <div class="form-group">
                        <label>Admission Date</label>
                        <input type="date" name="regDate" class="form-control" value="${new Date().toISOString().split('T')[0]}" required>
                    </div>
                </div>

                <!-- 1. Student Details -->
                <h4 style="color: var(--accent-color); border-bottom: 1px solid rgba(255,255,255,0.1); padding-bottom: 0.5rem; margin: 1.5rem 0 1rem;">Student Details</h4>
                <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 1rem;">
                    <div class="form-group">
                        <label>Full Name</label>
                        <input type="text" name="fullName" class="form-control" placeholder="e.g. John Doe" required>
                    </div>
                    <div class="form-group">
                        <label>Date of Birth</label>
                        <input type="date" name="dob" class="form-control" required>
                    </div>
                    <div class="form-group">
                        <label>Gender</label>
                        <select name="gender" class="form-control" required>
                            <option value="">Select Gender</option>
                            <option value="Male">Male</option>
                            <option value="Female">Female</option>
                            <option value="Other">Other</option>
                        </select>
                    </div>
                    <div class="form-group">
                        <label>Class / Grade</label>
                        <select name="classGrade" class="form-control" required>
                            <option value="">Select Class</option>
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
                    <div class="form-group">
                        <label>Personal Contact (Optional)</label>
                        <input type="tel" name="contact" class="form-control" placeholder="+1 234...">
                    </div>
                </div>

                <div class="form-group">
                    <label>Address</label>
                    <textarea name="address" class="form-control" rows="2" placeholder="Street, City, Zip"></textarea>
                </div>

                <!-- 2. Parent Details -->
                <h4 style="color: var(--accent-color); border-bottom: 1px solid rgba(255,255,255,0.1); padding-bottom: 0.5rem; margin: 1.5rem 0 1rem;">Parent Details</h4>
                <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 1rem;">
                    <div class="form-group">
                        <label>Father's Name</label>
                        <input type="text" name="fatherName" class="form-control">
                    </div>
                    <div class="form-group">
                        <label>Father's Contact</label>
                        <input type="tel" name="fatherContact" class="form-control">
                    </div>
                    <div class="form-group">
                        <label>Mother's Name</label>
                        <input type="text" name="motherName" class="form-control">
                    </div>
                    <div class="form-group">
                        <label>Mother's Contact</label>
                        <input type="tel" name="motherContact" class="form-control">
                    </div>
                </div>

                <!-- 3. Additional Info -->
                 <h4 style="color: var(--accent-color); border-bottom: 1px solid rgba(255,255,255,0.1); padding-bottom: 0.5rem; margin: 1.5rem 0 1rem;">Additional Info</h4>
                <div class="form-group">
                    <label>Comments / Medical Notes</label>
                    <textarea name="comments" class="form-control" rows="3" placeholder="Any specific requirements..."></textarea>
                </div>
                
                <button type="submit" class="btn-primary" style="width: 100%; margin-top: 1rem;">Register Student</button>
            </form>
        </div>
        
        <div id="message-area" style="margin-top: 1rem;"></div>
    `;

    // Load Preview ID
    async function loadPreviewId() {
        try {
            const { data, error } = await window.supabaseClient.rpc('preview_next_student_code');
            if (data) {
                const el = container.querySelector('#preview-id');
                if (el) el.value = data;
            }
        } catch (e) { console.error(e); }
    }
    loadPreviewId();

    // Attach Event Listener
    const form = container.querySelector('#student-reg-form');
    form.addEventListener('submit', async (e) => {
        e.preventDefault();
        const formData = new FormData(form);
        const data = {
            full_name: formData.get('fullName'),
            date_of_birth: formData.get('dob'),
            gender: formData.get('gender'),
            class_grade: formData.get('classGrade'),
            contact_number: formData.get('contact'),
            address: formData.get('address'),
            // New Fields
            father_name: formData.get('fatherName'),
            father_contact: formData.get('fatherContact'),
            mother_name: formData.get('motherName'),
            mother_contact: formData.get('motherContact'),
            comments: formData.get('comments'),
            registration_date: formData.get('regDate')
        };

        const btn = form.querySelector('button');
        const originalText = btn.innerText;
        btn.innerText = 'Generating ID & Saving...';
        btn.disabled = true;

        try {
            // Select returning * to get the generated student_code
            const { data: result, error } = await window.supabaseClient
                .from('students')
                .insert([data])
                .select()
                .single();

            if (error) throw error;

            document.getElementById('message-area').innerHTML = `
                <div style="background: rgba(16, 185, 129, 0.1); border: 1px solid var(--success); padding: 1.5rem; border-radius: 0.5rem; text-align: center;">
                    <h3 style="color: var(--success); margin-bottom: 0.5rem;">Registration Successful!</h3>
                    <p>Student ID Generated:</p>
                    <div style="font-size: 2.5rem; font-weight: 800; color: white; margin: 0.5rem 0; letter-spacing: 2px;">
                        ${result.student_code}
                    </div>
                    <p style="font-size: 0.9rem; color: var(--text-secondary);">Please note this ID for future reference.</p>
                </div>`;
            form.reset();
            loadPreviewId(); // Refresh for next student
        } catch (err) {
            document.getElementById('message-area').innerHTML = `<div style="color: var(--danger); padding: 1rem; background: rgba(239, 68, 68, 0.1); border-radius: 0.5rem;">Error: ${err.message}</div>`;
        } finally {
            btn.innerText = originalText;
            btn.disabled = false;
        }
    });

}
