import prisma from '../config/database.js';
import { asyncHandler } from '../middleware/error.middleware.js';

// @desc    Get all categories
// @route   GET /api/categories
// @access  Public
export const getAllCategories = asyncHandler(async (req, res) => {
  const categories = await prisma.category.findMany({
    orderBy: { displayOrder: 'asc' },
    include: {
      _count: {
        select: {
          tours: {
            where: {
              status: 'PUBLISHED',
              deletedAt: null,
            },
          },
        },
      },
    },
  });

  res.status(200).json({
    success: true,
    data: { categories },
  });
});

// @desc    Create category
// @route   POST /api/categories
// @access  Private/Admin
export const createCategory = asyncHandler(async (req, res) => {
  const { name, icon, description, displayOrder } = req.body;

  // Generate slug from name
  const slug = name
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)/g, '');

  const category = await prisma.category.create({
    data: {
      name,
      slug,
      icon,
      description,
      displayOrder: displayOrder || 0,
    },
  });

  res.status(201).json({
    success: true,
    message: 'Category created successfully',
    data: { category },
  });
});
