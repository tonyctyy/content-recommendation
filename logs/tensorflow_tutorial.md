[Back to Main Page](../README.md)

# 18/6/2024: Tensorflow Tutorial
- [Recommendation System Intro from TensorFlow on YouTube](https://www.youtube.com/watch?v=BthUPVwA59s&list=PLQY2H8rRoyvy2MiyUBz5RWZr5MPFkV3qz&index=2)

## [Tensorflow Recommenders](https://github.com/tensorflow/recommenders)
It is based on Tensorflow 2.0 and Keras. It is an open-source project on Github that provides a set of components for building, evaluating, and deploying recommender models. It aims at covering the entire stack, from retrieval, through ranking, to post-ranking. It integrate with
- **Generative Adversarial Networks (GAN)**: for efficient retrieval
- [**TF-Ranking**](https://github.com/tensorflow/ranking): for efficient ranking
- **TPU**: for training large-scale models

## [ScaNN (Scalable Nearest Neighbors)](https://github.com/google-research/google-research/tree/master/scann)
It can be used to conduct efficient vector similarity search. Modern machine learning models can transform input such as images into embeddings (high-dimensional vectors trained such that more similar inputs cluster close together). Given a query item, we can find the embeddings that are closest to the query item's embedding. ScaNN is designed to

## [Tensorflow Lite](https://github.com/tensorflow/tensorflow/tree/master/tensorflow/lite)
It is a on-device machine learning framework for mobile and embedded devices without network dependency and instant response to user's interaction or context changes.

## [TensorFlow Recommenders Addons](https://github.com/tensorflow/recommenders-addons)
It is a community-driven SIG group focused on large scale recommendation models.
- How to train large-scale sparse models
- How to deal with dynamic embedding
It also includes useful tools such as **Dynamic Embedding** from Tencent and **Embedding Variable** from Alibaba.

