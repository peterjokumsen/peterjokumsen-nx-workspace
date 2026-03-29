---
description: Instructions for managing and scaling the blog app within the Nx workspace.
---

# Blog Management Workflow 📝

This workflow provides automated and manual steps for adding content to the Blog application and implementing future improvements.

## 🛠️ Adding a New Blog Post

To add a new learning journey or documentation post, follow these steps:

1. **Create Markdown File**

- Place a new `.md` file in `apps/blog/src/assets/docs/`.
- Name it with a URL-friendly name (e.g., `learning-ngrx.md`).

2. **Setup Page Component**

- Run the follow to generate a new component in `apps/blog/src/app/pages/`:

```bash
npx nx g @nx/angular:component <post-name> --project=blog --path=apps/blog/src/app/pages/<post-name> --style=scss --standalone
```

3. **Connect Display Markdown**

- Update the generated component to import `DisplayMarkdownComponent` from `../../components`.
- Set the `[filePath]` input to the path of your new markdown file.

4. **Update Routes**

- Add a new entry to the `childRoutes` array in `apps/blog/src/app/app.routes.ts`.

---

## 🏗️ Implementing the Future Roadmap

When asked to improve the blog architecture, use these guidelines:

### Milestone 1: Dynamic Slug Routing

1.  **Modify `app.routes.ts`**: Add a route `{ path: 'posts/:slug', loadComponent: () => import('./pages/post-detail').then(m => m.PostDetailComponent) }`.
2.  **Create `PostDetailComponent`**:
    - Inject `ActivatedRoute`.
    - Use `route.paramMap` to get the `slug`.
    - Pass the path `'/assets/docs/' + slug + '.md'` to `DisplayMarkdownComponent`.
3.  **Refactor Existing Pages**: Move `about-me` and `development-notes` to use this new dynamic system if possible.

### Milestone 2: Automated Indexing

1.  **Post Index Generator**: Create a script in `scripts/generate-blog-index.ts` that reads all files in `assets/docs/`, extracts their metadata (if frontmatter is present), and writes a `posts.json` file.
2.  **Frontend Listing**: On the `LandingComponent`, fetch the `posts.json` and render a list of recent posts.

---

## 📋 Pre-deployment Checklist

Before finalizing changes, ensure you've checked the following:

- [ ] Run `npx nx test blog` to verify no regressions.
- [ ] Verify that all markdown links within the post are correct.
- [ ] Check if images are placed in `apps/blog/src/assets/images/` and linked via relative paths in markdown.
- [ ] Run `npm run swa:blog` to test the full build profile locally.
