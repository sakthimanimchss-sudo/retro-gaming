// ============================================
// Contact Page - Form Handling & FAQ Accordion
// ============================================

// Contact Form Submission
const contactForm = document.getElementById('contactForm');

if (contactForm) {
    contactForm.addEventListener('submit', (e) => {
        e.preventDefault();
        
        // Get form data
        const name = document.getElementById('name').value;
        const email = document.getElementById('email').value;
        const phone = document.getElementById('phone').value;
        const subject = document.getElementById('subject').value;
        const message = document.getElementById('message').value;
        
        // Simple validation
        if (!name || !email || !subject || !message) {
            showToast('Please fill in all required fields', 'error');
            return;
        }
        
        // Email validation
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(email)) {
            showToast('Please enter a valid email address', 'error');
            return;
        }
        
        // Simulate form submission
        const submitBtn = contactForm.querySelector('.submit-btn');
        const originalText = submitBtn.textContent;
        submitBtn.textContent = 'Sending...';
        submitBtn.disabled = true;
        
        // Simulate API call
        setTimeout(() => {
            // Show success message
            const formWrapper = document.querySelector('.contact-form-wrapper');
            const originalContent = formWrapper.innerHTML;
            
            formWrapper.innerHTML = `
                <div class="success-message">
                    <svg width="64" height="64" viewBox="0 0 24 24" fill="none" stroke="var(--success)" stroke-width="1.5">
                        <path d="M20 6L9 17l-5-5"/>
                        <circle cx="12" cy="12" r="10"/>
                    </svg>
                    <h3>Message Sent Successfully!</h3>
                    <p>Thank you for reaching out, ${name}. We'll get back to you within 24 hours.</p>
                    <button class="btn-primary" onclick="location.reload()">Send Another Message</button>
                </div>
            `;
            
            // Store in localStorage (optional)
            const messages = JSON.parse(localStorage.getItem('contactMessages') || '[]');
            messages.push({
                id: Date.now(),
                name,
                email,
                phone,
                subject,
                message,
                date: new Date().toISOString()
            });
            localStorage.setItem('contactMessages', JSON.stringify(messages));
            
            showToast('Message sent successfully!', 'success');
        }, 1500);
    });
}

// FAQ Accordion
const faqItems = document.querySelectorAll('.faq-item');

if (faqItems.length) {
    faqItems.forEach(item => {
        const question = item.querySelector('.faq-question');
        
        question.addEventListener('click', () => {
            // Close other items
            faqItems.forEach(otherItem => {
                if (otherItem !== item && otherItem.classList.contains('active')) {
                    otherItem.classList.remove('active');
                }
            });
            
            // Toggle current item
            item.classList.toggle('active');
        });
    });
}

// Phone Number Formatting
const phoneInput = document.getElementById('phone');
if (phoneInput) {
    phoneInput.addEventListener('input', (e) => {
        let value = e.target.value.replace(/\D/g, '');
        if (value.length > 10) value = value.slice(0, 10);
        
        if (value.length >= 6) {
            value = `(${value.slice(0, 3)}) ${value.slice(3, 6)}-${value.slice(6)}`;
        } else if (value.length >= 3) {
            value = `(${value.slice(0, 3)}) ${value.slice(3)}`;
        }
        
        e.target.value = value;
    });
}

// Auto-resize textarea
const messageTextarea = document.getElementById('message');
if (messageTextarea) {
    messageTextarea.addEventListener('input', () => {
        messageTextarea.style.height = 'auto';
        messageTextarea.style.height = Math.min(messageTextarea.scrollHeight, 200) + 'px';
    });
}