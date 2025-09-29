// Main JavaScript functionality
document.addEventListener('DOMContentLoaded', function() {
    
    // File Upload Enhancement
    initFileUpload();
    
    // File Management
    initFileManager();
    
    // Modal functionality
    initModals();
    
    // Active navigation highlighting
    highlightActiveNav();
});

// File Upload Functionality
function initFileUpload() {
    const singleFileInput = document.getElementById('singleFile');
    const multipleFilesInput = document.getElementById('multipleFiles');
    const uploadForm = document.getElementById('uploadForm');
    const clearBtn = document.getElementById('clearBtn');
    
    if (singleFileInput) {
        setupFileInput(singleFileInput, 'singlePreview', false);
    }
    
    if (multipleFilesInput) {
        setupFileInput(multipleFilesInput, 'multiplePreview', true);
    }
    
    if (uploadForm) {
        uploadForm.addEventListener('submit', handleFormSubmit);
    }
    
    if (clearBtn) {
        clearBtn.addEventListener('click', clearAllFiles);
    }
}

function setupFileInput(input, previewId, multiple) {
    const label = input.nextElementSibling;
    const preview = document.getElementById(previewId);
    
    // File input change event
    input.addEventListener('change', function() {
        updateFilePreview(this.files, preview, multiple);
        updateUploadButton();
    });
    
    // Drag and drop functionality
    label.addEventListener('dragover', function(e) {
        e.preventDefault();
        this.classList.add('dragover');
    });
    
    label.addEventListener('dragleave', function(e) {
        e.preventDefault();
        this.classList.remove('dragover');
    });
    
    label.addEventListener('drop', function(e) {
        e.preventDefault();
        this.classList.remove('dragover');
        
        const files = e.dataTransfer.files;
        if (files.length > 0) {
            input.files = files;
            updateFilePreview(files, preview, multiple);
            updateUploadButton();
        }
    });
}

function updateFilePreview(files, preview, multiple) {
    preview.innerHTML = '';
    
    if (files.length === 0) return;
    
    Array.from(files).forEach(file => {
        const previewItem = document.createElement('div');
        previewItem.className = 'preview-item';
        
        const icon = getFileIcon(file.type);
        const size = formatFileSize(file.size);
        
        previewItem.innerHTML = `
            <i class="${icon}"></i>
            <span class="file-name">${file.name}</span>
            <span class="file-size">${size}</span>
        `;
        
        preview.appendChild(previewItem);
    });
}

function getFileIcon(mimeType) {
    if (mimeType.startsWith('image/')) return 'fas fa-image';
    if (mimeType.includes('pdf')) return 'fas fa-file-pdf';
    if (mimeType.includes('word')) return 'fas fa-file-word';
    if (mimeType.startsWith('video/')) return 'fas fa-file-video';
    if (mimeType.startsWith('audio/')) return 'fas fa-file-audio';
    if (mimeType.includes('zip') || mimeType.includes('rar')) return 'fas fa-file-archive';
    return 'fas fa-file';
}

function formatFileSize(bytes) {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
}

function updateUploadButton() {
    const uploadBtn = document.getElementById('uploadBtn');
    const singleFile = document.getElementById('singleFile');
    const multipleFiles = document.getElementById('multipleFiles');
    
    if (uploadBtn && singleFile && multipleFiles) {
        const hasFiles = singleFile.files.length > 0 || multipleFiles.files.length > 0;
        uploadBtn.disabled = !hasFiles;
        
        if (hasFiles) {
            uploadBtn.classList.add('has-files');
        } else {
            uploadBtn.classList.remove('has-files');
        }
    }
}

