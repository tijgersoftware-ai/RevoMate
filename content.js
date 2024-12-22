// Define invoice sources
let invoiceSources = [];
// Load sources from localStorage
const storedSources = JSON.parse(localStorage.getItem('invoiceSources') || '[]');
invoiceSources = storedSources;

// Create function to check if we should show the sidebar
function shouldShowSidebar() {
  // if data-rui="page-top-nav" is present, then show the sidebar and
  return window.location.pathname.includes('/expense');
}

// Create function to handle sidebar visibility
function updateSidebarVisibility() {
  const sidebar = document.getElementById('custom-sidebar');
  if (!sidebar) return;

  if (shouldShowSidebar()) {
    sidebar.style.display = 'block';
    document.body.style.marginRight = '300px';
    initializeSidebarFunctionality();
  } else {
    sidebar.style.display = 'none';
    document.body.style.marginRight = '0';
  }
}

// Add a flag to track if we're currently updating
let isUpdating = false;

// Improve observer to be more specific
const observer = new MutationObserver((mutations) => {
  if (isUpdating) return;

  requestAnimationFrame(() => {
    updateSidebarVisibility();
  });
});

// Start observing the document body for URL changes
observer.observe(document.body, {
  childList: true,
  subtree: true
});

// Create the sidebar only if we're on the correct page
// Create the sidebar container
const sidebar = document.createElement('div');
sidebar.id = 'custom-sidebar';

// Add the sidebar to the page
document.body.appendChild(sidebar);

// Adjust the page layout to make room for the sidebar
document.body.style.marginRight = '300px';
sidebar.style.cssText = `
    position: fixed;
    top: 0;
    right: 0;
    width: 300px;
    height: 100vh;
    background: #000d1a;
    padding-top: 0px;
    padding-left: 24px;
    padding-right: 24px;
    padding-bottom: 24px;
    color: white;
    font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
  `;
sidebar.id = 'custom-sidebar';

