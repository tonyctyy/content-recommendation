export function displayBusinessInfo(business, score) {
    // Create a list item for each business
    const listItem = document.createElement('li');
    listItem.classList.add('card-display'); // Add a class for styling

    // Create a div to hold the first row (businessInfoText and toggle button)
    const firstRowDiv = document.createElement('div');
    firstRowDiv.classList.add('first-row'); // Apply class for the first row

    // Create a text element for business information
    const businessInfoText = document.createElement('span'); // Use span to hold text
    businessInfoText.innerHTML = `
    <strong>Name:</strong> ${business.name} (${business.business_id})<br>
    <strong>Interest Score:</strong> ${score}<br>
    <strong>Categories:</strong> ${business.categories && business.categories.length > 0 ? business.categories.join(', ') : 'N/A'}<br>
    <strong>Stars:</strong> ${'★'.repeat(Math.floor(business.stars))}${'☆'.repeat(5 - Math.floor(business.stars))} (${business.review_count} reviews)
    `;
    firstRowDiv.appendChild(businessInfoText); // Append text to the first row div

    // Create a button to toggle details
    const toggleButton = document.createElement('button');
    toggleButton.textContent = 'Show Details';

    // Initialize detail visibility state
    let detailsVisible = false; // Track visibility state
    toggleButton.onclick = function () {
        const detailsDiv = document.getElementById(`details_${business.business_id}`);
        detailsVisible = !detailsVisible; // Toggle visibility state
        detailsDiv.style.display = detailsVisible ? 'block' : 'none'; // Set display based on state
        toggleButton.textContent = detailsVisible ? 'Hide Details' : 'Show Details'; // Update button text
    };

    firstRowDiv.appendChild(toggleButton); // Append button to the first row div

    // Add the first row div to the list item
    listItem.appendChild(firstRowDiv);

    // Create a div to hold detailed information (placed in the second row)
    const detailsDiv = document.createElement('div');
    detailsDiv.id = `details_${business.business_id}`;
    detailsDiv.classList.add('details'); // Apply class for the details section
    detailsDiv.style.display = 'none'; // Ensure details are hidden initially

    // Display detailed business information
    detailsDiv.innerHTML = `
        <p><strong>Address:</strong> ${business.address}, ${business.city}, ${business.state}, ${business.postal_code}</p>
        <p><strong>Attributes:</strong> ${formatAttributes(business.attributes)}</p> <!-- Formatted attributes -->
        <p><strong>Hours:</strong> ${formatHours(business.hours)}</p> <!-- Formatted hours -->
        <p><strong>Check-ins:</strong> ${business.checkins.length}</p>
        <p><strong>Reviews:</strong></p>
        <ul>
            ${business.reviews.map(review => `
                <li><strong>${review.stars} Stars</strong> - ${review.text} <em>(${new Date(review.date).toLocaleDateString()})</em></li>
            `).join('')}
        </ul>
        <p><strong>Tips:</strong></p>
        <ul>
            ${business.tips.map(tip => `
                <li>${tip.text} <em>(${new Date(tip.date).toLocaleDateString()})</em></li>
            `).join('')}
        </ul>
    `;

    // Add the details div under the first row
    listItem.appendChild(detailsDiv);

    return listItem; // Return the complete list item
}

// Helper function to format attributes for display
function formatAttributes(attributes) {
    // Convert JSON-like string to object with error handling
    try {
        attributes = JSON.parse(attributes.replace(/'/g, '"'));
    } catch (e) {
        return 'N/A';
    }

    return Object.entries(attributes).map(([key, value]) => {
        if (typeof value === 'object') {
            return `${key}: ${formatAttributes(value)}`;
        } else {
            return `${key}: ${value}`;
        }
    }).join(', ');
}

// Helper function to format hours for display
function formatHours(hours) {
    // Convert JSON-like string to object with error handling
    try {
        hours = JSON.parse(hours.replace(/'/g, '"'));
    } catch (e) {
        return 'N/A';
    }

    return Object.entries(hours).map(([day, time]) => {
        return `${day}: ${time}`;
    }).join(', ');
}
