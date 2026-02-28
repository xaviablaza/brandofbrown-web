// Form validation and submission
class FormManager {
  constructor(formId) {
    this.form = document.getElementById(formId);
    if (!this.form) return;
    
    this.errorElement = document.getElementById('formError');
    this.successElement = document.getElementById('formSuccess');
    
    this.init();
  }

  init() {
    this.form.addEventListener('submit', (e) => this.handleSubmit(e));
    
    // Real-time validation
    const inputs = this.form.querySelectorAll('input, textarea');
    inputs.forEach(input => {
      input.addEventListener('blur', () => this.validateField(input));
      input.addEventListener('input', () => this.clearFieldError(input));
    });
  }

  async handleSubmit(e) {
    e.preventDefault();
    
    // Clear previous messages
    this.clearMessages();
    
    // Validate all fields
    if (!this.validateForm()) {
      return;
    }
    
    // Get form data
    const formData = new FormData(this.form);
    const data = {};
    formData.forEach((value, key) => {
      data[key] = value;
    });
    
    // In a real application, you would send this to a server
    // For now, we'll just simulate a successful submission
    try {
      // Simulate API call
      await this.simulateSubmission(data);
      
      // Show success message
      this.showSuccess('Thank you! Your message has been sent successfully. We will get back to you soon.');
      
      // Reset form
      this.form.reset();
      
    } catch (error) {
      this.showError('Sorry, there was an error sending your message. Please try again or contact us directly.');
    }
  }

  validateForm() {
    let isValid = true;
    const inputs = this.form.querySelectorAll('input[required], textarea[required]');
    
    inputs.forEach(input => {
      if (!this.validateField(input)) {
        isValid = false;
      }
    });
    
    return isValid;
  }

  validateField(field) {
    const value = field.value.trim();
    const type = field.type;
    const name = field.name;
    
    // Required field validation
    if (field.hasAttribute('required') && !value) {
      this.setFieldError(field, 'This field is required');
      return false;
    }
    
    // Email validation
    if (type === 'email' && value) {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(value)) {
        this.setFieldError(field, 'Please enter a valid email address');
        return false;
      }
    }
    
    // Name validation (no numbers)
    if ((name === 'firstName' || name === 'lastName') && value) {
      const nameRegex = /^[a-zA-Z\s]+$/;
      if (!nameRegex.test(value)) {
        this.setFieldError(field, 'Name should only contain letters');
        return false;
      }
    }
    
    // Message minimum length
    if (field.tagName === 'TEXTAREA' && value && value.length < 10) {
      this.setFieldError(field, 'Message should be at least 10 characters');
      return false;
    }
    
    this.clearFieldError(field);
    return true;
  }

  setFieldError(field, message) {
    field.classList.add('form__input--error');
    
    // Find or create error message element
    let errorMsg = field.parentElement.querySelector('.form__field-error');
    if (!errorMsg) {
      errorMsg = document.createElement('span');
      errorMsg.className = 'form__field-error form__error';
      field.parentElement.appendChild(errorMsg);
    }
    errorMsg.textContent = message;
  }

  clearFieldError(field) {
    field.classList.remove('form__input--error');
    const errorMsg = field.parentElement.querySelector('.form__field-error');
    if (errorMsg) {
      errorMsg.remove();
    }
  }

  showError(message) {
    if (this.errorElement) {
      this.errorElement.textContent = message;
      this.errorElement.style.display = 'block';
    }
  }

  showSuccess(message) {
    if (this.successElement) {
      this.successElement.textContent = message;
      this.successElement.style.display = 'block';
    }
  }

  clearMessages() {
    if (this.errorElement) {
      this.errorElement.textContent = '';
      this.errorElement.style.display = 'none';
    }
    if (this.successElement) {
      this.successElement.textContent = '';
      this.successElement.style.display = 'none';
    }
  }

  simulateSubmission(data) {
    return new Promise((resolve) => {
      // Simulate network delay
      setTimeout(() => {
        console.log('Form submitted with data:', data);
        resolve();
      }, 1000);
    });
  }
}

// Initialize form manager when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
  new FormManager('contactForm');
});
