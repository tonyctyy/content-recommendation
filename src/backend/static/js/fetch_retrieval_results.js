import { displayBusinessInfo } from './display_business_info.js'; 
import { displayUserInfo } from './display_user_info.js';

document.getElementById('recommendationForm').addEventListener('submit', function(event) {
    event.preventDefault();

    // clear previous results
    const resultsDiv = document.getElementById('results');
    resultsDiv.innerHTML = '';

    const model = document.getElementById('model').value;
    const userId = document.getElementById('userId').value;

    fetch(`/${model}_recommendations?user_id=${userId}`)
        .then(response => response.json())
        .then(data => {
            const resultsDiv = document.getElementById('results');

            // Create separate divs for user and business info
            const userDiv = document.createElement('div');
            const businessDiv = document.createElement('div');

            // Display user info
            if (data.users) {
                const user = data.users[userId];
                const userInfo = displayUserInfo(user);
                userDiv.appendChild(userInfo);
            } else {
                userDiv.innerHTML = `<p>User ID ${userId} not found.</p>`;
            }

            // Display business recommendations
            if (data.recommendations && data.recommendations.length > 0) {
                const businessIds = data.recommendations.map(item => item[0]);
                const businessIdQuery = businessIds.join(',');
                console.log(businessIds);
                // Add a line to show the total number of recommendations
                businessDiv.innerHTML += `<p>Total number of recommendations: ${data.recommendations.length}</p>`;

                // Fetch business info for all recommended business IDs in one request
                fetch(`/business_info?business_ids=${businessIdQuery}`)
                    .then(response => response.json())
                    .then(businessData => {
                        const list = document.createElement('ul'); // Create a list to hold business info

                        data.recommendations.forEach(item => {
                            const businessId = item[0];
                            const score = item[1];

                            const businessInfo = businessData[businessId];
                            // Call displayBusinessInfo for each business
                            const listItem = displayBusinessInfo(businessInfo, score, model);
                            list.appendChild(listItem); // Append the formatted item to the list
                        });

                        businessDiv.appendChild(list); // Add the list to the business div
                    })
                    .catch(error => {
                        console.error('Error fetching business info:', error);
                        businessDiv.innerHTML += `<p>Error fetching business information.</p>`;
                    });
            } else {
                businessDiv.innerHTML += `<p>No recommendations found.</p>`;
            }

            // Append both user and business divs to the results div
            resultsDiv.appendChild(userDiv);
            resultsDiv.appendChild(businessDiv);
        })
        .catch(error => {
            console.error('Error fetching recommendations:', error);
        });
});
