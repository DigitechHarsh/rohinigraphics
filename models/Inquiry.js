import mongoose from 'mongoose';

const InquirySchema = new mongoose.Schema({
  inquiryId: {
    type: String,
    unique: true,
    default: () => `INQ-${Math.floor(1000 + Math.random() * 9000)}`
  },
  name: {
    type: String,
    required: [true, 'Please provide a contact name.'],
    trim: true,
  },
  phone: {
    type: String,
    required: [true, 'Please provide a phone number.'],
    trim: true,
  },
  email: {
    type: String,
    default: 'Not Provided',
    trim: true,
  },
  product: {
    type: String,
    required: [true, 'Please specify the product of interest.'],
  },
  budget: {
    type: String,
    default: 'Not Specified',
  },
  priority: {
    type: String,
    enum: ['Low', 'Normal', 'Medium', 'High'],
    default: 'Normal',
  },
  message: {
    type: String,
    required: [true, 'Please provide requirement details.'],
  },
  status: {
    type: String,
    enum: ['Pending', 'Contacted', 'Completed'],
    default: 'Pending',
  },
  notes: {
    type: String,
    default: '',
  },
  createdAt: {
    type: Date,
    default: Date.now,
  }
});

// Avoid Mongoose model overwrite errors in hot-reload
export default mongoose.models.Inquiry || mongoose.model('Inquiry', InquirySchema);
