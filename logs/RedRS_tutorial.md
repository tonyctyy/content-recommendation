[Back to Main Page](../README.md)

# 5/7/2024: Red Content Recommendation System Tutorial
This is the summary of the [tutorial series](https://youtu.be/5dTOPen28ts2si=ghYBTACSpeeFZXgk) from the Red Algorithm Engineer.

## Industrial Approach
### Steps for CR System
1. Retrieval (reduce results from trillions to thousands)
    - It usualy combines different methods (e.g. Collaborative Filtering, GNN) to retrieve results and add them up.
2. Pre-Ranking (reduce results from thousands to hundreds)
    - This is where neural networks are used to do prediction in terms of the evaluation metrics (e.g. Click-through rate, like rate).
3. Ranking (a more complex mechanism to rank results compare to pre-ranking）
4. Re-Ranking (reduce results from hundreds to tens)
    - It considers both scores and variety of the results. As a result, it sets up rules to re-distribute similar results.
    - It uses different sampling methods (e.g. MMR, DPP) to reduce results.
    - It also adds advertisements and additional information to the results.


### Retrieval
1. **Collaborative Filtering (CF):**
- This technique relies heavily on user behavior data to make recommendations but it might be difficult to collect user data.
    1. **Item CF:** If a user is interested in an item, it is more likely that they wi1l be interested in similar items.
        - **User Index:** It stores the user behavior data （e.g. the past 100 clicks and other interactions) to determine user preferences (i.e. like( user, item_j ) ).
        - **Item Index:** It stores the content data to determine if two items are similar. When the user groups are similar, the item groups are also considered similar. We usually use the Jaccard index or cosine similarity to determine if two items are similar or not.
        - **Retrieval Procedure:**
            1. Given a user_id, it returns the **last-n** items that the user has interacted with through the *User Index**, (We assume they are interested in these items).
            2. Using the **last-n** items, it returns the **top-k** similar items for each item through the **Item Index**.
            3. This method returns at most n*k similar results. It then predicts the interest score for each item.
            4. Returns the 100 results.
        - **Misclassification of Similar Item:** We may consider two items to be similar if they are interacted by a small group of users. It is possivle that the small group of users are friends or they share the same sources of informstion through social media or any community. Then, we may misclassify two irrelevant items to be similar.
            - **Swing Model** is used to find users from the same group and lower their weightings when calculating the similarity of two items.

    2. **User Cf:** 