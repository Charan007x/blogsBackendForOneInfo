# Blog System Backend Requirements

This document outlines the required backend endpoints, data schemas, and admin panel features needed to fully activate the dynamic blog system currently built in `app/blogs/page.tsx` and `app/blogs/[slug]/page.tsx`. Currently, the frontend falls back to mock data if the server fails or returns null.

Give this document to GitHub Copilot when you are ready to build the backend server, API routes, and admin panel.

## 1. Data Models / Schemas

The database schema (MongoDB) needs to support the following structure for a Blog Post.

### BlogPost (Metadata for List View)
```typescript
interface BlogPost {
  id: string;             // Unique identifier (UUID or similar)
  title: string;          // Blog title
  summary: string;        // Short description for the card
  color?: string;         // Fallback Tailwind color class (e.g., "bg-[#8b5cf6]")
  imageUrl?: string;      // URL of the uploaded cover image 
  slug: string;           // URL-friendly string (e.g., "pride-of-hyderabad")
  category: string;       // e.g., "INDUSTRY AWARDS"
  date: string;           // Formatted date string (e.g., "AUG 25, 2025")
  isFeatured: boolean;    // Only ONE post should have this as true at a time
}
```

### BlogContentBlock (For Individual Post View)
The content of a blog is NOT a single giant string of HTML. To match the custom styling (drop caps, purple dividers, specific pull-quotes), it is structured as an array of blocks:

```typescript
type BlockType = 'paragraph' | 'divider' | 'quote';

interface ContentBlock {
  type: BlockType;
  text?: string;          // Used for paragraph and quote
  hasDropCap?: boolean;   // If true, the frontend makes the first letter a giant drop-cap
  author?: string;        // Used for quote type (e.g., "NIRANJAN VOJJA, FOUNDER")
}

// The full blog response combines the metadata and this content array
interface FullBlogPost extends BlogPost {
  content: ContentBlock[];
}
```

## 2. API Endpoints Required (Express.js)

Since you are building an external Express server, the frontend will reach out to these routes using `process.env.NEXT_PUBLIC_API_URL` (e.g. `http://localhost:5000/api`).

### Public Endpoints (For the Frontend)

#### 1. `GET /api/blogs`
*   **Purpose:** Populates the `app/blogs` list page. The frontend will automatically extract the object where `isFeatured === true` to display at the top, and paginate the rest.
*   **Expected JSON Response:** An array of objects.

```json
[
  {
    "id": "1",
    "title": "PRIDE OF HYDERABAD HONORS ONEINFO FOUNDER",
    "summary": "Niranjan Vojja was recognized for building a creator platform...",
    "imageUrl": "https://images.unsplash.com/photo-1542744173-8e7e53415bb0?q=80&w=2070&auto=format&fit=crop",
    "slug": "pride-of-hyderabad-honors-oneinfo-founder",
    "category": "INDUSTRY AWARDS",
    "date": "AUG 25, 2025",
    "isFeatured": true,
    "color": "bg-[#8b5cf6]"
  },
  {
    "id": "2",
    "title": "RAZORPAY AWARD FOR CREATOR MONETIZATION",
    "summary": "OneInfo received the Razorpay Award...",
    "imageUrl": "https://example.com/image.jpg",
    "slug": "razorpay-award",
    "category": "PARTNERSHIPS",
    "date": "SEP 10, 2025",
    "isFeatured": false,
    "color": "bg-[#e5e5e5]"
  }
]
```

#### 2. `GET /api/blogs/:slug`
*   **Purpose:** Renders the dynamic reading view in `app/blogs/[slug]/page.tsx`.
*   **Expected JSON Response:** A single object combining metadata and the `content` array.

```json
{
  "id": "1",
  "title": "PRIDE OF HYDERABAD HONORS ONEINFO FOUNDER",
  "imageUrl": "https://images.unsplash.com/photo-1542744173-8e7e53415bb0?q=80&w=2070&auto=format&fit=crop",
  "slug": "pride-of-hyderabad-honors-oneinfo-founder",
  "category": "INDUSTRY AWARDS",
  "date": "AUG 25, 2025",
  "isFeatured": true,
  "content": [
    { 
      "type": "paragraph", 
      "text": "Niranjan Vojja, founder of OneInfo, was honored at the Pride of Hyderabad...", 
      "hasDropCap": true 
    },
    { 
      "type": "paragraph", 
      "text": "OneInfo started with a simple idea..." 
    },
    { 
      "type": "divider" 
    },
    { 
      "type": "quote", 
      "text": "\"OUR GOAL WAS NEVER TO BUILD JUST ANOTHER TOOL.\"", 
      "author": "NIRANJAN VOJJA, FOUNDER" 
    }
  ]
}
```

### Admin Endpoints (For the CMS / Panel)
1.  **`POST /api/admin/blogs`** - Create new post
2.  **`PUT /api/admin/blogs/:id`** - Update an existing post
3.  **`DELETE /api/admin/blogs/:id`** - Delete a post
4.  **`POST /api/admin/upload`** 
    *   **Purpose:** Accepts an image file (multipart/form-data), uploads it to a bucket (like AWS S3, Cloudinary, or Vercel Blob), and returns the public `imageUrl`.
5.  **`PUT /api/admin/blogs/featured/:id`** (Optional but recommended)
    *   **Purpose:** Sets `isFeatured = true` for the chosen ID, and automatically sets `isFeatured = false` for all other posts in the database.

## 3. Frontend Integration Points

Once the API is live, you must un-comment the fetch logic located in:
*   `app/blogs/page.tsx` (Inside the `useEffect` fetch hook)
*   `app/blogs/[slug]/page.tsx` (Inside the main async server component)

## 4. Admin Panel UI Requirements
When building the admin UI, Copilot will need to create:
*   A table/list of existing blogs with Edit/Delete actions.
*   A toggle/radio button to quickly select the "Featured" post.
*   An image uploader for the `imageUrl`.
*   A block-based form builder (or dynamic form fields) that lets you append "Paragraph", "Divider" or "Quote" blocks sequentially to build the `content` array.