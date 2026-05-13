# Blogs Backend API Documentation

This is the backend service for the OneInfo Blogs system, built with Express, MongoDB, and Cloudinary. 

## Endpoints

Base URL: `http://localhost:5000/api` (or your configured `NEXT_PUBLIC_API_URL` on the frontend).

### Public Endpoints

#### 1. Get All Blogs
- **URL:** `/blogs`
- **Method:** `GET`
- **Description:** Retrieves all blogs, sorted by newest first. The `content` array is omitted to save bandwidth. `isFeatured` should be used by the frontend to highlight the main blog.
- **Response:**
  ```json
  [
    {
      "id": "64b5f8...",
      "title": "Example Blog",
      "slug": "example-blog",
      "summary": "Short summary...",
      "category": "INDUSTRY",
      "color": "bg-[#8b5cf6]",
      "imageUrl": "https://res.cloudinary.com/...",
      "date": "AUG 25, 2026",
      "isFeatured": true
    }
  ]
  ```

#### 2. Get Single Blog By Slug
- **URL:** `/blogs/:slug`
- **Method:** `GET`
- **Description:** Retrieves a single blog by its URL-friendly slug, including the full `content` array for reading.

---

### Admin Endpoints

#### Image Upload Workflow
Uploading an image and creating a blog is a **2-step process** to avoid complex multipart/form-data parsing with nested JSON arrays:
1. Upload the selected image using the **Upload Image** endpoint (`/admin/upload`).
2. Receive the `imageUrl` from the response.
3. Submit the JSON payload to the **Create Blog** endpoint (`/admin/blogs`), including the `imageUrl`.

#### 1. Upload Image
- **URL:** `/admin/upload`
- **Method:** `POST`
- **Body:** `multipart/form-data` with a single file field named `image`.
- **Response:**
  ```json
  {
    "imageUrl": "https://res.cloudinary.com/..."
  }
  ```

#### 2. Create Blog
- **URL:** `/admin/blogs`
- **Method:** `POST`
- **Body:** JSON
- **Description:** Creates a new blog post. The `slug` is automatically generated from the `title` (unless you explicitly provide a custom `slug`). If `isFeatured` is `true`, all other blogs are automatically un-featured.
- **Request Example:**
  ```json
  {
    "title": "My Awesome Blog Post",
    "summary": "A short summary here.",
    "color": "bg-[#8b5cf6]",
    "imageUrl": "https://res.cloudinary.com/...",
    "category": "INDUSTRY AWARDS",
    "date": "AUG 25, 2026",
    "isFeatured": false,
    "content": [
      {
        "type": "paragraph",
        "text": "This is the first paragraph.",
        "hasDropCap": true
      },
      {
        "type": "divider"
      },
      {
        "type": "quote",
        "text": "\"Our goal is to build great tools.\"",
        "author": "Niranjan Vojja"
      }
    ]
  }
  ```

#### 3. Update Blog
- **URL:** `/admin/blogs/:id`
- **Method:** `PUT`
- **Body:** JSON (Same structure as Create)
- **Description:** Partially or fully updates an existing blog post by its `id` (the MongoDB `_id`).

#### 4. Delete Blog
- **URL:** `/admin/blogs/:id`
- **Method:** `DELETE`
- **Description:** Deletes a blog post by its `id`.

#### 5. Set Featured Blog Quickly
- **URL:** `/admin/blogs/featured/:id`
- **Method:** `PUT`
- **Description:** Instantly marks the specified blog as `isFeatured = true` and removes the featured status from all other blogs.
