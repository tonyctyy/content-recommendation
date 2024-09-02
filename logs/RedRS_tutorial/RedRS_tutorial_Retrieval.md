[Back to RedRS_Tutorial Page](./RedRS_Tutorial.md) | [Back to Main Page](../../../README.md)

<h1> Retrieval Stage</h1>

# Table of Contents
- [Table of Contents](#table-of-contents)
  - [Collaborative Filtering (CF)](#collaborative-filtering-cf)
    - [Item CF](#item-cf)
    - [User CF](#user-cf)
  - [Discrete Features](#discrete-features)
    - [What is Embedding?](#what-is-embedding)
  - [Matrix Completion \& Approximate Nearest Neighbor (ANN) Search](#matrix-completion--approximate-nearest-neighbor-ann-search)
    - [Steps for Matrix Completion:](#steps-for-matrix-completion)
    - [Limitations:](#limitations)
    - [How to use the model:](#how-to-use-the-model)
    - [Approximate Nearest Neighbor (ANN) Search](#approximate-nearest-neighbor-ann-search)
  - [Deep Structured Semantic Model (DSSM)](#deep-structured-semantic-model-dssm)
    - [Overview](#overview)
      - [How to handle user/item features:](#how-to-handle-useritem-features)
      - [Training DSSM:](#training-dssm)
      - [How to select the sample items:](#how-to-select-the-sample-items)
      - [Pointwise](#pointwise)
      - [Pairwise](#pairwise)
      - [Listwise](#listwise)
      - [Non-Retrieval DSSM](#non-retrieval-dssm)
    - [Positive \& Negative Sample](#positive--negative-sample)
      - [Positive Sample](#positive-sample)
      - [Negative Sample](#negative-sample)
      - [1. All Items](#1-all-items)
      - [2. Batch Negative Items](#2-batch-negative-items)
      - [Training Negative Sample](#training-negative-sample)
    - [Production Environment](#production-environment)
      - [Using the DSSM Model in a Production Environment:](#using-the-dssm-model-in-a-production-environment)
      - [Model Updates](#model-updates)
    - [Self-Supervised Learning](#self-supervised-learning)
      - [Listwise Training \& Cross-Entropy Loss Function](#listwise-training--cross-entropy-loss-function)
      - [Applying Self-Supervised Learning in Item Tower:](#applying-self-supervised-learning-in-item-tower)
      - [Feature Transformation](#feature-transformation)
      - [Training the Item Tower](#training-the-item-tower)
      - [Combining with the DSSM Model](#combining-with-the-dssm-model)


## Collaborative Filtering (CF)
- This technique relies heavily on user behavior data to make recommendations, which can be difficult to collect.

### Item CF
![Item CF Retrieval Overview](./images/02_retrieval_01_itemCF_01.jpg)
If a user is interested in an item, they are more likely to be interested in similar items.

![Item CF Indexes](./images/02_retrieval_01_itemCF_02.jpg)
Item CF requires two indexes to store user and item data. These indexes are created and updated offline.

- **User-Item Index:**
  Stores user behavior data (e.g., the past 100 clicks and other interactions) to determine user preferences (i.e., $like (user, item_j)$).

- **Item-Item Index:**
  ![Item CF Similarity](./images/02_retrieval_01_itemCF_03.jpg)
  Stores content data to determine item similarity. When user groups are similar, the item groups are also considered similar. The Jaccard index or cosine similarity is usually used to determine if two items are similar.

- **Retrieval Procedure:**
  ![Item CF Retrieval Procedure](./images/02_retrieval_01_itemCF_04.jpg)
  1. Given a `user_id`, return the `last-n` items the user has interacted with through the `User-Item Index` (assuming interest in these items).
  2. Using the `last-n` items, return the `top-k` similar items for each item through the `Item-Item Index`.
  3. This method returns at most $n \times k$ similar results. It then predicts the interest score for each item.
  4. Return the top 100 results.

- **Misclassification of Similar Items:**
  ![Item CF Misclassification](./images/02_retrieval_02_swing_01.jpg)
  Two items may be considered similar if they are interacted with by a small group of users. It's possible that this small group consists of friends or people who share the same information sources through social media or communities. This can lead to the misclassification of irrelevant items as similar.

  ![Item CF Swing Model](./images/02_retrieval_02_swing_02.jpg)
  The **Swing Model** is used to identify users from the same group and lower their weightings when calculating the similarity of two items.

### User CF
![User CF Retrieval Overview](./images/02_retrieval_03_userCF_01.jpg)
If users are in the same group, they are more likely to be interested in similar items.

![User CF Indexes](./images/02_retrieval_03_userCF_02.jpg)
Similar to Item CF, User CF requires two indexes to store user and item data. These indexes are created and updated offline.

- **User-Item Index:**
  Stores user behavior data (e.g., the past 100 clicks and other interactions) to determine user preferences (i.e., $like(user, item_j)$).

- **User-User Index:**
  ![User CF Similarity](./images/02_retrieval_03_userCF_03.jpg)
  Stores user similarity data, which can then be used to determine if two users are similar.

- **Retrieval Procedure:**
  ![User CF Retrieval Procedure](./images/02_retrieval_03_userCF_04.jpg)
  1. Given a *user_id*, return the `top-k` similar users through the `User-User Index`.
  2. Using the `top-k` users, return the `last-n` items that each user has interacted with through the `User-Item Index`.
  3. This method returns at most $n \times k$ similar results. It then predicts the interest score for each item.
  4. Return the top 100 results.

- **Misclassification of Similar Users:**
  Two users may be considered similar if they both interacted with popular items (e.g., classic movies, books, music).

  ![Adjusted User Similarity](./images/02_retrieval_03_userCF_05.jpg)
  To reduce the effect of popular items on user similarity, we need to lower their weighting.

## Discrete Features
This section discusses how to handle different discrete features (e.g., country, item_id, etc.). Discrete features are discontinuous and have definite feature boundaries (i.e., fixed values).

1. **Dictionary:** One simple approach is to build a dictionary to map the features (e.g., China -> 1, US -> 2, India -> 3).
2. **One-hot Encoding:** Project features into high-dimensional vectors (e.g., gender: from male/female to 0/1). It creates columns for each feature value. However, when used with features that have many values, it will create a high-dimensional vector (e.g., word, id, etc.).
3. **Embedding:** Project features into low-dimensional vectors. It is trained on a large-scale dataset using a deep learning model.

### What is Embedding?
![Embedding](./images/02_retrieval_04_DF_01.jpg)
We can use machine learning algorithms to find the parameter matrix that best fits the data (different feature values). Then, we can use the parameter matrix to map the feature values (one-hot encoding) to the embedding vectors. The use case will be explained in the next section, [Matrix Completion](#matrix-completion--approximate-nearest-neighbor-ann-search), although it is not used in the industrial approach.

## Matrix Completion & Approximate Nearest Neighbor (ANN) Search
Matrix completion is a technique used to fill in missing values in a matrix. For example, users may only interact with a small number of items (~3% of total items). Matrix completion can be used to fill in the missing values in the matrix. However, this approach is not used in the industry due to several limitations. We can consider this method as the foundation of another powerful method, [Deep Structured Semantic Model (DSSM)](#deep-structured-semantic-model-dssm).

### Steps for Matrix Completion:
![Matrix Completion](./images/02_retrieval_05_MC_01.png)
We train the embedding layers for user_id and item_id respectively. Then, we can get the inner product of the two vectors.

![Training Matrix Completion](./images/02_retrieval_05_MC_02.png)
We solve the minimization problem to get the optimized vectors A and B.

![Matrix Completion Result](./images/02_retrieval_05_MC_03.png)
The final matrix can show user interest in different items.

### Limitations:
![Limitations](./images/02_retrieval_05_MC_04.png)
- The model doesn’t consider other important features (e.g., item property, user attributes, etc.).
- The model doesn’t have a good negative samples mechanism. It counts towards no interaction, which is an indirect source of information.

![Limitations](./images/02_retrieval_05_MC_05.png)
- The model uses inner product while cosine similarity is the widely-used calculation method. Also, it uses Mean Square Error (MSE) instead of Cross Entropy as the loss function in the minimization problem. Cross Entropy is a better function for discrete or categorical features, while Mean Square Error is more suitable for continuous features.

### How to use the model:
![How to use the model](./images/02_retrieval_05_MC_06.png)
We store the optimized vectors A and B in the index table. Then, we can use the user_id as the key to retrieve the optimized vectors. Finally, we can get the inner product of the two vectors to get the interest score of the user in the item.
   - However, if we calculate the interest score of all users in the item, it will be too slow. We should use the **Approximate Nearest Neighbor (ANN) Search** to accelerate the calculation.

### Approximate Nearest Neighbor (ANN) Search
Systems that support ANN: Milvus, Faiss, HnswLib, etc.

Methods to find the nearest neighbors:
- Euclidean Distance (L2 norm)
- Inner Product
- Cosine Similarity

![ANN Search](./images/02_retrieval_05_MC_07.png)
Depending on the method we choose, we will have different shapes of areas for the vector results (e.g., Cosine Similarity -> Sector) when we pre-process the data. We can calculate the inner product of the two vectors to get the interest score of the user in the item. We can then find the nearest neighbors vector and get all the results through an index table.

## Deep Structured Semantic Model (DSSM)
### Overview
#### How to handle user/item features:
![How to handle user features](./images/02_retrieval_06_DSSM_01.png)

![How to handle item features](./images/02_retrieval_06_DSSM_02.png)
1. `user_id` -> Embedding Layer -> `user_id_vector`
2. `user_discrete_feature` -> Embedding Layer (one layer for each feature; for features that have few values, we can use one-hot encoding) -> `user_df_vector`
3. `user_continuous_feature` -> Standardization (mean = 0, standard deviation = 1)/Log Transformation/Bucketing -> `user_cf_vector`
4. Concatenate `user_id_vector`, `user_df_vector`, `user_cf_vector` -> Neural Network -> `user_vector` (user characterization)

![DSSM](./images/02_retrieval_06_DSSM_03.png)
After the user vector and the item vector are generated, we can calculate the inner product of the two vectors to get the interest score of the user in the item.

#### Training DSSM:
![Training DSSM](./images/02_retrieval_06_DSSM_04.png)
1. **Pointwise:** Consider all positive and negative samples in the training set. Then, perform binary classification by randomly sampling in the training set (can be +ve/-ve).
2. **Pairwise:** Consider all positive and negative pairs (+ve, -ve) in the training set. Use a triplet loss function to calculate the loss and train the model. (Refer to **Facebook**, [Embedding-based Retrieval in Facebook Search](https://dl.acm.org/doi/abs/10.1145/3394486.3403305))
3. **Listwise:** Consider a positive and some negative samples list [+ve, -ve, -ve, ...] in the training set. The training method is similar to the Pairwise method. (Refer to **YouTube**, [Sampling-Bias-Corrected Neural Modeling for Large Corpus Item Recommendations](https://research.google/pubs/sampling-bias-corrected-neural-modeling-for-large-corpus-item-recommendations/))

#### How to select the sample items:
![How to select the sample items](./images/02_retrieval_06_DSSM_05.png)
- **Positive Sample:** User-interacted item
- **Negative Sample:** Non-retrieved item, retrieved but filtered out item (by Ranking/Re-Ranking), exposed but not clicked item
For details, please check [Positive & Negative Sample](#positive--negative-sample).

#### Pointwise
![Pointwise](./images/02_retrieval_06_DSSM_06.png)
$a$ and $b$ are the vectors of the user and item respectively.
- Consider retrieval as a binary classification problem.
- For +ve sample, reward $cos(a, b)$ -> 1.
- For -ve sample, reward $cos(a, b)$ -> -1.
- Control the ratio of +ve sample and -ve sample to 1:2 or 1:3 (no special reason).

#### Pairwise
![Pairwise](./images/02_retrieval_06_DSSM_07.png)
Calculate the +ve and -ve samples simultaneously using the same embedding layer.
![Maximize Margin for Triplet Hinge Loss](./images/02_retrieval_06_DSSM_08.png)
We aim to maximize the difference between the similarity of the +ve and -ve samples. **Triplet Hinge Loss** is used to calculate the loss and train the model. ($m$ is the hyperparameter)
![Triplet Logistic Loss](./images/02_retrieval_06_DSSM_09.png)
We can also use **Triplet Logistic Loss** to calculate the loss and train the model. ($\sigma$ is the hyperparameter; if you want to understand more about the entropy loss function, you can check [here](https://youtu.be/YtebGVx-Fxw?si=2o5PsffHfAkVqnbq).)

#### Listwise
![Listwise](./images/02_retrieval_06_DSSM_10.png)
We aim to maximize the similarity of +ve samples and minimize the similarity of -ve samples. We use **Softmax Loss** to calculate the loss and train the model.

#### Non-Retrieval DSSM
First, conduct the feature embedding and then calculate the inner product of the two vectors to get the interest score of the user in the item. If the model concatenates the user vector and the item vector first and passes it through the neural network, it is a **Ranking** model instead.

### Positive & Negative Sample
The purpose of the Retrieval Stage is to classify items into those that the user may be interested in and those that they are not interested in, without the need to rank them. Improving the selection of positive and negative samples is crucial for the effectiveness of this stage.

#### Positive Sample

**Problem: Pareto Principle** (20% of items can cover 80% of needs)

Including too many popular items in the positive sample can lead to a self-reinforcing cycle. Popular items will become even more prominent, suppressing other items and harming the system's ability to surface diverse or lesser-known content.

**Solution**:
- **Up-sampling**: Duplicate less-popular items.
- **Down-sampling**: Discard some popular items, with the probability of discarding an item being positively correlated with its popularity.

#### Negative Sample

**Easy Sample** (Items that are not Retrieved)

#### 1. All Items

Since only thousands of items are retrieved from millions, we can assume users are not interested in the vast majority of items. We can perform negative sampling across all items.

![Easy Sample](./images/02_retrieval_07_sampling_01.png)

**Problem**: Sampling all items equally weighted is unfair because most items are unpopular. This imbalance causes most positive items to be popular and negative items to be unpopular, leading to the same self-reinforcing cycle.

**Solution**: Weight the selection probability of an item based on its popularity.

$$
p \propto (\text{click-rate})^{0.75}
$$

#### 2. Batch Negative Items

We can also consider negative samples in different batches. For example, if a user clicks `item_A`, we can create a batch from `item_B` to `item_N`. For $N$ items and $N$ users, this results in $n(n-1)$ negative items.

![Batch Negative Items](./images/02_retrieval_07_sampling_02.png)

**Problem**: 

$$
p \not\propto (\text{click-rate}^{0.75})
$$

Instead,

$$
p \propto \text{click-rate}
$$

The probability of selecting a popular item as a negative sample is too high, affecting model performance.

![Problem](./images/02_retrieval_07_sampling_03.png)

**Solution**: According to a [previous paper]((https://research.google/pubs/sampling-bias-corrected-neural-modeling-for-large-corpus-item-recommendations/)) by **YouTube**, we can add $-\log p$ to the formula of user interest.

**Hard Sample** (Items that are retrieved but discarded by the **Pre-Rank Stage**/**Ranking Stage**)

The Retrieval Stage aims to classify items the user may be interested in or not. However, it is challenging to classify items discarded in the **Pre-Rank Stage**, and even harder for those lower ranked in the **Ranking Stage**. Therefore, hard samples should also be considered in the negative sample.

**Exposed but Not-Clicked Items**

![Exposed but Not-Clicked Items](./images/02_retrieval_07_sampling_04.png)

While it makes sense to include exposed but not-clicked items as negative samples, it can harm the model's effectiveness. Remember, the purpose of the **Retrieval Stage** is not to rank items; this method is used in the **Ranking Stage**.

#### Training Negative Sample

Different negative samples should be included in training. A common approach is to use 50% easy samples (All Items) and 50% hard samples (Items that are retrieved but discarded by the **Pre-Rank Stage**/**Ranking Stage**).


### Production Environment

#### Using the DSSM Model in a Production Environment:

- **Item Index:**  
  Store the `item_id` and corresponding `item_vector` in an index table. Real-time calculation is too computationally expensive, so in production, use Approximate Nearest Neighbor (ANN) Search to return the $n$ nearest results for a given `user_vector` or `query_vector`.

  *Note: You can use vector databases such as Milvus, Faiss, or HNSWlib.*

- **User Index:**  
  Calculate the `user_vector` in real-time since it changes frequently, and the most recent interaction records are typically more significant for accurate measurement.

#### Model Updates

- **Regular Update:**  
  Perform incremental training on top of the existing model (rather than reinitializing all parameters) using the previous day's data as one epoch (daily data is used only once). After training, update the `item_vector` index and user index tables.

  **Training Time:** Midnight (Batch Update)

- **Dynamic Update:**  
  Train the model in a real-time environment to better adapt to user interests. This process involves generating TFRecord files for training, then updating only the model’s `ID Embedding` parameters (without retraining other parts of the neural network). Finally, update the new user `ID Embedding` for real-time application.

  **Limitation:** There may be latency issues when updating records.

  **Training Time:** Real-Time Update

- **Industrial Approach:**  
  Combine both **Regular Update** and **Dynamic Update**. At the end of each day, discard the results of the **Dynamic Update** and perform the **Regular Update**.

- **Why Not Use Only the Dynamic Update?**  
  While the computational cost of relying solely on **Dynamic Update** is lower, performance is generally worse compared to the hybrid approach. This is due to several factors:
    1. **Time Interval Differences (Hour/Minute):** User interests can vary significantly between different times of the day, such as morning versus night.
    2. **Data Shuffling:** **Regular Update** shuffles the daily data randomly for 1-epoch training, leading to better performance. In contrast, **Dynamic Update** trains in a sequence that follows the timeliness of the data, which may result in less effective learning.

### Self-Supervised Learning
Self-supervised learning aims to enhance the training performance of the item tower, especially for less popular items, by addressing the [Pareto Principle](#positive-sample) problem through data augmentation. This principle often results in poor performance for unpopular items. For more details, refer to **Google**'s paper: [Self-supervised Learning for Large-scale Item Recommendations](https://dl.acm.org/doi/abs/10.1145/3459637.3481952).

#### Listwise Training & Cross-Entropy Loss Function
The following section reviews the use of the [Listwise](#training-dssm) method for training DSSM and the associated [Cross-Entropy Loss Function](#listwise).

![Listwise Training](images/02_retrieval_09_SSL_01.png)
![Cross-Entropy Loss](images/02_retrieval_09_SSL_02.png)

Listwise training can be viewed as [Batch Negative Items](#2-batch-negative-items), which can disproportionately penalize popular items, negatively affecting overall performance. To address this, it's essential to adjust the equation accordingly:

![Batch Negative Items](images/02_retrieval_09_SSL_03.png)

#### Applying Self-Supervised Learning in Item Tower:
For each item, we can create different `item_vectors` by extracting various features or applying random masking. The goal is to reward or penalize based on specific scenarios.

![Reward Similar Item Vector](images/02_retrieval_09_SSL_04.png)

The diagram above shows that we should reward similar `item_vectors` derived from the same item, while also rewarding dissimilar `item_vectors` generated from different items.

#### Feature Transformation
- **Random Mask:** Randomly mask some discrete features of an item (e.g., `{digital, photograph}` becomes `{default}`).
- **Dropout:** Applicable only to multi-valued features; randomly masks **50%** of the features (e.g., `{cosmetic, photograph}` becomes `{cosmetic}`).
- **Complementary:** Masks specific features and generates a new `item_vector` accordingly.
  ![Complementary](images/02_retrieval_09_SSL_05.png)
- **Cover Related Feature Sets:** Masks some related feature sets:
  - Sexual Features: $U = \lbrace male, female, other \rbrace$
  - Categories: $V = \lbrace cosmetic, digital, football, tech, ... \rbrace$

  ![Mutual information](images/02_retrieval_09_SSL_06.png)

  When there are $k$ feature sets, calculate the **Mutual Information (MI)** between each set to get a $k \times k$ MI matrix. Randomly select a base feature set (e.g., Category) and identify the top $k/2$ most related feature sets. Finally, mask both the base feature set and these $k/2$ related feature sets.

  - **Advantages:** Yields the best performance among all methods.
  - **Disadvantages:** Complicated to compute and challenging to maintain. (Do we need to consider maintainability?)

#### Training the Item Tower
1. Randomly sample $m$ items (with equal probability, independent of `user-item` pairs) to form a batch.
2. Perform Feature Transformation to generate 2 `item_vectors`.
3. Compute the loss function.

![Loss Function for Item Tower](images/02_retrieval_09_SSL_07.png)

For each item, there is one positive sample (same item but different `item_vectors` due to Feature Transformation, with a probability $s_{(i,i)} \approx 1$) and $m-1$ negative samples. The aim is for the `s_vector` (training result) to be close to the `y_vector` (target vector). We take the average loss for the $m$ items and use **Gradient Descent** to solve the minimization problem.

#### Combining with the DSSM Model
1. Randomly sample $n$ `user-item` pairs to form a batch.
2. Randomly sample $m$ items (with equal probability) to form a batch.
3. Apply **Gradient Descent** to minimize the combined loss function (the second part is from Self-Supervised Learning):

$$
{1 \over n} \sum^n_{i=1} L_{main}[i] + \alpha \times {1 \over m} \sum^m_{j=1} L_{self}[j]
$$
