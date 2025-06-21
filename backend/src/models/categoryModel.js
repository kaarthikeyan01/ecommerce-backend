const mongoose = require('mongoose');

const categorySchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'Category name is required'],
      unique: true,
      trim: true
    },
    
  },
  {
    timestamps: true // Adds createdAt and updatedAt
  }
);

const Category = mongoose.model('Category', categorySchema);
 export default Category