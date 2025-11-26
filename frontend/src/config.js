const config = {
    API_BASE_URL: process.env.NODE_ENV === 'production' 
        ? 'https://liabrary-management-system-react.vercel.app'
        : 'http://localhost:3001'
};

export default config;