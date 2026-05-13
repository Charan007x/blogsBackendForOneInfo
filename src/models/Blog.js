import mongoose from 'mongoose';

const contentBlockSchema = new mongoose.Schema({
  type: {
    type: String,
    required: true,
    enum: ['paragraph', 'divider', 'quote'],
  },
  text: {
    type: String,
  },
  hasDropCap: {
    type: Boolean,
    default: false,
  },
  author: {
    type: String,
  },
});

const blogSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
    },
    summary: {
      type: String,
      required: true,
    },
    color: {
      type: String,
      default: 'bg-[#8b5cf6]',
    },
    imageUrl: {
      type: String,
    },
    slug: {
      type: String,
      required: true,
      unique: true,
    },
    category: {
      type: String,
      required: true,
    },
    date: {
      type: String,
      required: true,
    },
    isFeatured: {
      type: Boolean,
      default: false,
    },
    content: [contentBlockSchema],
  },
  {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true }
  }
);

// Add id virtual field to match frontend requirements
blogSchema.virtual('id').get(function () {
  return this._id.toHexString();
});

const Blog = mongoose.model('Blog', blogSchema);

export default Blog;
