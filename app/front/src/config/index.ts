export const config = {
    // URL de l'API backend
    apiUrl: process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4001',
    
    defaultAvatarUrl: '/placeholder.svg',
    
    tokenKey: 'token',
    userKey: 'user',
    
    requestTimeout: 30000, // 30 secondes
  }
  