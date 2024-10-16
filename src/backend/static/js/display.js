export function displayBusinessInfo(business, score) {
    // Create a list item for each business
    const listItem = document.createElement('li');
    listItem.classList.add('business-item'); // Add a class for styling

    // Create a div to hold the first row (businessInfoText and toggle button)
    const firstRowDiv = document.createElement('div');
    firstRowDiv.classList.add('first-row'); // Apply class for the first row

    // Create a text element for business information
    const businessInfoText = document.createElement('span'); // Use span to hold text
    businessInfoText.textContent = `Business ID: ${business.business_id}, Name: ${business.name}, Interest Score: ${score}`;
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
    detailsDiv.innerHTML = `
        <p>Address: ${business.address}</p>
        <p>Phone: ${business.phone}</p>
        <p>Description: ${business.description}</p>
    `;
    detailsDiv.style.display = 'none'; // Ensure details are hidden initially

    // Add the details div under the first row
    listItem.appendChild(detailsDiv);

    return listItem; // Return the complete list item
}
