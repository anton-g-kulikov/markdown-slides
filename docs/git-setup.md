# Git Repository Setup

This document explains how to set up the Git repository for the Markdown Slides project.

## Initial Setup

If you're setting up the Git repository for the first time, follow these steps:

1. Create a new repository on GitHub named `vibecoding-slides` (or your preferred name)
2. Initialize Git in your local project folder (if not already done):
   ```bash
   git init
   ```
3. Add the remote repository:
   ```bash
   git remote add origin https://github.com/YOUR-USERNAME/vibecoding-slides.git
   ```
4. Push your code to GitHub:
   ```bash
   git add .
   git commit -m "Initial commit"
   git push -u origin master
   ```

## Troubleshooting Remote Issues

If you encounter errors like "Repository not found" when pulling or pushing, follow these steps:

1. Check your current remote configuration:
   ```bash
   git remote -v
   ```

2. If the URL is incorrect, update it:
   ```bash
   git remote set-url origin https://github.com/YOUR-USERNAME/vibecoding-slides.git
   ```

3. Alternatively, remove and add the remote:
   ```bash
   git remote remove origin
   git remote add origin https://github.com/YOUR-USERNAME/vibecoding-slides.git
   ```

4. For convenience, you can use the included setup script:
   ```bash
   chmod +x .git-setup.sh
   ./.git-setup.sh
   ```

## Using SSH Instead of HTTPS

If you prefer using SSH authentication:

1. Make sure you've added your SSH key to your GitHub account
2. Update your remote URL:
   ```bash
   git remote set-url origin git@github.com:YOUR-USERNAME/vibecoding-slides.git
   ```
