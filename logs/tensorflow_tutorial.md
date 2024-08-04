[Back to Log Page](./README.md) | [Back to Main Page](../../README.md)   

<h1>18/6/2024: TensorFlow Tutorial</h1>

I think this series of tutorials is not very useful as it only covers a very shallow overview. Also, the use cases are very simple in the tutorial, but you can gain a quick understanding of the basic concepts. You can check the videos here: [Recommendation System Intro from TensorFlow on YouTube](https://www.youtube.com/watch?v=BthUPVwA59s&list=PLQY2H8rRoyvy2MiyUBz5RWZr5MPFkV3qz&index=2). I haven't finished this series of tutorials. I stopped at [Deep & Cross Network](https://youtu.be/kUuvRStz7CU?si=ARwgo4SRg6yg-E9C).


## [TensorFlow Recommenders](https://github.com/tensorflow/recommenders)
TensorFlow Recommenders is based on TensorFlow 2.0 and Keras. It is an open-source project on GitHub that provides a set of components for building, evaluating, and deploying recommender models. It aims to cover the entire stack, from retrieval through ranking to post-ranking. It integrates with:
- **Generative Adversarial Networks (GANs)**: for efficient retrieval
- [**TF-Ranking**](https://github.com/tensorflow/ranking): for efficient ranking
- **TPU**: for training large-scale models


## [ScaNN (Scalable Nearest Neighbors)](https://github.com/google-research/google-research/tree/master/scann)
ScaNN can be used to conduct efficient vector similarity search. Modern machine learning models can transform inputs such as images into embeddings (high-dimensional vectors trained such that more similar inputs cluster close together). Given a query item, we can find the embeddings that are closest to the query item's embedding. ScaNN is designed to perform this task efficiently at scale.

Key features of ScaNN:
- High-performance vector similarity search
- Optimized for large-scale datasets
- Supports various distance metrics and search algorithms


## [TensorFlow Lite](https://github.com/tensorflow/tensorflow/tree/master/tensorflow/lite)
TensorFlow Lite is an on-device machine learning framework for mobile and embedded devices. It offers:
- No network dependency
- Instant response to user interactions or context changes
- Reduced latency and improved privacy by keeping data on the device
- Optimized for resource-constrained environments


## [TensorFlow Recommenders Addons](https://github.com/tensorflow/recommenders-addons)
TensorFlow Recommenders Addons is a community-driven SIG (Special Interest Group) focused on large-scale recommendation models. It addresses:
- How to train large-scale sparse models
- How to deal with dynamic embeddings

It also includes useful tools such as:
- **Dynamic Embedding** from Tencent
- **Embedding Variable** from Alibaba

These tools are designed to handle the challenges of large-scale recommendation systems, particularly in dealing with sparse, high-dimensional data and dynamic user behaviors.


## Key Concepts in Recommendation Systems
1. **Embeddings**: Dense vector representations of sparse features (e.g., user IDs, item IDs)
2. **Retrieval**: The process of efficiently finding relevant items from a large corpus
3. **Ranking**: Ordering retrieved items based on their relevance to the user
4. **Evaluation Metrics**: Measures like precision, recall, NDCG (Normalized Discounted Cumulative Gain) to assess model performance
