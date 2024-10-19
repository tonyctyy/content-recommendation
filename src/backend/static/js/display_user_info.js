export function displayUserInfo(user) {
    const listItem = document.createElement('li');
    listItem.classList.add('card-display'); // Add a class for styling

    const firstRowDiv = document.createElement('div');
    firstRowDiv.classList.add('first-row'); // Apply class for the first row

    const userInfoText = document.createElement('span'); // Use span to hold text

    // Move Review Count, Average Stars, and Yelping Since to userInfoText
    userInfoText.innerHTML = `
        <h3>Recommendations Result for ${user.name || 'N/A'} (${user.user_id || 'N/A'})</h3>
        <p><strong>Review Count:</strong> ${user.review_count !== null ? user.review_count : 'N/A'}</p>
        <p><strong>Average Stars:</strong> ${user.average_stars !== null ? user.average_stars : 'N/A'}</p>
        <p><strong>Yelping Since:</strong> ${user.yelping_since ? new Date(user.yelping_since).toLocaleDateString() : 'N/A'}</p>
    `;
    
    firstRowDiv.appendChild(userInfoText); // Append text to the first row div

    const toggleButton = document.createElement('button');
    toggleButton.id = `toggle_${user.user_id}`; // Set button ID for targeting
    toggleButton.textContent = 'Show Details';

    let detailsVisible = false; // Track visibility state

    toggleButton.onclick = function () {
        const detailsDiv = document.getElementById(`details_${user.user_id}`);
        detailsVisible = !detailsVisible; // Toggle visibility state
        detailsDiv.style.display = detailsVisible ? 'block' : 'none'; // Set display based on state
        toggleButton.textContent = detailsVisible ? 'Hide Details' : 'Show Details'; // Update button text
    };

    firstRowDiv.appendChild(toggleButton); // Append button to the first row div

    listItem.appendChild(firstRowDiv);

    const detailsDiv = document.createElement('div');
    detailsDiv.id = `details_${user.user_id}`;
    detailsDiv.classList.add('details'); // Apply class for the details section
    detailsDiv.style.display = 'none'; // Ensure details are hidden initially

    // Move the rest of the details to the detailsDiv
    detailsDiv.innerHTML = `
        <p><strong>Useful:</strong> ${user.useful !== null ? user.useful : 'N/A'}</p>
        <p><strong>Funny:</strong> ${user.funny !== null ? user.funny : 'N/A'}</p>
        <p><strong>Cool:</strong> ${user.cool !== null ? user.cool : 'N/A'}</p>
        <p><strong>Fans:</strong> ${user.fans !== null ? user.fans : 'N/A'}</p>
        <p><strong>Friends:</strong> ${user.friends && user.friends.length > 0 ? user.friends.join(', ') : 'None'}</p>
        <p><strong>Elite:</strong> ${user.elite && user.elite.length > 0 ? user.elite.join(', ') : 'None'}</p>
        <p><strong>Compliments:</strong></p>
        <ul>
            <li>Hot: ${user.compliments && user.compliments.hot !== null ? user.compliments.hot : 'N/A'}</li>
            <li>More: ${user.compliments && user.compliments.more !== null ? user.compliments.more : 'N/A'}</li>
            <li>Profile: ${user.compliments && user.compliments.profile !== null ? user.compliments.profile : 'N/A'}</li>
            <li>Cute: ${user.compliments && user.compliments.cute !== null ? user.compliments.cute : 'N/A'}</li>
            <li>List: ${user.compliments && user.compliments.list !== null ? user.compliments.list : 'N/A'}</li>
            <li>Note: ${user.compliments && user.compliments.note !== null ? user.compliments.note : 'N/A'}</li>
            <li>Plain: ${user.compliments && user.compliments.plain !== null ? user.compliments.plain : 'N/A'}</li>
            <li>Cool: ${user.compliments && user.compliments.cool !== null ? user.compliments.cool : 'N/A'}</li>
            <li>Funny: ${user.compliments && user.compliments.funny !== null ? user.compliments.funny : 'N/A'}</li>
            <li>Writer: ${user.compliments && user.compliments.writer !== null ? user.compliments.writer : 'N/A'}</li>
            <li>Photos: ${user.compliments && user.compliments.photos !== null ? user.compliments.photos : 'N/A'}</li>
        </ul>
    `;

    listItem.appendChild(detailsDiv);
    return listItem; // Return the complete list item
}
