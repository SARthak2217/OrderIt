import mongoose from 'mongoose';

const categorySchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Please provide category name'],
    unique: true,
    trim: true,
    maxLength: [50, 'Category name cannot exceed 50 characters']
  },
  description: {
    type: String,
    maxLength: [200, 'Description cannot exceed 200 characters']
  },
  image: {
    public_id: String,
    url: {
      type: String,
      required: [true, 'Please provide category image']
    }
  },
  icon: {
    type: String, // FontAwesome or similar icon class
    required: true
  },
  isActive: {
    type: Boolean,
    default: true
  },
  sortOrder: {
    type: Number,
    default: 0
  }
}, {
  timestamps: true
});

export default mongoose.model('Category', categorySchema);
