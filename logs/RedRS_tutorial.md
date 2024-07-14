[Back to Main Page](../README.md)

<h1>5/7/2024: Red Content Recommendation System Tutorial (Updated on 14/7/2024) </h1>

This is the summary of the [Red Content Recommendation System Tutorial](https://youtu.be/5dTOPen28ts?si=qhYBTACSpeeFZXqk). It shows an industrial approach to content recommendation.


## Table of Contents
- [Table of Contents](#table-of-contents)
- [Steps for Content Recommendation (CR) System](#steps-for-content-recommendation-cr-system)
- [Retrieval](#retrieval)
  - [**Collaborative Filtering (CF):**](#collaborative-filtering-cf)
  - [Discrete Features](#discrete-features)
  - [Matrix Completion](#matrix-completion)
  - [**Deep Structured Semantic Model (DSSM)**](#deep-structured-semantic-model-dssm)



## Steps for Content Recommendation (CR) System
1. **Retrieval** (reduce results from trillions to thousands)
   - It usually combines different methods (e.g., Collaborative Filtering, GNN) to retrieve results and aggregate them.

2. **Pre-Ranking** (reduce results from thousands to hundreds)
   - This is where neural networks are used to predict evaluation metrics (e.g., click-through rate, like rate).

3. **Ranking** (a more complex mechanism to rank results compared to pre-ranking)

4. **Re-Ranking** (reduce results from hundreds to tens)
   - It considers both scores and variety of the results, setting up rules to redistribute similar results.
   - It uses different sampling methods (e.g., MMR, DPP) to reduce results.
   - It also adds advertisements and additional information to the results.



## Retrieval
### **Collaborative Filtering (CF):**
   - This technique relies heavily on user behavior data to make recommendations, but it might be difficult to collect user data.

1. **Item CF:**

   ![Item CF Recall Overview](./images/02_recall_01_itemCF_01.jpg)
   If a user is interested in an item, they are more likely to be interested in similar items.

   ![Item CF Indexes](./images/02_recall_01_itemCF_02.jpg)
   Item CF requires two indexes to store user and item data. It is created and updated offline.
   
- **User-Item Index:** 

   Stores user behavior data (e.g., the past 100 clicks and other interactions) to determine user preferences (i.e., $like(user, item_j)$ ).

- **Item-Item Index:** 
  
   ![Item CF Similarity](./images/02_recall_01_itemCF_03.jpg)
   Stores content data to determine item similarity. When user groups are similar, the item groups are also considered similar. We usually use the Jaccard index or cosine similarity to determine if two items are similar.

- **Retrieval Procedure:**
  
   ![Item CF Retrieval Procedure](./images/02_recall_01_itemCF_04.jpg)
   1. Given a *user_id*, return the ***last-n*** items the user has interacted with through the ***User-Item Index*** (assuming interest in these items).
   2. Using the ***last-n*** items, return the ***top-k*** similar items for each item through the ***Item-Item Index***.
   3. This method returns at most $n \times k$ similar results. It then predicts the interest score for each item.
   4. Return the top 100 results.

- **Misclassification of Similar Items:** 

   ![Item CF Misclassification](./images/02_recall_02_swing_01.jpg)
   Two items may be considered similar if they are interacted with by a small group of users. It's possible that this small group consists of friends or people who share the same information sources through social media or communities. This can lead to misclassification of irrelevant items as similar.

   ![Item CF Swing Model](./images/02_recall_02_swing_02.jpg)
   **Swing Model** is used to identify users from the same group and lower their weightings when calculating the similarity of two items.


2. **User CF:**

   ![User CF Recall Overview](./images/02_recall_03_userCF_01.jpg)
   If users are in the same group, they are more likely to be interested in similar items.

   ![User CF Indexes](./images/02_recall_03_userCF_02.jpg)
   Similar to Item CF, User CF requires two indexes to store user and item data. It is created and updated offline.

- **User-Item Index:**

   Stores user behavior data (e.g., the past 100 clicks and other interactions) to determine user preferences (i.e., $like(user, item_j)$ ).

- **User-User Index:**

   ![User CF Similarity](./images/02_recall_03_userCF_03.jpg)
   Store users similarity. Then, it can be used to determine if two users are similar.

- **Retrieval Procedure:**

   ![User CF Retrieval Procedure](./images/02_recall_03_userCF_04.jpg)
   1. Given a *user_id*, return the ***top-k*** similar users through the ***User-User Index***.
   2. Using the ***top-k*** users, return the ***last-n*** items that each user has interacted with through the ***User-Item Index***.
   3. This method returns at most $n \times k$ similar results. It then predicts the interest score for each item.
   4. Return the top 100 results.

- **Misclassification of Similar Users:**
  
   Two users may be considered similar if they both interacted with popular items (e.g. classic movies, books, music).

   ![Adjusted User Similarity](./images/02_recall_03_userCF_05.jpg)
   We need to lower the weighting of popular items (to reduce the effect to the user similarity).



### Discrete Features
This section will mention how we handle different discrete features (e.g. country, item_id, etc.). Discrete features are discontinuous and have definite features boundaries (i.e. fixed values).

1. **Dictionary:** One simple approach is to build a dictionary to map the features (e.g. China -> 1, US -> 2, India ->3)
2. **One-hot Encoding:** Project features into high dimension vector (e.g. gender: from male/female to 0/1). It creates columns for each feature value. However, when it is used in features with many values, it will create a high dimension vector (e.g. word, id, etc.).
3. **Embedding:** Project features into low dimension vector. It is trained on a large-scale dataset using a deep learning model.


<h4> What is Embedding?</h4>

![Embedding](./images/02_recall_04_DF_01.jpg)
We can use machine learning algorithms to find the parameter matrix that best fits the data (different feature values). Then, we can use the parameter matrix to map the feature values (one-hot encoding) to the embedding vectors. The use case will be explained in the next section, [**Matrix Completion**](#matrix-completion), although it is not used in the industrial approach.



### Matrix Completion
Matrix completion is a technique used to fill in missing values in a matrix. For example, users may only interact with a small number of items (~3% of total items). Matrix completion can be used to fill in the missing values in the matrix. However, this approach is not used in the industry due to serval limitations. We can consider this method as the foundation of another powerful method, [**Deep Structured Semantic Model (DSSM)**](#deep-structured-semantic-model-dssm).



### **Deep Structured Semantic Model (DSSM)**