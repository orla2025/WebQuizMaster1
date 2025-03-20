// Global functions for section management
window.showSection = function(sectionId) {
    // Get all sections
    const sections = {
        'hero-section': document.querySelector('.hero-section'),
        'features': document.getElementById('features'),
        'login-section': document.getElementById('login-section'),
        'register-section': document.getElementById('register-section')
    };

    // First, hide all sections except hero and features
    ['login-section', 'register-section'].forEach(section => {
        if (sections[section]) {
            sections[section].classList.add('hidden');
        }
    });

    // Show the requested section
    if (sectionId === 'login-section' || sectionId === 'register-section') {
        const sectionToShow = sections[sectionId];
        if (sectionToShow) {
            sectionToShow.classList.remove('hidden');
            if (sections['hero-section']) sections['hero-section'].style.opacity = '0.5';
            if (sections['features']) sections['features'].style.opacity = '0.5';
        }
    } else {
        // For non-auth sections, show main content at full opacity
        if (sections['hero-section']) sections['hero-section'].style.opacity = '1';
        if (sections['features']) sections['features'].style.opacity = '1';
    }
};

window.hideSection = function(sectionId) {
    const section = document.getElementById(sectionId);
    if (section) {
        section.classList.add('hidden');
    }
    // Restore main content opacity
    const heroSection = document.querySelector('.hero-section');
    if (heroSection) heroSection.style.opacity = '1';
    const features = document.getElementById('features');
    if (features) features.style.opacity = '1';
};

// DOM Content Loaded Event Listener
document.addEventListener("DOMContentLoaded", function() {
    const loginForm = document.getElementById("login-form");
    const registerForm = document.getElementById("register-form");

    if (loginForm) {
        loginForm.addEventListener("submit", loginUser);
    }
    if (registerForm) {
        registerForm.addEventListener("submit", registerUser);
    }
});

async function registerUser(event) {
    event.preventDefault();
    console.log('=== REGISTRATION PROCESS STARTED ===');

    try {
        // Get individual form field values
        const firstName = document.getElementById('register-firstname').value.trim();
        const lastName = document.getElementById('register-lastname').value.trim();
        const dateOfBirth = document.getElementById('register-dob').value.trim();
        const email = document.getElementById('register-email').value.trim();
        const password = document.getElementById('register-password').value.trim();
        const team = document.getElementById('register-team').value.trim();

        // Log individual field values
        console.log('Form field values:', {
            firstName,
            lastName,
            dateOfBirth,
            email,
            team
        });

        // Validate required fields
        if (!firstName || !lastName || !dateOfBirth || !email || !password) {
            const message = "I campi contrassegnati con * sono obbligatori";
            console.error('Validation failed:', message);
            showAlert(message, "danger");
            return;
        }

        // Validate age
        const birthDate = new Date(dateOfBirth);
        const today = new Date();
        let age = today.getFullYear() - birthDate.getFullYear();
        const monthDiff = today.getMonth() - birthDate.getMonth();

        if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
            age--;
        }

        console.log('Calculated age:', age);

        if (age < 14) {
            const message = "Devi avere almeno 14 anni per registrarti";
            console.error('Age validation failed:', age);
            showAlert(message, "danger");
            return;
        }

        // Prepare registration data
        const registrationData = {
            first_name: firstName,
            last_name: lastName,
            date_of_birth: dateOfBirth,
            email: email,
            password: password,
            team: team || ''
        };

        console.log('Sending registration request:', registrationData);

        // Send registration request
        const response = await fetch('/register', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Accept': 'application/json'
            },
            body: JSON.stringify(registrationData)
        });

        console.log('Response status:', response.status);
        const responseData = await response.json();
        console.log('Server response:', responseData);

        if (!response.ok) {
            throw new Error(responseData.error || 'Errore durante la registrazione');
        }

        showAlert("Registrazione completata con successo", "success");
        if (responseData.redirect) {
            console.log('Redirecting to:', responseData.redirect);
            window.location.href = responseData.redirect;
        }
    } catch (error) {
        console.error('Registration error:', error);
        showAlert(error.message || "Errore durante la registrazione", "danger");
    }
}

function showAlert(message, type) {
    console.log(`Showing alert: ${type} - ${message}`);
    const alertDiv = document.createElement('div');
    alertDiv.className = `alert alert-${type} alert-dismissible fade show position-fixed top-0 start-50 translate-middle-x mt-3`;
    alertDiv.style.zIndex = "1050";
    alertDiv.innerHTML = `
        ${message}
        <button type="button" class="btn-close" data-bs-dismiss="alert" aria-label="Close"></button>
    `;
    document.body.appendChild(alertDiv);

    setTimeout(() => {
        alertDiv.remove();
    }, 3000);
}

async function loginUser(event) {
    event.preventDefault();

    const email = document.getElementById("login-email")?.value?.trim();
    const password = document.getElementById("login-password")?.value?.trim();

    if (!email || !password) {
        showAlert("Email e password sono obbligatori", "danger");
        return;
    }

    try {
        const response = await fetch('/login', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ email, password })
        });

        const data = await response.json();
        if (!response.ok) {
            throw new Error(data.error || 'Errore durante il login');
        }

        showAlert("Login effettuato con successo", "success");
        if (data.redirect) {
            window.location.href = data.redirect;
        }
    } catch (error) {
        console.error("Error during login:", error);
        showAlert(error.message || "Errore durante il login", "danger");
    }
}

async function checkLoginStatus() {
    try {
        const response = await fetch('/api/check-auth');
        const data = await response.json();
        if (data.authenticated) {
            // Update UI for logged in state
            updateUIForLoggedInUser(data.user);
        }
    } catch (error) {
        console.error("Error checking auth status:", error);
    }
}

