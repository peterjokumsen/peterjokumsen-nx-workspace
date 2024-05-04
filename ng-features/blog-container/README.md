# blog-container

This library was generated with [Nx](https://nx.dev).

## Purpose

This library is meant to display all data related to blogs, which includes:

- [ ] Blog posts
- [ ] Blog post categories
- [ ] Blog post tags
- [ ] Blog entries

Including allowing the user to search for blog posts, filter blog posts by category, and filter blog posts by tag.

## Usage

Load child routes in application/library using `blogContainerRoutes` from `@peterjokumsen/blog-container`:

```typescript
const routes: Routes = [
  // ...
  {
    path: 'blog',
    loadChildren: () => import('@peterjokumsen/blog-container').then((m) => m.blocContainerRoutes),
  },
  // ...
];
```

## Running unit tests

Run `nx test blog-container` to execute the unit tests.
