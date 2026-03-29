# Blog App Development Guide

This document provides instructions for developing and maintaining the Blog application.

## 🏗️ Architecture Overview

The blog is built with **Angular (Standalone)** and is designed to be a lightweight, markdown-driven documentation and learning tracker.

### Key Components:

- **`DisplayMarkdownComponent`**: The core component that fetches and renders markdown files from the `assets` folder.
- **`PjMarkdownClient`**: Service (from `@peterjokumsen/ng-services`) used to fetch markdown content via HTTP.
- **`MdRendererComponent`**: Component (from `@peterjokumsen/md-renderer`) that handles the actual markdown-to-HTML conversion.
- **`@defer` Blocks**: Used in templates to lazy-load the renderer and improve initial page speed.

---

## 📝 How to Add a New Post (Current Process)

Currently, adding a new post is a 3-step manual process:

1. **Create Markdown File**: Place your `.md` file in `apps/blog/src/assets/docs/`.

- Example: `apps/blog/src/assets/docs/my-new-post.md`

2. **Create Page Component**: Create a new component in `apps/blog/src/app/pages/` that uses `DisplayMarkdownComponent`.

```typescript
// Example Page Component
@Component({
  imports: [PageIntroductionComponent, DisplayMarkdownComponent],
  template: `
    <pj-ui-page-introduction introductionTitle="My New Post" ...></pj-ui-page-introduction>
    <app-display-markdown [filePath]="'/assets/docs/my-new-post.md'"></app-display-markdown>
  `,
})
export class MyNewPostComponent {}
```

3. **Add Route**: Update `apps/blog/src/app/app.routes.ts` to include the new page.

---

## 🚀 Roadmap: Future Development Instructions

To evolve the blog into a more scalable platform, follow these implementation guides:

### 1. Implement Dynamic Routing (High Priority)

Instead of creating a new component per post, migrate to a slug-based system.

- **Action**: Create a `PostDetailComponent` that uses `ActivatedRoute` to get a `:slug` parameter.
- **Logic**: Map `slug` to the file path: `'/assets/docs/' + slug + '.md'`.
- **Route**: `{ path: 'posts/:slug', component: PostDetailComponent }`.

### 2. Add YAML Frontmatter Support

To support titles, dates, and tags without hardcoding them in Angular components.

- **Action**: Update `PjMarkdownClient` or `ts-libs/md-parser` to parse YAML frontmatter.
- **Usage**: Use the metadata to automatically populate the `PageIntroductionComponent`.

### 3. Automated Post Listing

- **Action**: Create a `posts.json` index file in `assets/docs/`.
- **Logic**: The Landing page should fetch this JSON and generate a grid of "cards" linking to the dynamic routes.

---

## 🧪 Testing & Validation

Run the following commands to ensure changes don't break the blog:

```bash
# Run Unit Tests
pnpx nx test blog

# Build for Production
pnpx nx build blog

# Run Electron-style SWA local environment
pnpm run swa:blog
```