// Create the sidebar content
sidebar.innerHTML = `
    <div style="
      position: sticky;
      top: 0;
      z-index: 1;
      background: #000d1a;
      padding-top: 24px;

    ">
      <div style="
        display: flex;
        align-items: center;
        gap: 12px;
        padding-bottom: 16px;
        margin-bottom: 16px;
      ">
        <img 
          src="${chrome.runtime.getURL('icons/icon333.png')}" 
          alt="RevoMate"
          style="
            width: 32px;
            height: 32px;
            border-radius: 6px;
          "
        />
        <h1 style="
          font-size: 24px;
          font-weight: 500;
          color: white;
          margin: 0;
          min-width: 0;
          overflow: hidden;
          text-overflow: ellipsis;
          white-space: nowrap;
          line-height: 1.2;
          padding: 4px 0;
        ">RevoMate Sources</h1>
      </div>
    </div>

    <!-- Add container for search and links -->
    <div style="
      background: #1a2631;
      border-radius: 12px;
      padding: 16px;
    ">
      <!-- Existing search input -->
      <input 
        type="text" 
        id="source-search" 
        placeholder="Search sources..." 
        style="
          width: 100%;
          padding: 12px;
          margin-bottom: 20px;
          background: #48515a;
          border: none;
          border-radius: 8px;
          color: white;
          font-size: 14px;
        "
      >
      <div id="source-links" style="display: flex; flex-direction: column; gap: 16px;">
        ${invoiceSources.map((source, index) => `
          <div style="
            display: flex; 
            align-items: center; 
            justify-content: space-between;
            background: ${index % 2 !== 0 ? '#232f39' : 'transparent'};
            padding: 8px;
            border-radius: 6px;
            width: 100%;
          ">
            <a 
              href="${source.url}" 
              target="_blank" 
              rel="noopener noreferrer" 
              style="
                display: flex;
                align-items: center;
                text-decoration: none;
                color: white;
                font-size: 14px;
                gap: 12px;
                min-width: 0;
                flex: 1;
                transition: filter 0.2s ease;
              "
              onmouseover="this.style.filter='brightness(1.3)'"
              onmouseout="this.style.filter='brightness(1)'"
            >
              <svg 
                width="16" 
                height="16" 
                viewBox="0 0 24 24" 
                fill="none"
                stroke="currentColor"
                style="min-width: 16px; flex-shrink: 0;"
              >
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14"/>
              </svg>
              <span style="
                overflow: hidden;
                text-overflow: ellipsis;
                white-space: nowrap;
              ">${source.name}</span>
            </a>
            <button
              class="delete-source"
              data-index="${index}"
              style="
                background: none;
                border: none;
                color: white;
                cursor: pointer;
                padding: 4px;
                transition: filter 0.2s ease;
              "
              onmouseover="this.style.filter='brightness(1.3)'"
              onmouseout="this.style.filter='brightness(1)'"
            >
              <svg
                width="16"
                height="16"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
              >
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
              </svg>
            </button>
          </div>
        `).join('')}
      </div>
    </div>

    <!-- Add source button -->
    <button 
      id="add-source-button"
      style="
        position: fixed;
        bottom: 24px;
        right: 24px;
        width: 56px;
        height: 56px;
        border-radius: 50%;
        background: white;
        border: none;
        color: black;
        font-size: 24px;
        cursor: pointer;
        display: flex;
        align-items: center;
        justify-content: center;
        box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
      "
    >+</button>

    <!-- Popup form -->
    <div 
      id="add-source-popup"
      style="
        display: none;
        position: fixed;
        top: 50%;
        left: 50%;
        transform: translate(-50%, -50%);
        background: #000d1a;
        padding: 24px;
        border-radius: 12px;
        box-shadow: 0 4px 20px rgba(0, 0, 0, 0.2);
        z-index: 1000;
        width: 320px;
      "
    >
      <h3 style="margin: 0 0 16px; color: white;">Add New Source</h3>
      <form id="add-source-form">
        <input 
          type="text" 
          id="new-source-name" 
          placeholder="Source name" 
          style="
            width: 100%;
            padding: 12px;
            margin-bottom: 8px;
            background: #1E2F3F;
            border: none;
            border-radius: 8px;
            color: white;
            font-size: 14px;
          "
        >
        <input 
          type="url" 
          id="new-source-url" 
          placeholder="Source URL" 
          style="
            width: 100%;
            padding: 12px;
            margin-bottom: 16px;
            background: #1E2F3F;
            border: none;
            border-radius: 8px;
            color: white;
            font-size: 14px;
          "
        >
        <div style="display: flex; gap: 8px;">
          <button 
            type="button"
            id="cancel-add-source"
            style="
              flex: 1;
              padding: 12px;
              background: #1E2F3F;
              border: none;
              border-radius: 8px;
              color: white;
              font-size: 14px;
              cursor: pointer;
            "
          >Cancel</button>
          <button 
            type="submit"
            style="
              flex: 1;
              padding: 12px;
              background: white;
              border: none;
              border-radius: 8px;
              color: black;
              font-size: 14px;
              cursor: pointer;
            "
          >Add</button>
        </div>
      </form>
    </div>

    <!-- Overlay -->
    <div 
      id="overlay"
      style="
        display: none;
        position: fixed;
        top: 0;
        left: 0;
        right: 0;
        bottom: 0;
        background: rgba(0, 0, 0, 0.5);
        z-index: 999;
      "
    ></div>

   
  `;

// Initial visibility check
updateSidebarVisibility();

// Improve source management with proper error handling
function getStoredSources() {
  try {
    return JSON.parse(localStorage.getItem('invoiceSources') || '[]');
  } catch (error) {
    console.error('Error loading sources:', error);
    return [];
  }
}

function saveStoredSources(sources) {
  try {
    localStorage.setItem('invoiceSources', JSON.stringify(sources));
    return true;
  } catch (error) {
    console.error('Error saving sources:', error);
    return false;
  }
}

// Improve delete functionality to handle the last element correctly
function deleteSource(index, value) {
  if (isUpdating) return;
  isUpdating = true;

  try {
    // Validate input parameters
    if (typeof index !== 'number' || !value || !value.url) {
      console.error('Invalid delete parameters:', { index, value });
      return;
    }

    // Get fresh copy of sources
    const storedSources = getStoredSources();

    // Validate stored sources
    if (!Array.isArray(storedSources)) {
      console.error('Invalid stored sources');
      return;
    }
    // add an alert to confirm deletion for the user with the source name and url
    if (confirm(`Are you sure you want to delete ${value.name}?`)) {
      // Remove the source
      storedSources.splice(index, 1);
    } else {
      return;
    }
    // Save updated sources
    if (saveStoredSources(storedSources)) {
      // Update global state
      invoiceSources = [...storedSources];

      // Use direct DOM manipulation for non-last elements
      const sourceLinks = document.getElementById('source-links');
      if (sourceLinks) {
        const sourceItem = sourceLinks.querySelector(`[data-index="${index}"]`);
        if (sourceItem) {
          sourceItem.closest('.source-item').remove();
        } else {
          // Fallback to full update if element not found
          updateSourcesList(storedSources);
        }
      }
    }
  } catch (error) {
    console.error('Error deleting source:', error);
  } finally {
    isUpdating = false;
  }
}

