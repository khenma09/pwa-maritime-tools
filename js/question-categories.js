// Category definitions
const CATEGORIES = {
  ALL: 'All Categories',
  GMDSS: 'GMDSS & Communications',
  NAVIGATION: 'Navigation & Buoyage',
  IMDG: 'IMDG Code & Dangerous Goods',
  COLREG: 'COLREG & Rules of the Road',
  SAFETY: 'Safety & Security',
  CHARTWORK: 'Chartwork & Calculations',
  SIGNALS: 'Signals & Flags'
};

// Helper function to get questions by category
function getQuestionsByCategory(category) {
  if (category === CATEGORIES.ALL) {
    return quiz;
  }
  return quiz.filter(q => q.category === category);
}

// Helper function to get available categories with question counts
function getCategoryCounts() {
  const counts = {};
  Object.values(CATEGORIES).forEach(cat => {
    if (cat === CATEGORIES.ALL) {
      counts[cat] = quiz.length;
    } else {
      counts[cat] = quiz.filter(q => q.category === cat).length;
    }
  });
  return counts;
}
