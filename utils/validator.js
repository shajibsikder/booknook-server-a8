/**
 * Validation helper for book and borrow requests
 */
function validateBookInput(data) {
  const errors = [];
  if (!data.title || typeof data.title !== 'string' || !data.title.trim()) {
    errors.push('Book title is required');
  }
  if (!data.author || typeof data.author !== 'string' || !data.author.trim()) {
    errors.push('Author name is required');
  }
  if (!data.category || !['Fiction', 'Science', 'History', 'Kids', 'Others'].includes(data.category)) {
    errors.push('Category must be one of: Fiction, Science, History, Kids, Others');
  }
  if (!data.image || !data.image.startsWith('http')) {
    errors.push('A valid image URL is required');
  }
  if (!data.description || data.description.length < 10) {
    errors.push('Description must be at least 10 characters long');
  }
  return errors;
}

module.exports = {
  validateBookInput,
};
