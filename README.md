<div align="center">
<img width="1200" height="475" alt="GHBanner" src="https://github.com/user-attachments/assets/0aa67016-6eaf-458a-adb2-6e31a0763ed6" />
</div>

# Run and deploy your AI Studio app

This contains everything you need to run your app locally

View your app in AI Studio: https://ai.studio/apps/temp/3

## Run Locally

**Prerequisites:**  Node.js


1. Install dependencies:
   `npm install`
2. Set the `GEMINI_API_KEY` in [.env.local](.env.local) to your Gemini API key
3. Run the app:
   `npm run dev`

## Deploy to GitHub Pages

1. Push this repository to GitHub. Make sure your default branch is `main`.
2. GitHub Actions workflow is included at `.github/workflows/deploy.yml`.
3. In your GitHub repo, go to Settings → Pages, and set:
   - Source: "GitHub Actions"
4. On every push to `main`, the site will be built and deployed to Pages.

### URL

- Your site will be available at:
  - `https://<your-username>.github.io/Bomb-Bomb-Pudding/`
  - Replace `<your-username>` with your GitHub username.

### Notes

- `vite.config.ts` sets `base` to `/Bomb-Bomb-Pudding/` for correct asset paths on Pages.
- The entry script in `index.html` uses a relative path (`index.tsx`) for subpath hosting compatibility.
