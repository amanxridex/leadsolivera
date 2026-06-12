document.addEventListener('DOMContentLoaded', () => {
    const steps = document.querySelectorAll('.form-step');
    const nextBtns = document.querySelectorAll('.btn-next');
    const prevBtns = document.querySelectorAll('.btn-prev');
    const form = document.getElementById('lead-form');
    const progressBar = document.getElementById('progress-bar');
    
    let currentStep = 1;
    const totalSteps = steps.length;

    // Handle floating labels for inputs that have values auto-filled
    const inputs = document.querySelectorAll('input');
    inputs.forEach(input => {
        input.addEventListener('blur', () => {
            if (input.value.trim() !== '') {
                input.classList.add('has-value');
            } else {
                input.classList.remove('has-value');
            }
        });
    });

    const updateStep = (newStep, direction) => {
        // Validate before moving forward
        if (direction === 'next' && !validateStep(currentStep)) {
            return;
        }

        // Get current and next step elements
        const currentElem = document.querySelector(`.form-step[data-step="${currentStep}"]`);
        const nextElem = document.querySelector(`.form-step[data-step="${newStep}"]`);

        // Animation logic
        if (direction === 'next') {
            currentElem.classList.remove('active');
            currentElem.classList.add('exiting-left');
            
            // Short delay to let exit animation start
            setTimeout(() => {
                currentElem.style.display = 'none';
                currentElem.classList.remove('exiting-left');
                
                nextElem.style.display = 'block';
                // Trigger reflow
                void nextElem.offsetWidth;
                
                nextElem.classList.add('active');
                
                // Update Name personalization if going to step 2
                if (newStep === 2) {
                    const name = document.getElementById('fullName').value.split(' ')[0];
                    if (name) {
                        document.getElementById('display-name').textContent = name;
                    }
                }
            }, 300);
        } else {
            currentElem.classList.remove('active');
            
            setTimeout(() => {
                currentElem.style.display = 'none';
                
                nextElem.style.display = 'block';
                // Trigger reflow
                void nextElem.offsetWidth;
                
                nextElem.classList.add('active');
            }, 300);
        }

        currentStep = newStep;
        
        // Update Progress Bar
        const progressPercentage = ((currentStep - 1) / (totalSteps - 1)) * 100;
        progressBar.style.width = currentStep === 1 ? '25%' : `${progressPercentage}%`;
        if(currentStep === totalSteps) {
            progressBar.style.width = '100%';
        }
    };

    const validateStep = (stepNumber) => {
        const currentElem = document.querySelector(`.form-step[data-step="${stepNumber}"]`);
        const inputs = currentElem.querySelectorAll('input[required], select[required]');
        let isValid = true;

        inputs.forEach(input => {
            if (!input.checkValidity()) {
                input.reportValidity();
                isValid = false;
            }
        });

        return isValid;
    };

    nextBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            if (currentStep < totalSteps) {
                updateStep(currentStep + 1, 'next');
            }
        });
    });

    prevBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            if (currentStep > 1) {
                updateStep(currentStep - 1, 'prev');
            }
        });
    });

    form.addEventListener('submit', (e) => {
        e.preventDefault();
        if (validateStep(currentStep)) {
            // Here you would normally send the data to your server
            // For now, just go to the success step
            updateStep(totalSteps, 'next');
            progressBar.style.backgroundColor = '#4caf50'; // Green success color
            progressBar.style.boxShadow = '0 0 10px #4caf50';
        }
    });
});