function updateUIForLoggedInUser(user) {
    const authButtons = document.querySelector('.auth-buttons');
    if (authButtons) {
        authButtons.innerHTML = `
            <a href="/profile" class="btn btn-outline-light me-2">${user.username}</a>
            <button onclick="logoutUser()" class="btn btn-danger">Logout</button>
        `;
    }
}

async function logoutUser() {
    try {
        window.location.href = '/logout';
    } catch (error) {
        console.error("Error during logout:", error);
        showAlert("Errore durante il logout: " + error.message, "danger");
    }
}


async function handleSearch(event) {
    event.preventDefault();

    const name = document.getElementById('search-name').value.trim();
    const team = document.getElementById('search-team').value.trim();
    const role = document.getElementById('search-role').value;

    try {
        const params = new URLSearchParams();
        if (name) params.append('name', name);
        if (team) params.append('team', team);
        if (role) params.append('role', role);

        const response = await fetch(`/api/players/search?${params.toString()}`);

        if (!response.ok) {
            throw new Error('Search request failed');
        }

        const players = await response.json();
        displaySearchResults(players);
    } catch (error) {
        console.error('Error searching players:', error);
        showAlert('Error searching players: ' + error.message, 'danger');
    }
}

function displaySearchResults(players) {
    const resultsContainer = document.getElementById('search-results');

    if (!players.length) {
        resultsContainer.innerHTML = `
            <div class="col-12">
                <div class="alert alert-info">No players found matching your search criteria.</div>
            </div>
        `;
        return;
    }

    resultsContainer.innerHTML = players.map(player => `
        <div class="col-md-4 mb-4">
            <div class="card player-card h-100">
                <div class="card-body">
                    <h5 class="card-title">${player.name}</h5>
                    <p class="card-text">
                        <span class="stat-badge">Team: ${player.team}</span>
                        <span class="stat-badge">Role: ${player.role}</span>
                    </p>
                    <p class="card-text">
                        <span class="stat-badge">Goals: ${player.goals}</span>
                        <span class="stat-badge">Assists: ${player.assists}</span>
                    </p>
                    <div class="mt-3">
                        <a href="/players/${player.id}" class="btn btn-primary w-100">View Profile</a>
                    </div>
                </div>
            </div>
        </div>
    `).join('');
}

// Add debug logging to savePlayer function
async function savePlayer(event) {
    event.preventDefault();
    console.log('Form submission started');

    // Collect player data
    const playerData = {
        name: document.getElementById('player-name').value.trim(),
        team: document.getElementById('player-team').value.trim(),
        role: document.getElementById('player-role').value,
        goals: parseInt(document.getElementById('player-goals').value) || 0,
        assists: parseInt(document.getElementById('player-assists').value) || 0
    };

    console.log('Player data collected:', playerData);

    // Basic validation
    if (!playerData.name || !playerData.team || !playerData.role) {
        showAlert('Compila tutti i campi obbligatori', 'danger');
        return;
    }

    try {
        console.log('Sending request to server...');
        const response = await fetch('/api/players', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(playerData)
        });

        console.log('Response status:', response.status);
        const data = await response.json();
        console.log('Server response:', data);

        if (response.ok) {
            // If we have video data, upload it
            const videoTitle = document.getElementById('video-title').value.trim();
            const sourceType = document.querySelector('input[name="video-source"]:checked').value;

            if (videoTitle && ((sourceType === 'file' && document.getElementById('video-file').files[0]) ||
                                 (sourceType === 'url' && document.getElementById('video-url').value.trim()))) {
                await uploadVideo(data.player.id, videoTitle, sourceType);
            }

            showAlert('Giocatore aggiunto con successo!', 'success');
            document.getElementById('add-player-form').reset();
            hideSection('add-player-section');
            // Reload the page to show the new player
            window.location.reload();
        } else {
            throw new Error(data.error || 'Errore durante l\'aggiunta del giocatore');
        }
    } catch (error) {
        console.error('Error saving player:', error);
        showAlert('Errore durante il salvataggio: ' + error.message, 'danger');
    }
}

async function uploadVideo(playerId, title, sourceType) {
    const formData = new FormData();
    formData.append('title', title);
    formData.append('source_type', sourceType);

    // Add the new video metadata
    formData.append('action_type', document.getElementById('action-type').value);
    formData.append('skill_rating', document.querySelector('input[name="skill_rating"]:checked')?.value || '3');
    formData.append('tags', document.getElementById('video-tags').value.trim());
    formData.append('notes', document.getElementById('video-notes').value.trim());

    if (sourceType === 'file') {
        const fileInput = document.getElementById('video-file');
        formData.append('video', fileInput.files[0]);
    } else {
        const urlInput = document.getElementById('video-url');
        formData.append('video_url', urlInput.value.trim());
    }

    try {
        const response = await fetch(`/api/players/${playerId}/videos`, {
            method: 'POST',
            body: formData
        });

        if (!response.ok) {
            const data = await response.json();
            throw new Error(data.error || 'Errore durante l\'upload del video');
        }
    } catch (error) {
        console.error('Error uploading video:', error);
        showAlert('Errore durante l\'upload del video: ' + error.message, 'danger');
        throw error;
    }
}

// Add event listeners for video source switching
document.addEventListener('DOMContentLoaded', function() {
    const sourceRadios = document.getElementsByName('video-source');
    const fileSection = document.getElementById('file-upload-section');
    const urlSection = document.getElementById('url-upload-section');

    sourceRadios.forEach(radio => {
        radio.addEventListener('change', function() {
            if (this.value === 'file') {
                fileSection.classList.remove('d-none');
                urlSection.classList.add('d-none');
            } else {
                fileSection.classList.add('d-none');
                urlSection.classList.remove('d-none');
            }
        });
    });
});