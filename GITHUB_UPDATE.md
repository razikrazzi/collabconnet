# How to Update Your GitHub Repository Manually

To push new changes from your local machine to GitHub, run these commands in your project root directory (`c:\collab connect webapp`):

1.  **Check for changes**:
    ```bash
    git status
    ```
    This shows which files have been modified.

2.  **Stage your changes**:
    *   To add all new and modified files:
        ```bash
        git add .
        ```
    *   Or to add a specific file:
        ```bash
        git add path/to/file.js
        ```

3.  **Commit your changes**:
    ```bash
    git commit -m "Briefly describe your changes"
    ```

4.  **Push to GitHub**:
    ```bash
    git push origin main
    ```

---
**Note**: I have already set up a `.gitignore` for you that prevents sensitive files like `.env` and large folders like `node_modules` from being uploaded. Always check `git status` before pushing to ensure you're not accidentally including private information.