// Improve delete button initialization
function initializeDeleteButtons() {
  const deleteButtons = document.querySelectorAll('.delete-source');
  // First remove all existing listeners
  deleteButtons.forEach(button => {
    const clone = button.cloneNode(true);
    button.replaceWith(clone);
  });

  // Then add fresh listeners
  document.querySelectorAll('.delete-source').forEach(button => {
    button.addEventListener('click', (e) => {
      e.stopPropagation();
      const index = parseInt(e.currentTarget.dataset.index);
      if (isNaN(index) || !invoiceSources[index]) {
        console.error('Invalid source index:', index);
        return;
      }
      const value = invoiceSources[index];
      deleteSource(index, value);
    }, { once: true }); // Add once: true to ensure the listener only fires once
  });
}

// Update sources list with better state management
function updateSourcesList(sources) {
  if (isUpdating) return;
  isUpdating = true;

  try {
    const sourceLinks = document.getElementById('source-links');
    if (!sourceLinks) return;

    // Validate sources array
    if (!Array.isArray(sources)) {
      console.error('Invalid sources data');
      return;
    }

    // Update global state
    invoiceSources = [...sources];

    // Update UI
    sourceLinks.innerHTML = sources.map((source, index) => {
      if (!source || !source.url || !source.name) {
        console.error('Invalid source data:', source);
        return '';
      }

      return `
        <div class="source-item" style="
          display: flex; 
          align-items: center; 
          justify-content: space-between;
          background: ${index % 2 !== 0 ? '#232f39' : 'transparent'};
          padding: 8px;
          border-radius: 6px;
          width: 100%;
        ">
          <a 
            href="${source.url}" 
            target="_blank" 
            rel="noopener noreferrer" 
            style="
              display: flex;
              align-items: center;
              text-decoration: none;
              color: white;
              font-size: 14px;
              gap: 12px;
              min-width: 0;
              flex: 1;
              transition: filter 0.2s ease;
            "
            onmouseover="this.style.filter='brightness(1.3)'"
            onmouseout="this.style.filter='brightness(1)'"
          >
            <svg 
              width="16" 
              height="16" 
              viewBox="0 0 24 24" 
              fill="none"
              stroke="currentColor"
              style="min-width: 16px; flex-shrink: 0;"
            >
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14"/>
            </svg>
            <span style="
              overflow: hidden;
              text-overflow: ellipsis;
              white-space: nowrap;
            ">${source.name}</span>
          </a>
          <button
            class="delete-source"
            data-index="${index}"
            style="
              background: none;
              border: none;
              color: white;
              cursor: pointer;
              padding: 4px;
              transition: filter 0.2s ease;
            "
            onmouseover="this.style.filter='brightness(1.3)'"
            onmouseout="this.style.filter='brightness(1)'"
          >
            <svg
              width="16"
              height="16"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
            >
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
            </svg>
          </button>
        </div>
      `;
    }).filter(Boolean).join('');

    // Reinitialize delete functionality for new items
    initializeDeleteButtons();
  } catch (error) {
    console.error('Error updating sources list:', error);
  } finally {
    isUpdating = false;
  }
}