function handleFormSubmit(e) {
    const uploadBtn = document.getElementById('uploadBtn');
    const progressContainer = document.getElementById('progressContainer');
    const progressFill = document.getElementById('progressFill');
    const progressText = document.getElementById('progressText');
    
    if (uploadBtn && progressContainer) {
        uploadBtn.disabled = true;
        uploadBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Uploading...';
        progressContainer.style.display = 'block';
        
        let progress = 0;
        const progressInterval = setInterval(() => {
            progress += Math.random() * 15;
            if (progress > 90) progress = 90;
            
            progressFill.style.width = progress + '%';
            progressText.textContent = `Uploading... ${Math.round(progress)}%`;
        }, 200);
        
        setTimeout(() => {
            clearInterval(progressInterval);
            progressFill.style.width = '100%';
            progressText.textContent = 'Processing...';
        }, 2000);
    }
}

function clearAllFiles() {
    const singleFile = document.getElementById('singleFile');
    const multipleFiles = document.getElementById('multipleFiles');
    const description = document.getElementById('description');
    const singlePreview = document.getElementById('singlePreview');
    const multiplePreview = document.getElementById('multiplePreview');
    
    if (singleFile) singleFile.value = '';
    if (multipleFiles) multipleFiles.value = '';
    if (description) description.value = '';
    if (singlePreview) singlePreview.innerHTML = '';
    if (multiplePreview) multiplePreview.innerHTML = '';
    
    updateUploadButton();
}

// File Manager Functionality
function initFileManager() {
    const selectAllBtn = document.getElementById('selectAllBtn');
    const deleteSelectedBtn = document.getElementById('deleteSelectedBtn');
    const fileCheckboxes = document.querySelectorAll('.file-checkbox');
    const deleteButtons = document.querySelectorAll('.delete-file');
    
    if (selectAllBtn) {
        selectAllBtn.addEventListener('click', toggleSelectAll);
    }
    
    if (deleteSelectedBtn) {
        deleteSelectedBtn.addEventListener('click', deleteSelectedFiles);
    }
    
    fileCheckboxes.forEach(checkbox => {
        checkbox.addEventListener('change', updateDeleteButton);
    });
    
    deleteButtons.forEach(button => {
        button.addEventListener('click', function() {
            const filename = this.dataset.filename;
            showDeleteModal(filename);
        });
    });
}

function toggleSelectAll() {
    const selectAllBtn = document.getElementById('selectAllBtn');
    const fileCheckboxes = document.querySelectorAll('.file-checkbox');
    const isSelectAll = selectAllBtn.textContent.includes('Select All');
    
    fileCheckboxes.forEach(checkbox => {
        checkbox.checked = isSelectAll;
    });
    
    if (isSelectAll) {
        selectAllBtn.innerHTML = '<i class="fas fa-square"></i> Deselect All';
    } else {
        selectAllBtn.innerHTML = '<i class="fas fa-check-square"></i> Select All';
    }
    
    updateDeleteButton();
}

function updateDeleteButton() {
    const deleteSelectedBtn = document.getElementById('deleteSelectedBtn');
    const selectedCheckboxes = document.querySelectorAll('.file-checkbox:checked');
    
    if (deleteSelectedBtn) {
        if (selectedCheckboxes.length > 0) {
            deleteSelectedBtn.style.display = 'inline-flex';
            deleteSelectedBtn.innerHTML = `<i class="fas fa-trash"></i> Delete Selected (${selectedCheckboxes.length})`;
        } else {
            deleteSelectedBtn.style.display = 'none';
        }
    }
}

function deleteSelectedFiles() {
    const selectedCheckboxes = document.querySelectorAll('.file-checkbox:checked');
    const filenames = Array.from(selectedCheckboxes).map(cb => 
        cb.closest('.file-card').dataset.filename
    );
    
    if (filenames.length > 0) {
        if (confirm(`Are you sure you want to delete ${filenames.length} selected file(s)?`)) {
            deleteMultipleFiles(filenames);
        }
    }
}

