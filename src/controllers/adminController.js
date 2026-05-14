import Blog from '../models/Blog.js';
import User from '../models/User.js';
import slugify from 'slugify';
import jwt from 'jsonwebtoken';

// @desc    Admin login
// @route   POST /api/admin/login
// @access  Public
const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email });

    if (user && (await user.matchPassword(password))) {
      const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET || 'your_jwt_secret', {
        expiresIn: '30d'
      });
      res.json({ token, email: user.email });
    } else {
      res.status(401).json({ message: 'Invalid email or password' });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Register a new admin user (first time setup)
// @route   POST /api/admin/register
// @access  Public
const registerUser = async (req, res) => {
  try {
    const { email, password } = req.body;

    const userExists = await User.findOne({ email });

    if (userExists) {
      return res.status(400).json({ message: 'User already exists' });
    }

    const user = await User.create({
      email,
      password,
    });

    if (user) {
      const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET || 'your_jwt_secret', {
        expiresIn: '30d'
      });
      res.status(201).json({ token, email: user.email });
    } else {
      res.status(400).json({ message: 'Invalid user data' });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Create a blog
// @route   POST /api/admin/blogs
// @access  Admin
const createBlog = async (req, res) => {
  try {
    const { title, summary, color, imageUrl, slug: customSlug, category, date, isFeatured, content } = req.body;

    // Generate slug from title if not provided
    const slug = customSlug || slugify(title, { lower: true, strict: true });

    if (isFeatured) {
      await Blog.updateMany({}, { isFeatured: false });
    }

    const blog = new Blog({
      title,
      summary,
      color,
      imageUrl,
      slug,
      category,
      date,
      isFeatured,
      content,
    });

    const createdBlog = await blog.save();
    res.status(201).json(createdBlog);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// @desc    Update a blog
// @route   PUT /api/admin/blogs/:id
// @access  Admin
const updateBlog = async (req, res) => {
  try {
    const { title, summary, color, imageUrl, slug, category, date, isFeatured, content } = req.body;

    const blog = await Blog.findById(req.params.id);

    if (blog) {
      if (isFeatured && !blog.isFeatured) {
        await Blog.updateMany({}, { isFeatured: false });
      }

      blog.title = title || blog.title;
      blog.summary = summary || blog.summary;
      blog.color = color || blog.color;
      blog.imageUrl = imageUrl || blog.imageUrl;
      blog.slug = slug || blog.slug;
      blog.category = category || blog.category;
      blog.date = date || blog.date;
      blog.isFeatured = isFeatured !== undefined ? isFeatured : blog.isFeatured;
      blog.content = content || blog.content;

      const updatedBlog = await blog.save();
      res.json(updatedBlog);
    } else {
      res.status(404).json({ message: 'Blog not found' });
    }
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// @desc    Delete a blog
// @route   DELETE /api/admin/blogs/:id
// @access  Admin
const deleteBlog = async (req, res) => {
  try {
    const blog = await Blog.findById(req.params.id);

    if (blog) {
      await blog.deleteOne();
      res.json({ message: 'Blog removed' });
    } else {
      res.status(404).json({ message: 'Blog not found' });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Upload image
// @route   POST /api/admin/upload
// @access  Admin
const uploadImage = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ message: 'No file uploaded' });
    }
    res.json({ imageUrl: req.file.path });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Set featured blog
// @route   PUT /api/admin/blogs/featured/:id
// @access  Admin
const setFeaturedBlog = async (req, res) => {
  try {
    const blog = await Blog.findById(req.params.id);

    if (blog) {
      await Blog.updateMany({}, { isFeatured: false });
      blog.isFeatured = true;
      const updatedBlog = await blog.save();
      res.json(updatedBlog);
    } else {
      res.status(404).json({ message: 'Blog not found' });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Update admin password
// @route   PUT /api/admin/password
// @access  Private
const updatePassword = async (req, res) => {
  try {
    const user = await User.findById(req.user._id);

    if (user) {
      if (await user.matchPassword(req.body.oldPassword)) {
        user.password = req.body.newPassword;
        await user.save();
        res.json({ message: 'Password updated successfully' });
      } else {
        res.status(401).json({ message: 'Incorrect old password' });
      }
    } else {
      res.status(404).json({ message: 'User not found' });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export {
  createBlog,
  updateBlog,
  deleteBlog,
  uploadImage,
  setFeaturedBlog,
  login,
  registerUser,
  updatePassword,
};
