We has a JupyterHub server setup on a Linux machine (Ubuntu) from the school. It is setup according to the instructions [here](https://github.com/jupyterhub/jupyterhub-the-hard-way/blob/35ddfb49ad81771551c6549696ccec960564d5e4/docs/installation-guide-hard.md). For the detail configuration, you can check below:

## Python Environment Setup
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