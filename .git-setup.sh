#!/bin/bash

# Display current Git remote configuration
echo "Current Git remote configuration:"
git remote -v

# Remove any existing 'origin' remote
echo -e "\nRemoving existing origin remote (if any)..."
git remote remove origin

# Prompt for the GitHub username and repository name
echo -e "\nPlease enter your GitHub username:"
read github_username

echo "Please enter the repository name (default: vibecoding-slides):"
read repo_name
repo_name=${repo_name:-vibecoding-slides}

# Set up the new origin remote
echo -e "\nSetting up new origin remote..."
git remote add origin "https://github.com/$github_username/$repo_name.git"

# Verify the new remote
echo -e "\nVerified remote configuration:"
git remote -v

echo -e "\nRemote URL has been updated. You can now try:"
echo "git pull --tags origin master"
echo "or"
echo "git push -u origin master"
