# 🌌 NASA Weather App

A collaborative hackathon project built with **Next.js (Frontend)**, **FastAPI (Backend)**, and **Python Data Analysis**.  
This app fetches and visualizes NASA weather data, provides probability analysis, and offers a responsive dashboard UI.

---

## 📌 Project Description

The **NASA Weather App** combines multiple components:  

- **Frontend (Next.js + Tailwind CSS)** → Interactive dashboard and UI.  
- **Backend (FastAPI)** → APIs to fetch, process, and serve NASA weather data.  
- **Data Analysis (Python, Pandas, NumPy)** → Statistical and probability calculations on weather datasets.  

The goal is to create an integrated platform where different team members (Frontend, Backend, Data) can collaborate seamlessly.

---

## 🚀 Tech Stack

- **Frontend**: Next.js, Tailwind CSS  
- **Backend**: FastAPI (Python)  
- **Data Analysis**: Python (Pandas, NumPy)  
- **Version Control**: Git + GitHub  
- **Collaboration**: GitHub CLI (`gh`) or plain `git`  

---

## ⚡ Getting Started

Clone the repository and install dependencies:

```bash
git clone https://github.com/<your-username>/nasa-weather-app.git
cd nasa-weather-app

# Frontend
cd frontend
npm install
npm run dev

# Backend
cd backend
pip install -r requirements.txt
uvicorn main:app --reload

# Data Analysis
cd analysis
pip install -r requirements.txt
python data_analysis.py

```


## Contribution Guidelines

Thank you for contributing! Please follow these simple steps:

---

### 1. Fork the Repository
Click the **Fork** button on the top right of this repo to copy it to your GitHub account.

---

### 2. Clone Your Fork
Clone your forked repository to your local machine:

```
git clone https://github.com/marjan-ahmed/nasa-weather-probability-app.git
cd nasa-weather-probability-app
```

---

### 3. Create a Branch

Always create a new branch before making changes.

For a new feature:

```bash
git checkout -b feat/feature-name
```

#### For fixing an issue:

```bash
git checkout -b fix/short-issue-description
```

Example: fix/button-alignment or feat/login-ui

### 4. Make Your Changes

Edit, add, or improve the code as needed.

5. Commit Your Work

Stage and commit your changes with a meaningful message:

```bash
git add .
git commit -m "feat: added login UI"   # example commit message
```

6. Push Your Branch

Push your branch to GitHub:

```bash
git push origin your-branch-name
```

### 8. What Happens Next

If your code looks good, I will:

```git bash
git checkout main
git pull origin main          # update local main
git merge your-branch-name    # merge your feature/fix branch
git push origin main          # push updated main
```

## And If you want to see my or any other collaborator code in you editor

- you should know the branch name (you can ask from the member to tell)
- if you want to see the owner's (mine) code changes, the branch would be  `main`

  ```bash
  git checkout main → switches to the main branch but you can't see your code because I have switeched to another branch.
  ```
  
  but if you want that switched branch code should be added in your code, write the script below
  ```
  git pull origin main → pulls the latest changes from the owner’s main branch into their local main.
  ```

🎉 Your contribution will now be part of the project!
