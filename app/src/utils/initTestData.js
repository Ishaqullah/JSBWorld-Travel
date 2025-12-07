// Initialize test data for development
export const initTestData = () => {
  // Check if test user already exists
  const existingUsers = JSON.parse(localStorage.getItem('travecations_all_users') || '[]');
  
  if (existingUsers.find(u => u.email === 'test@travecations.com')) {
    console.log('Test user already exists');
    return;
  }

  // Create test user
  const testUser = {
    id: 'test-user-001',
    email: 'test@travecations.com',
    name: 'Test User',
    password: 'test123',
    avatar: 'https://ui-avatars.com/api/?name=Test+User&background=0ea5e9&color=fff',
    createdAt: new Date().toISOString(),
  };

  existingUsers.push(testUser);
  localStorage.setItem('travecations_all_users', JSON.stringify(existingUsers));
  
  console.log('✅ Test user created!');
  console.log('📧 Email: test@travecations.com');
  console.log('🔑 Password: test123');
};
