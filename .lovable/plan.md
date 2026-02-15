

## Plan: Build Admin Panel with Projects & Thumbnail Support

### 1. Create `projects` table in Supabase
- Fields: `id`, `user_id`, `name`, `description`, `thumbnail_url`, `project_url`, `is_featured`, `created_at`, `updated_at`
- Add RLS policies so only authenticated users (admins) can manage projects

### 2. Create Admin Panel page (`/admin`)
- Protected route - only accessible to authenticated users
- Form to add/edit projects with:
  - Project name
  - Description
  - Thumbnail URL (external image link)
  - Project URL (link to live project)
- Display existing projects in a table/grid with edit & delete options

### 3. Handle Image Loading Issues
- Add `onError` handler on `<img>` tags to show a fallback placeholder when external images fail to load
- Add image URL preview before saving (so you can see if it loads correctly)
- Support CORS-friendly image sources
- Display helpful error message if image URL is invalid

### 4. Display Projects on Homepage or Portfolio Section
- Create a Projects section that fetches from the `projects` table
- Display project cards with thumbnails, titles, and descriptions
- Link to project URLs when clicked

### 5. Add Admin link to navigation
- Show "Admin" link only when user is logged in
- Protect the admin route

