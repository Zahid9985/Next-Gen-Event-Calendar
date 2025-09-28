// Next Gen AI Calendar - Interactive JavaScript
class NextGenCalendar {
    constructor() {
        this.currentPage = 'landing';
        this.months = [
            'January', 'February', 'March', 'April', 'May', 'June',
            'July', 'August', 'September', 'October', 'November', 'December'
        ];
        this.currentMonthIndex = new Date().getMonth();
        this.searchData = {};
        this.events = [];
        
        this.init();
    }

    init() {
        this.setupEventListeners();
        this.initializeMonthSelector();
        this.loadStoredEvents();
        this.updateUI();
    }

    setupEventListeners() {
        // Landing page events
        document.getElementById('apply-btn').addEventListener('click', () => this.handleApply());
        document.getElementById('month-up').addEventListener('click', () => this.changeMonth(1));
        document.getElementById('month-down').addEventListener('click', () => this.changeMonth(-1));
        
        // Results page events
        document.getElementById('back-to-search').addEventListener('click', () => this.navigateToPage('landing'));
        document.querySelectorAll('.btn-details').forEach(btn => {
            btn.addEventListener('click', (e) => this.handleDetailsClick(e));
        });
        
        // Details page events
        document.getElementById('back-to-results').addEventListener('click', () => this.navigateToPage('results'));
        document.getElementById('add-event').addEventListener('click', () => this.handleAddEvent());
        document.getElementById('modal-ok').addEventListener('click', () => this.closeModal());
        
        // Form validation
        this.setupFormValidation();
        
        // Keyboard navigation
        document.addEventListener('keydown', (e) => this.handleKeyboardNavigation(e));
    }

    setupFormValidation() {
        const inputs = document.querySelectorAll('input[type="text"], input[type="url"], input[type="number"]');
        inputs.forEach(input => {
            input.addEventListener('blur', () => this.validateInput(input));
            input.addEventListener('input', () => this.clearInputError(input));
        });
    }

    validateInput(input) {
        const value = input.value.trim();
        const type = input.type;
        const id = input.id;
        
        // Remove existing error styling
        this.clearInputError(input);
        
        let isValid = true;
        let errorMessage = '';
        
        if (type === 'text' || type === 'url') {
            if (!value) {
                isValid = false;
                errorMessage = 'This field is required';
            } else if (type === 'url' && !this.isValidURL(value)) {
                isValid = false;
                errorMessage = 'Please enter a valid URL';
            }
        } else if (type === 'number') {
            const num = parseInt(value);
            if (!value) {
                isValid = false;
                errorMessage = 'This field is required';
            } else if (id === 'day' && (num < 1 || num > 31)) {
                isValid = false;
                errorMessage = 'Day must be between 1 and 31';
            } else if (id === 'month' && (num < 1 || num > 12)) {
                isValid = false;
                errorMessage = 'Month must be between 1 and 12';
            } else if (id === 'year' && (num < 2024 || num > 2030)) {
                isValid = false;
                errorMessage = 'Year must be between 2024 and 2030';
            } else if (id === 'hours' && (num < 0 || num > 23)) {
                isValid = false;
                errorMessage = 'Hours must be between 0 and 23';
            } else if (id === 'minutes' && (num < 0 || num > 59)) {
                isValid = false;
                errorMessage = 'Minutes must be between 0 and 59';
            }
        }
        
        if (!isValid) {
            this.showInputError(input, errorMessage);
        }
        
        return isValid;
    }

    isValidURL(string) {
        try {
            new URL(string);
            return true;
        } catch (_) {
            return false;
        }
    }

    showInputError(input, message) {
        input.style.borderColor = '#e53e3e';
        input.style.boxShadow = '0 0 0 3px rgba(229, 62, 62, 0.1)';
        
        // Create or update error message
        let errorElement = input.parentNode.querySelector('.error-message');
        if (!errorElement) {
            errorElement = document.createElement('div');
            errorElement.className = 'error-message';
            errorElement.style.color = '#e53e3e';
            errorElement.style.fontSize = '0.875rem';
            errorElement.style.marginTop = '5px';
            input.parentNode.appendChild(errorElement);
        }
        errorElement.textContent = message;
    }

    clearInputError(input) {
        input.style.borderColor = '';
        input.style.boxShadow = '';
        const errorElement = input.parentNode.querySelector('.error-message');
        if (errorElement) {
            errorElement.remove();
        }
    }

    initializeMonthSelector() {
        const monthInput = document.getElementById('month-select');
        monthInput.value = this.months[this.currentMonthIndex];
    }