function deleteMultipleFiles(filenames) {
    const promises = filenames.map(filename => 
        fetch(`/files/${encodeURIComponent(filename)}`, {
            method: 'DELETE'
        })
    );
    
    Promise.all(promises)
        .then(responses => {
            const allSuccessful = responses.every(response => response.ok);
            if (allSuccessful) {
                // Remove file cards from DOM
                filenames.forEach(filename => {
                    const fileCard = document.querySelector(`[data-filename="${filename}"]`);
                    if (fileCard) {
                        fileCard.style.opacity = '0';
                        fileCard.style.transform = 'scale(0.8)';
                        setTimeout(() => fileCard.remove(), 300);
                    }
                });
                
                showNotification('Files deleted successfully', 'success');
                
                // Update UI
                setTimeout(() => {
                    updateDeleteButton();
                    updateFilesCount();
                }, 300);
            } else {
                showNotification('Some files could not be deleted', 'error');
            }
        })
        .catch(error => {
            console.error('Error deleting files:', error);
            showNotification('Error deleting files', 'error');
        });
}

function updateFilesCount() {
    const filesCount = document.querySelector('.files-count');
    const fileCards = document.querySelectorAll('.file-card');
    
    if (filesCount) {
        const count = fileCards.length;
        filesCount.innerHTML = `<i class="fas fa-file"></i> ${count} file${count !== 1 ? 's' : ''} found`;
        
        if (count === 0) {
            
            const filesGrid = document.querySelector('.files-grid');
            if (filesGrid) {
                filesGrid.innerHTML = `
                    <div class="empty-state" style="grid-column: 1 / -1;">
                        <div class="empty-icon">
                            <i class="fas fa-folder-open"></i>
                        </div>
                        <h3>No files uploaded yet</h3>
                        <p>Start by uploading your first file</p>
                        <a href="/upload" class="btn btn-primary">
                            <i class="fas fa-plus"></i>
                            Upload Files
                        </a>
                    </div>
                `;
            }
        }
    }
}

// Modal Functionality
function initModals() {
    const modals = document.querySelectorAll('.modal');
    
    modals.forEach(modal => {
        modal.addEventListener('click', function(e) {
            if (e.target === this) {
                hideModal(this);
            }
        });
    });
    
    // Delete modal specific functionality
    const cancelDeleteBtn = document.getElementById('cancelDelete');
    const confirmDeleteBtn = document.getElementById('confirmDelete');
    
    if (cancelDeleteBtn) {
        cancelDeleteBtn.addEventListener('click', () => {
            hideModal(document.getElementById('deleteModal'));
        });
    }
    
    if (confirmDeleteBtn) {
        confirmDeleteBtn.addEventListener('click', confirmDeleteFile);
    }
}

function showDeleteModal(filename) {
    const modal = document.getElementById('deleteModal');
    const fileToDelete = document.getElementById('fileToDelete');
    
    if (modal && fileToDelete) {
        fileToDelete.textContent = filename;
        modal.setAttribute('data-filename', filename);
        showModal(modal);
    }
}

function confirmDeleteFile() {
    const modal = document.getElementById('deleteModal');
    const filename = modal.getAttribute('data-filename');
    
    if (filename) {
        fetch(`/files/${encodeURIComponent(filename)}`, {
            method: 'DELETE'
        })
        .then(response => response.json())
        .then(data => {
            if (data.success) {
                
                const fileCard = document.querySelector(`[data-filename="${filename}"]`);
                if (fileCard) {
                    fileCard.style.opacity = '0';
                    fileCard.style.transform = 'scale(0.8)';
                    setTimeout(() => {
                        fileCard.remove();
                        updateFilesCount();
                    }, 300);
                }
                
                showNotification('File deleted successfully', 'success');
            } else {
                showNotification('Error deleting file', 'error');
            }
            
            hideModal(modal);
        })
        .catch(error => {
            console.error('Error deleting file:', error);
            showNotification('Error deleting file', 'error');
            hideModal(modal);
        });
    }
}

function showModal(modal) {
    modal.classList.add('show');
    document.body.style.overflow = 'hidden';
}

function hideModal(modal) {
    modal.classList.remove('show');
    document.body.style.overflow = '';
}