// Update form submission to properly refresh the list
function initializeFormHandlers() {
  const addSourceForm = document.getElementById('add-source-form');
  const addSourceButton = document.getElementById('add-source-button');
  const addSourcePopup = document.getElementById('add-source-popup');
  const overlay = document.getElementById('overlay');
  const cancelButton = document.getElementById('cancel-add-source');

  if (!addSourceForm || !addSourceButton || !addSourcePopup || !overlay || !cancelButton) {
    console.error('Required form elements not found');
    return;
  }

  function showPopup() {
    addSourcePopup.style.display = 'block';
    overlay.style.display = 'block';
  }

  function hidePopup() {
    addSourcePopup.style.display = 'none';
    overlay.style.display = 'none';
    addSourceForm.reset();
    clearFormErrors();
  }

  addSourceForm.addEventListener('submit', async (event) => {
    event.preventDefault();

    const nameInput = document.getElementById('new-source-name');
    const urlInput = document.getElementById('new-source-url');

    if (!nameInput || !urlInput) {
      showFormErrors(['Form inputs not found']);
      return;
    }

    const name = nameInput.value.trim();
    const url = urlInput.value.trim();

    clearFormErrors();
    const errors = validateSource(name, url);

    if (errors.length > 0) {
      showFormErrors(errors);
      return;
    }

    try {
      const storedSources = getStoredSources();
      storedSources.unshift({ name, url });

      if (saveStoredSources(storedSources)) {
        // Update the global invoiceSources array
        invoiceSources = storedSources;
        hidePopup();
        updateSourcesList(storedSources);
      } else {
        showFormErrors(['Failed to save source. Please try again.']);
      }
    } catch (error) {
      console.error('Error saving source:', error);
      showFormErrors(['An unexpected error occurred. Please try again.']);
    }
  });

  // Event listeners for popup controls
  addSourceButton.addEventListener('click', showPopup);
  overlay.addEventListener('click', hidePopup);
  cancelButton.addEventListener('click', hidePopup);
}

// Helper functions for form error handling
function clearFormErrors() {
  const existingError = document.getElementById('source-form-error');
  if (existingError) {
    existingError.remove();
  }
}

function showFormErrors(errors) {
  const form = document.getElementById('add-source-form');
  if (!form) return;

  clearFormErrors();

  const errorDiv = document.createElement('div');
  errorDiv.id = 'source-form-error';
  errorDiv.style.cssText = `
    color: #ff4444;
    font-size: 14px;
    margin-bottom: 16px;
    padding: 8px;
    background: rgba(255, 68, 68, 0.1);
    border-radius: 4px;
  `;
  errorDiv.innerHTML = errors.join('<br>');

  const buttonsDiv = form.querySelector('div');
  if (buttonsDiv) {
    form.insertBefore(errorDiv, buttonsDiv);
  } else {
    form.appendChild(errorDiv);
  }
}

// Improve initialization to handle observer better
function initializeSidebarFunctionality() {
  // Disconnect any existing observer
  observer.disconnect();

  try {
    const searchInput = document.getElementById('source-search');
    if (searchInput) {
      let debounceTimeout;

      searchInput.addEventListener('input', (e) => {
        clearTimeout(debounceTimeout);
        debounceTimeout = setTimeout(() => {
          const searchTerm = e.target.value.toLowerCase();
          const sourceContainers = document.querySelectorAll('#source-links > div');

          sourceContainers.forEach(container => {
            const link = container.querySelector('a');
            const text = link.textContent.toLowerCase();
            container.style.display = text.includes(searchTerm) ? 'flex' : 'none';
          });
        }, 150);
      });
    }

    // Initialize delete buttons
    initializeDeleteButtons();

    // Initialize form handlers
    initializeFormHandlers();
  } finally {
    // Reconnect observer after initialization
    if (shouldShowSidebar()) {
      observer.observe(document.body, {
        childList: true,
        subtree: true
      });
    }
  }
}

// Add validation functions
function isValidUrl(string) {
  try {
    const url = new URL(string);
    return url.protocol === "http:" || url.protocol === "https:";
  } catch (_) {
    return false;
  }
}

function validateSource(name, url) {
  const errors = [];

  // Validate name
  if (!name.trim()) {
    errors.push("Name is required");
  }
  if (name.length > 50) {
    errors.push("Name must be less than 50 characters");
  }

  // Validate URL
  if (!url.trim()) {
    errors.push("URL is required");
  }
  if (!isValidUrl(url)) {
    errors.push("Please enter a valid URL (starting with http:// or https://)");
  }

  // Check for duplicates
  const storedSources = JSON.parse(localStorage.getItem('invoiceSources') || '[]');
  if (storedSources.some(source => source.url === url)) {
    errors.push("This URL already exists in your sources");
  }

  return errors;
}

// Start observing only when needed
if (shouldShowSidebar()) {
  observer.observe(document.body, {
    childList: true,
    subtree: true
  });
}