    changeMonth(direction) {
        this.currentMonthIndex += direction;
        
        if (this.currentMonthIndex < 0) {
            this.currentMonthIndex = 11;
        } else if (this.currentMonthIndex > 11) {
            this.currentMonthIndex = 0;
        }
        
        document.getElementById('month-select').value = this.months[this.currentMonthIndex];
        
        // Add visual feedback
        const spinnerBtn = direction > 0 ? document.getElementById('month-up') : document.getElementById('month-down');
        spinnerBtn.style.transform = 'scale(0.95)';
        setTimeout(() => {
            spinnerBtn.style.transform = '';
        }, 150);
    }

    handleApply() {
        const jobDescription = document.getElementById('job-description').value.trim();
        const month = document.getElementById('month-select').value;
        
        // Validate inputs
        if (!jobDescription) {
            this.showInputError(document.getElementById('job-description'), 'Please enter a job description');
            return;
        }
        
        // Store search data
        this.searchData = {
            jobDescription,
            month,
            timestamp: new Date().toISOString()
        };
        
        // Show loading
        this.showLoading();
        
        // Simulate API call
        setTimeout(() => {
            this.generateResults();
            this.hideLoading();
            this.navigateToPage('results');
        }, 1500);
    }

    generateResults() {
        const results = [
            {
                date: '2024-08-01',
                description: 'Senior Developer Interview - Technical Assessment',
                title: 'Technical Interview',
                link: 'https://meet.google.com/abc-defg-hij',
                time: '14:00'
            },
            {
                date: '2024-08-02',
                description: 'Product Manager Role - Final Round Interview',
                title: 'Final Interview',
                link: 'https://zoom.us/j/123456789',
                time: '10:30'
            },
            {
                date: '2024-09-01',
                description: 'UX Designer Position - Portfolio Review',
                title: 'Portfolio Review',
                link: 'https://teams.microsoft.com/l/meetup',
                time: '16:00'
            }
        ];
        
        // Update result descriptions
        const resultItems = document.querySelectorAll('.result-item');
        resultItems.forEach((item, index) => {
            if (results[index]) {
                const descriptionInput = item.querySelector('.result-description');
                descriptionInput.value = results[index].description;
                item.dataset.eventData = JSON.stringify(results[index]);
            }
        });
    }

    handleDetailsClick(event) {
        const button = event.currentTarget;
        const resultItem = button.closest('.result-item');
        const eventData = JSON.parse(resultItem.dataset.eventData || '{}');
        
        // Populate details form
        this.populateDetailsForm(eventData);
        this.navigateToPage('details');
    }

    populateDetailsForm(eventData) {
        if (eventData.date) {
            const date = new Date(eventData.date);
            document.getElementById('day').value = date.getDate();
            document.getElementById('month').value = date.getMonth() + 1;
            document.getElementById('year').value = date.getFullYear();
        }
        
        if (eventData.time) {
            const [hours, minutes] = eventData.time.split(':');
            document.getElementById('hours').value = hours;
            document.getElementById('minutes').value = minutes;
        }
        
        if (eventData.title) {
            document.getElementById('event-title').value = eventData.title;
        }
        
        if (eventData.link) {
            document.getElementById('event-link').value = eventData.link;
        }
    }

    handleAddEvent() {
        // Add visual feedback to + button
        const addButton = document.getElementById('add-event');
        addButton.style.transform = 'scale(0.9)';
        addButton.style.background = 'linear-gradient(135deg, #48bb78, #38a169)';
        
        setTimeout(() => {
            addButton.style.transform = '';
            addButton.style.background = '';
        }, 200);
        
        // Validate all form fields
        const title = document.getElementById('event-title');
        const link = document.getElementById('event-link');
        const day = document.getElementById('day');
        const month = document.getElementById('month');
        const year = document.getElementById('year');
        const hours = document.getElementById('hours');
        const minutes = document.getElementById('minutes');
        
        const fields = [title, link, day, month, year, hours, minutes];
        let isValid = true;
        
        fields.forEach(field => {
            if (!this.validateInput(field)) {
                isValid = false;
            }
        });
        
        if (!isValid) {
            return;
        }
        
        // Create event object
        const event = {
            id: Date.now(),
            title: title.value.trim(),
            link: link.value.trim(),
            date: `${year.value}-${month.value.padStart(2, '0')}-${day.value.padStart(2, '0')}`,
            time: `${hours.value.padStart(2, '0')}:${minutes.value.padStart(2, '0')}`,
            createdAt: new Date().toISOString()
        };
        
        // Add to events array
        this.events.push(event);
        this.saveEvents();
        
        // Add to local calendar (multiple formats)
        this.addToLocalCalendar(event);
        
        // Show success modal with calendar options
        this.showSuccessModal(event);
        
        // Clear form
        this.clearDetailsForm();
    }

