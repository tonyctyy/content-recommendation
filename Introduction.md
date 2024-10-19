[Back to Main Page](./README.md)

## Table of Contents
- [Table of Contents](#table-of-contents)
- [Introduction](#introduction)
  - [1. Local Setup vs Remote Server (UST)](#1-local-setup-vs-remote-server-ust)
  - [2. Development and Testing](#2-development-and-testing)
- [Folder Structure](#folder-structure)
- [Data Sampling](#data-sampling)
- [Item Collaborative Filtering Model (Testing Stage)](#item-collaborative-filtering-model-testing-stage)
  - [Data Loading](#data-loading)
  - [Sparse Cosine Similarity Calculation](#sparse-cosine-similarity-calculation)
  - [Index Table for Results Prediction](#index-table-for-results-prediction)
  - [Predicting Recommendations](#predicting-recommendations)
- [Database Setup](#database-setup)
  - [Indexed Tables](#indexed-tables)
  - [Processed Dataset Table Structures](#processed-dataset-table-structures)
    - [Business Data](#business-data)
    - [User Data](#user-data)
    - [Review Data](#review-data)
    - [Tip Data](#tip-data)
- [Flask Backend Server](#flask-backend-server)

## Introduction
The following sections will use the [Yelp Dataset](./logs/dataset/yelp.md) as an example to demonstrate the system flow and database setup using the **Item-based Collaborative Filtering Model** from [Red Recommendation System Tutorial](./logs/RedRS_tutorial/RedRS_tutorial_Retrieval.md). There are stages you need to go through to undertand the system flow and database setup.

### 1. Local Setup vs Remote Server (UST)
It is recommended to do the whole development using local setup. It is easier to maintain and debug. The reasons to use UST server are:
- In case your local machine does not have enough resources (mainly RAM) to run the model processing/training and indexing functions.
- To access the datasets stored in the UST server. We store the raw and processed datasets in the UST server that can be accessed via the JupyterHub server.

**Local Setup**: You may check the detail setup in this [section](#local-setup). 
1. We will use the `pipenv` package manager to manage dependencies. To install `pipenv`, run the following command:
    ```bash
    pip install pipenv
    ```
    Notice that the package `pipenv` only needs to be installed once. You can skip this step if you have already installed it.

2. To install the dependencies, run the following command (make sure you are in the project directory where the `Pipfile` is located, usually in `C:{custom_path}\content-recommendation`):
    ```bash
    pipenv install
    ```
3. Then, you can run python code using the kernel provided by `pipenv`. Or you can run the following command to enter the virtual environment and run the python code (`.py` files):
    ```bash
    pipenv shell
    ```
    When you are in the pipenv shell, you can run the python code as usual.

The tutorial for the `Flask` backend server is provided in the [Flask Guidebook](./logs/flask_guidebook.md).

**Remote Server Setup**: You may check the detail setup in [Jupyterhub Guidebook](./logs/jupyterhub_guidebook.md).

### 2. Development and Testing
The development and testing of the recommendation system can be done in the local environment. The system flow includes the following stages:
1. **Data Sampling**: The Yelp dataset is sampled to reduce the size of the dataset for faster processing and testing of the recommendation system.
2. **Model Testing**: Use `Jupyter Notebook` to test the calculation and prediction results.
3. **Index Tables**: Create the index tables to store the trained model results for prediction in `SQLite`. If you are using new datasets, it is also suggested to think about the database structure for the UI. (see [Processed Dataset Table Structures](#processed-dataset-table-structures))
4. **Backend Server**: Transfer the model results to the backend server for testing the model results with an UI. (Function -> API Functions in `Flask`)
5. **Frontend**: Develop the frontend to interact with the backend server for the recommendation results. We are now using `Flask` to simply display the results. (Will be migrated to `React.js`)

Now, we can focus on steps 1 to 3 to understand and study different datasets and content recommendation models first.

## Folder Structure
The project folder structure is organized as follows:

```bash
content-recommendation/
│
├── data/
│   ├── processed_data/
│   │   ├── yelp_data/ (Frontend Database)
│   │   │   ├── yelp_business_data.db
│   │   │   ├── yelp_user_data.db
│   │   │   ├── yelp_review_data.db
│   │   │   └── yelp_tip_data.db
|   |   └── yelp_ItemCF.db (Index Table for Item CF)
│   │
│   ├── raw_datasets/
│   │   └── yelp/
│   │       ├── sampled_yelp_academic_dataset_business.json
|   |       ├── sampled_yelp_academic_dataset_review.json
│   │       └── (other raw and sampled datasets)
│   │
├── logs/
│   ├── dataset/
│   │   └── yelp.md (original dataset description)
│   ├── flask_guidebook.md 
│   ├── jupyterhub_guidebook.md
│   └── RedRS_tutorial/
│      └── RedRS_tutorial_Retrieval.md (Item-based CF model Reference)
├── src/
│   ├── backend/ (Flask Backend Server, refer to Flask Guidebook)
│   │   ├── (other Flask files)
│   │   └── app.py
│   │
│   ├── data_processing/
|   |   ├── data_index.ipynb (store the Processed tables for Frontend )
│   │   └── data_sampling.py (Data Sampling Script)
│   │
│   ├── ItemCF_Index.ipynb (Item-based CF Indexing)
│   └── ItemCF_Retrieval.ipynb (Item-based CF Retrieval)
├── README.md (Main Page)
├── Introduction.md (Current File)
└── Pipfile (Package Management)
```

## Data Sampling
The Yelp dataset is sampled to create a smaller subset for faster processing and testing of the recommendation system. The script data_sampling.py provides the following key functionalities:

- **Random Sampling**: The script allows you to randomly sample a specific percentage of records from the large dataset (e.g., reviews, businesses, or users). This is particularly useful for testing without needing to process the entire dataset.

- **Sampling Based on Conditions**: In addition to random sampling, the script supports conditional sampling. For instance, you can filter businesses with a certain number of reviews or users who have interacted with multiple businesses before applying sampling.

- **Configurable Parameters**: You can adjust the sampling rate, target dataset, and conditions by modifying the parameters in the script. This flexibility allows you to adapt the sampling process to different scenarios, such as focusing on highly-rated businesses or active users.

After all sampling process, it will loop the dataset again to ensure all related records are selected. For more details, refer to [data_sampling.py](./src/data_%20processing/data_sampling.py) script.

## Item Collaborative Filtering Model (Testing Stage)
For detail code, please refer to: [Item_CF_Index.ipynb](./src/ItemCF_Index.ipynb) and [Item_CF_Retrieval.ipynb](./src/ItemCF_Retrieval.ipynb).

### Data Loading
The dataset used in this project is the sampled Yelp academic dataset, which includes business and review information.

```python
folder_path = './data/'
transit_bucket = 'raw_datasets/'
target_bucket = 'yelp/'
prefix_path = folder_path + transit_bucket + target_bucket
file_list = [
    "sampled_yelp_academic_dataset_business.json",
    "sampled_yelp_academic_dataset_review.json",
]

df = load_dataset(file_list, prefix_path)
df_business = df["sampled_yelp_academic_dataset_business.json"]
df_review = df["sampled_yelp_academic_dataset_review.json"]
```

### Sparse Cosine Similarity Calculation
The system calculates the cosine similarity between items based on user ratings. We use Sparse Matrix Multiplication to compute the similarity matrix efficiently (avoid calculating the similarity between all pairs of items).

``` python
def sparse_cosine_similarity_topn(A, top_n, threshold=0):
    C = sp_matmul_topn(A.T, A.T, top_n=top_n, threshold=threshold, n_threads=4, sort=True)
    return C
```

### Index Table for Results Prediction
After calculating the similarity matrix, we create index tables to store:
  1. the user-item interactions
  2. item-item similarity vectors
  3. business mapping for numerical indexing

These tables are used for predicting recommendations. You can refer to the section on [Database Setup](#database-setup) for more details on setting up the database.

### Predicting Recommendations
The system will take a user ID as input and predict the top N recommendations for that user based on the item-item similarity matrix. It can be further optimized by sorting the date of the review or the mechanism of considering score 1/2 as negative feedback.


## Database Setup
The project uses SQLite to store user-item interactions and item-item similarities. The following code sets up the database and creates necessary tables.

``` python
db_path = './data/processed_data/yelp_ItemCF.db'
conn = sqlite3.connect(db_path)
cursor = conn.cursor()
```

### Indexed Tables
The following indexed tables are created to facilitate efficient queries:

1. **user_item_index**: Stores user-item interactions with the following schema:
   - `user_id` (TEXT): Unique identifier for the user.
   - `business_id` (TEXT): Unique identifier for the business.
   - `stars_review` (REAL): Rating given by the user to the business.
   - **Primary Key**: (user_id, business_id)

    ``` sql
   CREATE TABLE IF NOT EXISTS user_item_index (
       user_id TEXT,
       business_id TEXT,
       stars_review REAL,
       PRIMARY KEY (user_id, business_id)
   )
    ```

2. **item_item_similarity**: Stores the similarity vectors between items with the following schema:
   - `item_id` (TEXT): Unique identifier for the item (business).
   - `similarity_vector` (BLOB): Serialized similarity vector for the item.
   - **Primary Key**: item_id

    ``` sql
   CREATE TABLE IF NOT EXISTS item_item_similarity (
       item_id TEXT PRIMARY KEY,
       similarity_vector BLOB
   )
    ```

3. **business_mapping**: Maps business IDs to numerical indices with the following schema (for vectorized operations):
   - `business_id` (TEXT): Unique identifier for the business.
   - `business_idx` (INTEGER): Numerical index for the business.
   - **Primary Key**: business_id

    ``` sql
   CREATE TABLE IF NOT EXISTS business_mapping (
       business_id TEXT PRIMARY KEY,
       business_idx INTEGER
   )
    ```

### Processed Dataset Table Structures
This section describes the table structures of the processed dataset stored in the SQLite database which is used for front-end application development.

#### Business Data

**Table Name:** `business_details`  
**Location:** `../../data/processed_data/yelp_data/yelp_business_data.db`

| Column Name   | Data Type | Description                                   |
|---------------|-----------|-----------------------------------------------|
| business_id   | TEXT      | Unique identifier for each business          |
| name          | TEXT      | Name of the business                          |
| address       | TEXT      | Street address of the business                |
| city          | TEXT      | City where the business is located            |
| state         | TEXT      | State where the business is located           |
| postal_code   | TEXT      | Postal code of the business                   |
| latitude      | REAL      | Latitude coordinate of the business location   |
| longitude     | REAL      | Longitude coordinate of the business location  |
| stars         | REAL      | Average star rating of the business           |
| review_count  | INTEGER   | Number of reviews for the business            |
| is_open       | INTEGER   | Indicator of whether the business is open (1) or closed (0) |
| attributes    | TEXT      | Attributes of the business stored as a string |
| hours         | TEXT      | Operating hours of the business stored as a string |

**Table Name:** `business_categories`  
**Location:** `../../data/processed_data/yelp_data/yelp_business_data.db`

| Column Name   | Data Type | Description                                   |
|---------------|-----------|-----------------------------------------------|
| business_id   | TEXT      | Foreign key referencing `business_details`    |
| category      | TEXT      | Category of the business                       |

**Table Name:** `checkin_data`  
**Location:** `../../data/processed_data/yelp_data/yelp_business_data.db`

| Column Name   | Data Type | Description                                   |
|---------------|-----------|-----------------------------------------------|
| business_id   | TEXT      | Foreign key referencing `business_details`    |
| checkin_date  | TEXT      | Date of check-in (format: YYYY-MM-DD HH:MM:SS) |

#### User Data

**Table Name:** `user_data`  
**Location:** `../../data/processed_data/yelp_data/yelp_user_data.db`

| Column Name         | Data Type | Description                                   |
|---------------------|-----------|-----------------------------------------------|
| user_id             | TEXT      | Unique identifier for each user               |
| name                | TEXT      | Name of the user                              |
| review_count        | INTEGER   | Number of reviews written by the user        |
| yelping_since       | TEXT      | Date when the user joined (format: YYYY-MM) |
| useful              | INTEGER   | Useful votes received                          |
| funny               | INTEGER   | Funny votes received                           |
| cool                | INTEGER   | Cool votes received                            |
| fans                | INTEGER   | Number of fans                                |
| average_stars       | REAL      | Average star rating given by the user        |
| friends             | TEXT      | List of friends stored as a string            |
| elite               | TEXT      | Years the user was elite stored as a string   |
| compliment_hot      | INTEGER   | Number of hot compliments received             |
| compliment_more     | INTEGER   | Number of more compliments received            |
| compliment_profile   | INTEGER   | Number of profile compliments received         |
| compliment_cute     | INTEGER   | Number of cute compliments received            |
| compliment_list     | INTEGER   | Number of list compliments received            |
| compliment_note     | INTEGER   | Number of note compliments received            |
| compliment_plain    | INTEGER   | Number of plain compliments received           |
| compliment_cool     | INTEGER   | Number of cool compliments received            |
| compliment_funny    | INTEGER   | Number of funny compliments received           |
| compliment_writer   | INTEGER   | Number of writer compliments received          |
| compliment_photos   | INTEGER   | Number of photo compliments received           |

#### Review Data

**Table Name:** `review_data`  
**Location:** `../../data/processed_data/yelp_data/yelp_review_data.db`

| Column Name   | Data Type | Description                                   |
|---------------|-----------|-----------------------------------------------|
| review_id     | TEXT      | Unique identifier for each review             |
| user_id       | TEXT      | Foreign key referencing `user_data`           |
| business_id   | TEXT      | Foreign key referencing `business_details`    |
| stars         | REAL      | Star rating given in the review               |
| date          | TEXT      | Date of the review (format: YYYY-MM-DD HH:MM:SS) |
| text          | TEXT      | Review text                                   |
| useful        | INTEGER   | Useful votes received                          |
| funny         | INTEGER   | Funny votes received                           |
| cool          | INTEGER   | Cool votes received                            |

#### Tip Data

**Table Name:** `tip_data`  
**Location:** `../../data/processed_data/yelp_data/yelp_tip_data.db`

| Column Name         | Data Type | Description                                   |
|---------------------|-----------|-----------------------------------------------|
| user_id             | TEXT      | Foreign key referencing `user_data`           |
| business_id         | TEXT      | Foreign key referencing `business_details`    |
| text                | TEXT      | Tip text                                      |
| date                | TEXT      | Date of the tip (format: YYYY-MM-DD HH:MM:SS) |
| compliment_count     | INTEGER   | Number of compliments received for the tip     |

## Flask Backend Server
To go through the Flask backend server setup, you can refer to the [Flask Guidebook](./logs/flask_guidebook.md). The Flask server will be used to interact with the front-end application for displaying the recommendation results.