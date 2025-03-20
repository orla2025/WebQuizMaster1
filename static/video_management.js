document.addEventListener('DOMContentLoaded', function() {
    const videoUploadForm = document.getElementById('video-upload-form');
    const sourceRadios = document.getElementsByName('video-source');
    const fileSection = document.getElementById('file-upload-section');
    const urlSection = document.getElementById('url-upload-section');

    if (videoUploadForm) {
        console.log('Video upload form found');
        videoUploadForm.addEventListener('submit', handleVideoUpload);
    }

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

async function handleVideoUpload(event) {
    event.preventDefault();
    console.log('Starting video upload...');

    const formData = new FormData();
    const titleInput = document.getElementById('video-title');
    const sourceType = document.querySelector('input[name="video-source"]:checked').value;

    // Basic validation
    if (!titleInput.value.trim()) {
        showAlert('Please enter a video title', 'danger');
        return;
    }

    console.log('Upload type:', sourceType);
    formData.append('title', titleInput.value);
    formData.append('source_type', sourceType);

    // Add optional metadata
    const tags = document.getElementById('video-tags').value.trim();
    if (tags) formData.append('tags', tags);

    const notes = document.getElementById('video-notes').value.trim();
    if (notes) formData.append('notes', notes);

    if (sourceType === 'file') {
        const fileInput = document.getElementById('video-file');
        if (!fileInput.files[0]) {
            showAlert('Please select a video file', 'danger');
            return;
        }
        console.log('Uploading file:', fileInput.files[0].name);
        formData.append('video', fileInput.files[0]);
    } else {
        const urlInput = document.getElementById('video-url');
        if (!urlInput.value) {
            showAlert('Please enter a video URL', 'danger');
            return;
        }
        console.log('Uploading from URL:', urlInput.value);
        formData.append('video_url', urlInput.value);
    }

    try {
        const playerId = window.location.pathname.split('/').pop();
        console.log('Sending request to server for player:', playerId);

        // Show loading state
        const submitButton = event.target.querySelector('button[type="submit"]');
        const originalText = submitButton.textContent;
        submitButton.disabled = true;
        submitButton.textContent = 'Uploading...';

        const response = await fetch(`/api/players/${playerId}/videos`, {
            method: 'POST',
            body: formData
        });

        console.log('Response status:', response.status);
        const data = await response.json();
        console.log('Server response:', data);

        if (response.ok) {
            showAlert('Video uploaded successfully!', 'success');
            // Reset form
            event.target.reset();
            // Reload the page to show the new video
            window.location.reload();
        } else {
            throw new Error(data.error || 'Failed to upload video');
        }
    } catch (error) {
        console.error('Error uploading video:', error);
        showAlert('Error uploading video: ' + error.message, 'danger');
    } finally {
        // Reset button state
        const submitButton = event.target.querySelector('button[type="submit"]');
        submitButton.disabled = false;
        submitButton.textContent = 'Upload Video';
    }
}

function showAlert(message, type) {
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