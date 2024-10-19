[Back to Log Page](./README.md) | [Back to Main Page](../../README.md) 

We has a JupyterHub server setup on a Linux machine (Ubuntu) from the school. It is setup according to the instructions [here](https://github.com/jupyterhub/jupyterhub-the-hard-way/blob/35ddfb49ad81771551c6549696ccec960564d5e4/docs/installation-guide-hard.md). For the detail configuration, you can check below:

## Simple Steps to Access the JupyterHub Server
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

When you are using the Jupyter notebook, please remember to use the `python3.11` kernel.

## Python Environment Setup
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

We are using a `Python 3.11` environment for the project. If you need to install new packages, you have the following options:
- Use the `pip` package manager to install packages globally.
    ```bash
    pip install package_name
    ```
- Use `Conda` to load a specific environment and install packages.
    ```bash
    conda activate python3.11
    ```
    ```bash
    pip install package_name
    ```
- Use `Conda` and `pipenv` to load the project environment and install packages.
    ```bash
    conda activate python3.11
    ```
    make sure you are in the project directory where the `Pipfile` is located:
    ```bash
    cd ~/content-recommendation
    ```
    ```bash
    pipenv install
    ```
    ```bash
    pipenv shell
    ```
    ```bash
    pip install package_name
    ```
You can skip the following sections if you are not familiar with the JupyterHub server setup.

## JupyterHub Server Setup
### JupyterHub Configuration
```bash
/opt/jupyterhub/etc/jupyterhub/
```

### Service Configuration
```bash
/opt/jupyterhub/etc/systemd/jupyterhub.service
```
```bash
[Unit]
Description=JupyterHub
After=syslog.target network.target

[Service]
User=root
Environment="PATH=/bin:/usr/local/sbin:/usr/local/bin:/usr/sbin:/usr/bin:/opt/jupyterhub/bin"
ExecStart=/opt/jupyterhub/bin/jupyterhub -f /opt/jupyterhub/etc/jupyterhub/jupyterhub_config.py

[Install]
WantedBy=multi-user.target
```

### Conda and Kernel Configuration
Conda environment is located at `/opt/conda/envs/python3.11`. We need to install the kernel for the Jupyter notebook.

For a user-specific installation,
```bash
/opt/conda/envs/python3.11/bin/python -m ipykernel install --user --name 'python3.11' --display-name "Python 3.11"
```

For a system-wide installation, you can specify a recognized directory,
```bash
sudo /opt/conda/envs/python3.11/bin/python -m ipykernel install --name 'python3.11' --display-name "Python 3.11"
```

Check kernel list,
```bash
jupyter kernelspec list
```

The kernel we are using is `python3.11`.
```bash
/usr/local/share/jupyter/kernels/python3.11
```