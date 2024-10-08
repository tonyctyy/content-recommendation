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
    - [Local Setup](#local-setup)
    - [Dedicated Server](#dedicated-server)
      - [JupyterHub Server Setup](#jupyterhub-server-setup)
      - [Python Environment Setup](#python-environment-setup)
      - [Git Repository](#git-repository)
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
It includes `processed_datasets` and `raw_datasets` to store different datasets. 

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
 - `archive`: Contains old scripts that are no longer in use.

## Instructions
### Local Setup
1. We will use the `pipenv` package manager to manage dependencies. To install `pipenv`, run the following command:
    ```bash
    pip install pipenv
    ```
2. To install the dependencies, run the following command (make sure you are in the project directory where the `Pipfile` is located):
    ```bash
    pipenv install
    ```
3. Then, you can run python code using the kernel provided by `pipenv`. Or you can run the following command to enter the virtual environment and run the python code (`.py` files):
    ```bash
    pipenv shell
    ```

### Dedicated Server
#### JupyterHub Server Setup
We host a JupyterHub server using Linux machine from the school. It is useful when you need run model-processing that takes a long time. Also, we can access the datasets on the server. It is accessible via the following steps:
1. Connect to the HKUST VPN (refer to the following links).
   - [HKUST VPN Installation](https://itsc.hkust.edu.hk/services/cyber-security/vpn/client-installation?check_logged_in=1)
   - [HKUST VPN Connection](https://itsc.hkust.edu.hk/services/cyber-security/vpn/connection-establishment)
2. Open the terminal in administrator mode. (i.e., `cmd` -> right-click -> Run as administrator)
3. Run the following command to connect to the server:
    ```bash
    ssh -L 8000:localhost:8000 iefyp2024@iez177.ieda.ust.hk
    ```
    with the password: `FYPoct2024`
4. Access the JupyterHub server by opening a browser and entering the following URL:
    ```bash
    http://127.0.0.1:8000/user/iefyp2024/lab
    ```
    with the account: `iefyp2024` and the password: `FYPoct2024` (may consider adding new users in the future).

#### Python Environment Setup
If you need to check the packages installed in the JupyterHub server, you can run the following command in the Jupyter notebook: `!pip list`.

If you need to install new packages, you can simply use the `!pip install package_name` command in the Jupyter notebook. If you need to install new packages globally, please refer to the [JupyterHub Guidebook](docs/jupyterhub_guidebook.md).

#### Git Repository
The project is stored in the following directory:
```bash
/home/iefyp2024/content-recommendation
```
or 
```bash
~/content-recommendation
```

You can pull the latest changes from the GitHub repository using the following command:
```bash
cd ~/content-recommendation
git pull
```

To push your changes to the GitHub repository, use the following commands:
```bash
cd ~/content-recommendation
git add .
git commit -m "Your commit message"
git push
```

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