    clearDetailsForm() {
        document.getElementById('event-title').value = '';
        document.getElementById('event-link').value = '';
        document.getElementById('day').value = '';
        document.getElementById('month').value = '';
        document.getElementById('year').value = '';
        document.getElementById('hours').value = '';
        document.getElementById('minutes').value = '';
    }

    addToLocalCalendar(event) {
        // Create calendar event in multiple formats
        const eventDate = new Date(event.date + 'T' + event.time + ':00');
        const endDate = new Date(eventDate.getTime() + (60 * 60 * 1000)); // 1 hour duration
        
        // Format dates for different calendar systems
        const startDateISO = eventDate.toISOString().replace(/[-:]/g, '').split('.')[0] + 'Z';
        const endDateISO = endDate.toISOString().replace(/[-:]/g, '').split('.')[0] + 'Z';
        
        // Create ICS (iCalendar) format
        const icsContent = this.generateICSContent(event, eventDate, endDate);
        
        // Create Google Calendar URL
        const googleCalendarUrl = this.generateGoogleCalendarUrl(event, eventDate, endDate);
        
        // Create Outlook Calendar URL
        const outlookCalendarUrl = this.generateOutlookCalendarUrl(event, eventDate, endDate);
        
        // Store calendar URLs for modal
        this.calendarUrls = {
            ics: icsContent,
            google: googleCalendarUrl,
            outlook: outlookCalendarUrl
        };
        
        // Auto-download ICS file
        this.downloadICSFile(icsContent, event.title);
    }

    generateICSContent(event, startDate, endDate) {
        const formatDate = (date) => {
            return date.toISOString().replace(/[-:]/g, '').split('.')[0] + 'Z';
        };
        
        const uid = `event-${event.id}@nextgencalendar.com`;
        const now = new Date();
        
        return [
            'BEGIN:VCALENDAR',
            'VERSION:2.0',
            'PRODID:-//Next Gen Calendar//EN',
            'CALSCALE:GREGORIAN',
            'METHOD:PUBLISH',
            'BEGIN:VEVENT',
            `UID:${uid}`,
            `DTSTART:${formatDate(startDate)}`,
            `DTEND:${formatDate(endDate)}`,
            `DTSTAMP:${formatDate(now)}`,
            `SUMMARY:${event.title}`,
            `DESCRIPTION:${event.link ? `Link: ${event.link}` : 'Calendar event'}`,
            `LOCATION:${event.link || 'Online'}`,
            'STATUS:CONFIRMED',
            'TRANSP:OPAQUE',
            'END:VEVENT',
            'END:VCALENDAR'
        ].join('\r\n');
    }

    generateGoogleCalendarUrl(event, startDate, endDate) {
        const params = new URLSearchParams({
            action: 'TEMPLATE',
            text: event.title,
            dates: `${this.formatDateForGoogle(startDate)}/${this.formatDateForGoogle(endDate)}`,
            details: event.link ? `Link: ${event.link}` : 'Calendar event',
            location: event.link || 'Online'
        });
        
        return `https://calendar.google.com/calendar/render?${params.toString()}`;
    }

    generateOutlookCalendarUrl(event, startDate, endDate) {
        const params = new URLSearchParams({
            path: '/calendar/action/compose',
            rru: 'addevent',
            subject: event.title,
            startdt: startDate.toISOString(),
            enddt: endDate.toISOString(),
            body: event.link ? `Link: ${event.link}` : 'Calendar event',
            location: event.link || 'Online'
        });
        
        return `https://outlook.live.com/calendar/0/deeplink/compose?${params.toString()}`;
    }

    formatDateForGoogle(date) {
        return date.toISOString().replace(/[-:]/g, '').split('.')[0] + 'Z';
    }

    downloadICSFile(content, filename) {
        const blob = new Blob([content], { type: 'text/calendar;charset=utf-8' });
        const url = URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = url;
        link.download = `${filename.replace(/[^a-z0-9]/gi, '_').toLowerCase()}.ics`;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        URL.revokeObjectURL(url);
    }

