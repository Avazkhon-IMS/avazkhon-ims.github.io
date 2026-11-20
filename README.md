# My research website

A simple website with seven pages (Home, Research, Publications, Tutorials, Scripts, Notes, About) in English, Uzbek and Russian. Visitors can switch the language and choose a light or dark look with the buttons in the top-right corner. It is made of plain files, so it needs no server and no installation.

## 1. Look at the site on your computer

Double-click `index.html`. It opens in your browser.

## 2. Change the content

Everything you will normally change is in **one file**: `assets/js/content.js`. Open it with a text editor (VS Code or Notepad++ work well; Word does not).

To add something new, copy an existing block, paste it at the top of the same list, and change the text. Then save the file and refresh the browser.

| I want to add...   | Where in `content.js` | Extra step |
|--------------------|-----------------------|------------|
| A paper            | `publications`        | Optional: put the PDF in `files/papers/` |
| A video            | `videos`              | Upload the video to YouTube first, then copy its ID (the part after `v=` in the link) |
| A script           | `scripts`             | Put the file in `files/scripts/` |
| A written note     | `notes`               | Give it an `id` that starts with `note-` |
| A research project | `projects`            | Optional: put a picture in `assets/img/` and write its path in `image` |
| The research overview | `dissertation`  | |
| My email and links | `contact`             | |
| The site name next to the logo | `siteName` (first lines) | |

Text in three languages looks like this:

```js
title: { en: "English title", uz: "Oʻzbekcha sarlavha", ru: "Русский заголовок" }
```

If you leave out `uz` or `ru`, the English text is shown.

**Before you publish, please fix these:** the years in the About page, the YouTube channel link, the three example videos, and the four scripts that have no file yet.

## 3. Put the site on the internet for free (GitHub Pages)

1. Create a free account at https://github.com.
2. Click **New repository**. Name it `yourusername.github.io` (use your real GitHub username). Choose **Public** and click **Create repository**.
3. On the repository page click **uploading an existing file**. Drag *everything inside* this folder (not the folder itself) into the browser window, then click **Commit changes**.
4. Wait about one minute. Your site is now live at `https://yourusername.github.io`.

To update the site later, upload the changed files the same way. GitHub replaces the old ones.

## What each file does

- `index.html`, `research.html`, ... : the seven pages. They are almost empty; the content is filled in automatically.
- `assets/js/content.js` : **your content**.
- `assets/js/i18n.js` : menu and button words in three languages.
- `assets/js/site.js` : the code that builds the pages.
- `assets/css/style.css` : colours, fonts and layout. The colours are the first lines of the file. Change `--accent` to recolour the whole site (it appears three times: once for the light look and twice for the dark look).
- `404.html` : the "Page not found" page that GitHub Pages shows for a wrong address.
- `assets/logo.svg` : the logo as a separate picture, for slides or a YouTube channel.
- `files/` : your downloadable scripts and PDFs.
