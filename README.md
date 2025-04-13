# DIYGenix.AI - Discover DIY Hobbies

A dynamic web application that helps users discover and learn new DIY hobbies through an AI-powered interface, providing personalized recommendations, tips, and curated video tutorials.

## Features

- **Smart Hobby Search**: Search for any DIY hobby to get instant recommendations and guidance
- **Random Hobby Generator**: Discover new hobbies with the random suggestion feature
- **Interactive UI**: Beautiful particle.js background with smooth animations
- **Real-time Tips**: AI-generated tips and beginner guides for each hobby
- **Video Tutorials**: Curated YouTube tutorials for hands-on learning
- **Responsive Design**: Fully responsive layout that works on all devices
- **Accessibility**: WCAG compliant with keyboard navigation support

## Technologies Used

- HTML5
- CSS3 (Custom Properties, Flexbox, Grid)
- JavaScript (ES6+)
- Particles.js
- Google's Gemini AI API
- YouTube Data API v3
- Font Awesome Icons

## Setup

1. Clone the repository:
```bash
git clone https://github.com/yourusername/diygenix-ai.git
```

2. Replace the API keys in `script.js`:
```javascript
const GEMINI_API_KEY = 'your_gemini_api_key';
const YOUTUBE_API_KEY = 'your_youtube_api_key';
```

3. Open `index.html` in a web browser or serve using a local server.

## Project Structure

- `index.html` - Main HTML structure
- `styles.css` - All styles and animations
- `script.js` - Application logic and API integrations
- `service-worker.js` - PWA service worker (currently commented out)

## Key Features Explained

### AI Integration
- Uses Gemini API for generating hobby suggestions
- Provides personalized tips and beginner guides
- Generates random hobby recommendations

### Video Integration
- Fetches relevant YouTube tutorials
- Filters out short-form content
- Modal video player for better viewing experience

### UI/UX Features
- Dynamic content loading
- Loading states with spinner
- Error handling with user feedback
- Clear and intuitive navigation
- Responsive sidebar layout

## Contributing

1. Fork the repository
2. Create your feature branch: `git checkout -b feature/my-feature`
3. Commit your changes: `git commit -m 'Add my feature'`
4. Push to the branch: `git push origin feature/my-feature`
5. Submit a pull request

## License

This project is licensed under the MIT License - see the LICENSE file for details.

## Credits

- Created by Danish Khan (12305960)
- Icons by Font Awesome
- Particle effects by Particles.js
- APIs by Google (Gemini and YouTube)