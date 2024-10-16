import { displayBusinessInfo } from './display.js'; 

document.getElementById('ItemCF_recommendationForm').addEventListener('submit', function(event) {
    event.preventDefault();
    const userId = document.getElementById('userId').value;

    fetch(`/ItemCF_recommendations?user_id=${userId}`)
        .then(response => response.json())
        .then(data => {
            const resultsDiv = document.getElementById('results');
            resultsDiv.innerHTML = `<h3>Recommendations for User ID: ${userId}</h3>`;

            if (data.recommendations && data.recommendations.length > 0) {
                const businessIds = data.recommendations.map(item => item[0]);
                const businessIdQuery = businessIds.join(',');

                // add a line to show the total number of recommendations
                resultsDiv.innerHTML += `<p>Total number of recommendations: ${data.recommendations.length}</p>`;

                // Fetch business info for all recommended business IDs in one request
                fetch(`/business_info?business_ids=${businessIdQuery}`)
                    .then(response => response.json())
                    .then(businessData => {
                        const list = document.createElement('ul'); // Create a list to hold business info

                        data.recommendations.forEach(item => {
                            const businessId = item[0];
                            const score = item[1];

                            const businessInfo = businessData[businessId];
                            console.log(businessInfo);
                            // Call displayBusinessInfo for each business
                            const listItem = displayBusinessInfo(businessInfo, score);
                            list.appendChild(listItem); // Append the formatted item to the list
                        });

                        resultsDiv.appendChild(list); // Add the list to the results div
                    })
                    .catch(error => {
                        console.error('Error fetching business info:', error);
                    });
            } else {
                resultsDiv.innerHTML += `<p>No recommendations found.</p>`;
            }
        })
        .catch(error => {
            console.error('Error fetching recommendations:', error);
        });
});
