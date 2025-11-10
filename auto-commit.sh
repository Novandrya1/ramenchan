#!/bin/bash

echo "========================================"
echo "      RamenChan Auto Commit Script"
echo "========================================"
echo

# Get current timestamp
timestamp=$(date "+%d/%m/%Y %H:%M")

# Check if git is initialized
if [ ! -d ".git" ]; then
    echo "Initializing Git repository..."
    git init
    git branch -M main
    echo
fi

# Add all changes
echo "Adding all changes..."
git add .

# Check if there are changes to commit
if git diff --cached --quiet; then
    echo "No changes to commit."
    exit 0
fi

# Show status
echo
echo "Current status:"
git status --short

# Auto-generate commit message based on changes
echo
echo "Generating commit message..."

# Create base commit message
commit_msg="🚀 Auto-commit: $timestamp"

# Check for specific file changes and add context
if git diff --cached --name-only | grep -q "\.html$"; then
    commit_msg="$commit_msg - HTML updates"
fi

if git diff --cached --name-only | grep -q "\.css$"; then
    commit_msg="$commit_msg - CSS improvements"
fi

if git diff --cached --name-only | grep -q "\.js$"; then
    commit_msg="$commit_msg - JavaScript enhancements"
fi

# Commit changes
echo
echo "Committing with message: $commit_msg"
git commit -m "$commit_msg"

if [ $? -eq 0 ]; then
    echo
    echo "✅ Successfully committed changes!"
    
    # Ask if user wants to push
    echo
    read -p "Do you want to push to remote? (y/n): " push_choice
    if [[ $push_choice =~ ^[Yy]$ ]]; then
        echo "Pushing to remote..."
        git push origin main
        if [ $? -eq 0 ]; then
            echo "✅ Successfully pushed to remote!"
        else
            echo "❌ Failed to push to remote."
        fi
    fi
else
    echo "❌ Failed to commit changes."
fi

echo
echo "========================================"
echo "          Process Complete"
echo "========================================"