    showSuccessModal(event) {
        const modal = document.getElementById('success-modal');
        const modalBody = modal.querySelector('.modal-body');
        
        // Update modal content with calendar options
        modalBody.innerHTML = `
            <p>Event "${event.title}" has been added successfully!</p>
            <div class="calendar-options">
                <h4>Add to your calendar:</h4>
                <div class="calendar-buttons">
                    <button type="button" class="btn-calendar" id="add-google-calendar">
                        <i class="fab fa-google"></i>
                        <span>Google Calendar</span>
                    </button>
                    <button type="button" class="btn-calendar" id="add-outlook-calendar">
                        <i class="fab fa-microsoft"></i>
                        <span>Outlook</span>
                    </button>
                    <button type="button" class="btn-calendar" id="download-ics">
                        <i class="fas fa-download"></i>
                        <span>Download .ics</span>
                    </button>
                </div>
            </div>
        `;
        
        // Add event listeners for calendar buttons
        document.getElementById('add-google-calendar').addEventListener('click', () => {
            window.open(this.calendarUrls.google, '_blank');
        });
        
        document.getElementById('add-outlook-calendar').addEventListener('click', () => {
            window.open(this.calendarUrls.outlook, '_blank');
        });
        
        document.getElementById('download-ics').addEventListener('click', () => {
            this.downloadICSFile(this.calendarUrls.ics, event.title);
        });
        
        modal.classList.add('active');
    }

    closeModal() {
        document.getElementById('success-modal').classList.remove('active');
        this.navigateToPage('landing');
    }

    showLoading() {
        document.getElementById('loading-overlay').classList.add('active');
    }

    hideLoading() {
        document.getElementById('loading-overlay').classList.remove('active');
    }

    navigateToPage(pageName) {
        // Hide all pages
        document.querySelectorAll('.page').forEach(page => {
            page.classList.remove('active');
        });
        
        // Show target page
        document.getElementById(`${pageName}-page`).classList.add('active');
        this.currentPage = pageName;
        
        // Update page title in browser
        const titles = {
            landing: 'Search Calendar Events',
            results: 'Search Results',
            details: 'Advanced Details'
        };
        document.title = `${titles[pageName]} - Next Gen AI Calendar`;
        
        // Scroll to top
        window.scrollTo({ top: 0, behavior: 'smooth' });
    }

    handleKeyboardNavigation(event) {
        // ESC key to go back
        if (event.key === 'Escape') {
            if (this.currentPage === 'results') {
                this.navigateToPage('landing');
            } else if (this.currentPage === 'details') {
                this.navigateToPage('results');
            }
        }
        
        // Enter key to submit forms
        if (event.key === 'Enter') {
            if (this.currentPage === 'landing') {
                this.handleApply();
            } else if (this.currentPage === 'details') {
                this.handleAddEvent();
            }
        }
    }

    saveEvents() {
        localStorage.setItem('nextGenCalendarEvents', JSON.stringify(this.events));
    }

    loadStoredEvents() {
        const stored = localStorage.getItem('nextGenCalendarEvents');
        if (stored) {
            this.events = JSON.parse(stored);
        }
    }

    updateUI() {
        // Add any dynamic UI updates here
        this.updateAccessibility();
    }

    updateAccessibility() {
        // Add ARIA labels and improve accessibility
        const pages = document.querySelectorAll('.page');
        pages.forEach((page, index) => {
            page.setAttribute('role', 'main');
            page.setAttribute('aria-label', `Page ${index + 1}`);
        });
        
        // Add focus management
        const focusableElements = document.querySelectorAll('button, input, select, textarea');
        focusableElements.forEach(element => {
            element.addEventListener('focus', () => {
                element.style.outline = '2px solid #667eea';
                element.style.outlineOffset = '2px';
            });
            
            element.addEventListener('blur', () => {
                element.style.outline = '';
                element.style.outlineOffset = '';
            });
        });
    }
}

// Utility functions
function formatDate(dateString) {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
        weekday: 'long',
        year: 'numeric',
        month: 'long',
        day: 'numeric'
    });
}

function formatTime(timeString) {
    const [hours, minutes] = timeString.split(':');
    const hour = parseInt(hours);
    const ampm = hour >= 12 ? 'PM' : 'AM';
    const displayHour = hour % 12 || 12;
    return `${displayHour}:${minutes} ${ampm}`;
}

// Initialize the application when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    const calendar = new NextGenCalendar();
    
    // Add some demo data for testing
    console.log('Next Gen AI Calendar initialized successfully!');
    
    // Add service worker registration for PWA capabilities (optional)
    if ('serviceWorker' in navigator) {
        navigator.serviceWorker.register('/sw.js').catch(err => {
            console.log('Service worker registration failed:', err);
        });
    }
});

// Export for potential module usage
if (typeof module !== 'undefined' && module.exports) {
    module.exports = NextGenCalendar;
}
