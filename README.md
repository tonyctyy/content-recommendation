# Content Recommendation System
This project focuses on studying content recommendation systems. Some datasets are very large, so they are not uploaded to GitHub. Use the following [link](https://github.com/tonyctyy/content-recommendation/archive/master.zip) to download the main branch of the repository.

## Table of Contents
- [Content Recommendation System](#content-recommendation-system)
  - [Table of Contents](#table-of-contents)
  - [Useful Links](#useful-links)
  - [Folder Structure](#folder-structure)
    - [data](#data)
    - [docs](#docs)
    - [logs](#logs)
    - [src](#src)
  - [Instructions](#instructions)
  - [Technology Stack](#technology-stack)
  - [Summary (updated on 6/9/2024)](#summary-updated-on-692024)
    - [Content Recommendation System](#content-recommendation-system-1)
    - [Popular Techniques](#popular-techniques)

## Useful Links
- [Trello](https://trello.com/b/5JG6Hmrf/milestones-tasks): Trello board for project management.
- [Perplexity](https://www.perplexity.ai/collections/Content-Recommendation-FYP-r8AxwOpsSAyDXFh7Np00lg): Perplexity is used for research purposes. We have a group chat here for asking questions.
- [Google Drive](https://drive.google.com/drive/folders/1z4Vid9NfHBhHb9hb7fLza9E-zdlkhOt6?usp=drive_link): Google Drive is used for storing zipped/processed datasets.
- [Introduction to Content Recommendation Systems](https://slogix.in/phd-research-topics-in-recommender-systems-based-on-deep-learning/): This website provides a brief introduction to different content recommendation techniques and potential research directions. It’s a good starting point for the project.
- [Dataset for Content Recommendation System (GitHub)](https://github.com/RUCAIBox/RecSysDatasets): This GitHub repository contains various datasets for content recommendation systems.
- [Dataset used in the UCSD laboratory](https://cseweb.ucsd.edu/~jmcauley/datasets.html): This website contains some datasets used by the UCSD laboratory.

## Folder Structure
### data
It includes 3 folders (`processed_datasets`, `raw_datasets`, and `zipped_datasets`) to store different types of datasets. 

### docs
It includes all the documentations and required information for the project.

### logs
It includes all logs related to the project (e.g., dataset information, tutorials, etc.) are stored in the [logs](./logs/README.md) folder. Check the logs for more details.

### src
It includes the source code for the project. The `src` folder will be further divided into the following subfolders:
 - `data_ processing`: Contains scripts for data processing.
 - `modeling`: Contains scripts for building and training models.
 - `backend`: Contains scripts for the backend server.
 - `frontend`: Contains scripts for the frontend application.

## Instructions
We will use the `pipenv` package manager to manage dependencies. To install `pipenv`, run the following command:
```bash
pip install pipenv
```

To install the dependencies, run the following command (make sure you are in the project directory where the `Pipfile` is located):
```bash
pipenv install
```

<h4> Tip: When you want to read a large files, you can use the `chunksize` parameter in `pandas.read_csv()` or `pandas.read_json()` to read the file in chunks. This can help you avoid memory issues. </h4>

## Technology Stack
- **Frontend**: React.js (Alternative: Tailwind CSS)
- **Backend**: Flask.py (Algorithm Implementation: Sklearn, TensorFlow, PyTorch)
- **Database**: TBC
- **Deployment**: AWS/Azure (TBC)

## Summary (updated on 6/9/2024)
The following summary is based on material from the [Red Content Recommendation System Tutorial](logs/RedRS_tutorial/RedRS_tutorial.md). Check it for a comprehensive overview.

### Content Recommendation System
The Content Recommendation System includes several stages:
1. **Retrieval** (reduces results from trillions to thousands)
   - Typically combines different methods (e.g., Collaborative Filtering, GNN) to retrieve results and aggregate them.

2. **Pre-Ranking** (reduces results from thousands to hundreds)
   - Neural networks are used here to predict evaluation metrics (e.g., click-through rate, like rate).

3. **Ranking** (a more complex mechanism for ranking results compared to pre-ranking)

4. **Re-Ranking** (reduces results from hundreds to tens)
   - Considers both scores and variety of the results, setting rules to redistribute similar results.
   - Uses different sampling methods (e.g., MMR, DPP) to reduce results.
   - Adds advertisements and additional information to the results.

### Popular Techniques
- **Collaborative Filtering (CF):** A widely used model in the retrieval stage. Common applications include **Item CF** and **User CF**. CF can be used to construct multiple channels to retrieve related content effectively.
  - **Challenges:**
    - Difficulty in finding user behavior data in open-source datasets.
      1. **Item-Item Collaborative Filtering:** This method only requires content data, making it suitable when user behavior data is unavailable.
      2. **Synthetic User Behavior Data:** Another approach is to generate synthetic user behavior data from available content data (i.e., simulation data that maintains the original properties).
    - Many null data points exist when considering millions of items and users (e.g., User Rating to Movies Matrix).

- **Deep Structured Semantic Model (DSSM):** Another widely used model in the retrieval stage. DSSM is a neural network model that uses a pairwise loss function to learn the similarity between two items.