// Navigation highlighting
function highlightActiveNav() {
    const navLinks = document.querySelectorAll('.nav-link');
    const currentPath = window.location.pathname;
    
    navLinks.forEach(link => {
        const href = link.getAttribute('href');
        if (href === currentPath || (currentPath === '/' && href === '/')) {
            link.style.background = '#667eea';
            link.style.color = 'white';
        }
    });
}

// Notification system
function showNotification(message, type = 'info') {
    const notification = document.createElement('div');
    notification.className = `notification notification-${type}`;
    
    const icon = type === 'success' ? 'fas fa-check-circle' : 
                 type === 'error' ? 'fas fa-exclamation-circle' : 
                 'fas fa-info-circle';
    
    notification.innerHTML = `
        <i class="${icon}"></i>
        <span>${message}</span>
        <button class="notification-close" onclick="this.parentElement.remove()">
            <i class="fas fa-times"></i>
        </button>
    `;
    
    // Add notification styles if not already added
    if (!document.querySelector('#notification-styles')) {
        const styles = document.createElement('style');
        styles.id = 'notification-styles';
        styles.textContent = `
            .notification {
                position: fixed;
                top: 20px;
                right: 20px;
                background: white;
                padding: 1rem 1.5rem;
                border-radius: 10px;
                box-shadow: 0 10px 30px rgba(0, 0, 0, 0.2);
                display: flex;
                align-items: center;
                gap: 1rem;
                z-index: 1001;
                animation: slideInRight 0.3s ease;
                max-width: 400px;
            }
            
            .notification-success {
                border-left: 4px solid #28a745;
                color: #155724;
            }
            
            .notification-error {
                border-left: 4px solid #dc3545;
                color: #721c24;
            }
            
            .notification-info {
                border-left: 4px solid #17a2b8;
                color: #0c5460;
            }
            
            .notification-close {
                background: none;
                border: none;
                cursor: pointer;
                color: inherit;
                opacity: 0.7;
                transition: opacity 0.2s;
            }
            
            .notification-close:hover {
                opacity: 1;
            }
            
            @keyframes slideInRight {
                from {
                    transform: translateX(100%);
                    opacity: 0;
                }
                to {
                    transform: translateX(0);
                    opacity: 1;
                }
            }
        `;
        document.head.appendChild(styles);
    }
    
    document.body.appendChild(notification);
    
    
    setTimeout(() => {
        if (notification.parentElement) {
            notification.style.opacity = '0';
            notification.style.transform = 'translateX(100%)';
            setTimeout(() => notification.remove(), 300);
        }
    }, 5000);
}


function debounce(func, wait) {
    let timeout;
    return function executedFunction(...args) {
        const later = () => {
            clearTimeout(timeout);
            func(...args);
        };
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
    };
}


function initLazyLoading() {
    const images = document.querySelectorAll('img[loading="lazy"]');
    
    if ('IntersectionObserver' in window) {
        const imageObserver = new IntersectionObserver((entries, observer) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const img = entry.target;
                    img.style.opacity = '0';
                    img.onload = () => {
                        img.style.transition = 'opacity 0.3s';
                        img.style.opacity = '1';
                    };
                    observer.unobserve(img);
                }
            });
        });
        
        images.forEach(img => imageObserver.observe(img));
    }
}


if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initLazyLoading);
} else {
    initLazyLoading();
}


document.addEventListener('keydown', function(e) {
    // Ctrl/Cmd + U for upload page
    if ((e.ctrlKey || e.metaKey) && e.key === 'u') {
        e.preventDefault();
        window.location.href = '/upload';
    }
    
    // Ctrl/Cmd + F for files page
    if ((e.ctrlKey || e.metaKey) && e.key === 'f' && e.shiftKey) {
        e.preventDefault();
        window.location.href = '/files';
    }
    
    // Escape key to close modals
    if (e.key === 'Escape') {
        const openModal = document.querySelector('.modal.show');
        if (openModal) {
            hideModal(openModal);
        }
    }
});