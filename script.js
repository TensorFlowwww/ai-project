document.addEventListener('DOMContentLoaded', function () {
    // Particles.js Configuration
    particlesJS('particles-js', {
        particles: {
            number: { value: 80, density: { enable: true, value_area: 800 } },
            color: { value: '#ff6b00' },
            shape: { type: 'circle', stroke: { width: 0, color: '#000000' } },
            opacity: { value: 0.5, random: true, anim: { enable: true, speed: 1, opacity_min: 0.1, sync: false } },
            size: { value: 3, random: true, anim: { enable: false } },
            line_linked: { enable: true, distance: 150, color: '#ff6b00', opacity: 0.4, width: 1 },
            move: { enable: true, speed: 2, direction: 'none', random: false, straight: false, out_mode: 'out', bounce: false }
        },
        interactivity: {
            detect_on: 'canvas',
            events: { onhover: { enable: true, mode: 'grab' }, onclick: { enable: true, mode: 'push' }, resize: true },
            modes: { grab: { distance: 140, line_linked: { opacity: 1 } }, push: { particles_nb: 4 } }
        },
        retina_detect: true
    });

    // DOM Elements
    const searchInput = document.getElementById('search-input');
    const searchBtn = document.getElementById('search-btn');
    const randomHobbyBtn = document.getElementById('random-hobby-btn');
    const clearSearch = document.getElementById('clear-search');
    const searchNewBtn = document.getElementById('search-new-btn');
    const initialState = document.getElementById('initial-state');
    const loadingElement = document.getElementById('loading');
    const resultsElement = document.getElementById('results');
    const errorMessage = document.getElementById('error-message');
    const tipsContent = document.getElementById('tips-content');
    const beginnerContent = document.getElementById('beginner-content');
    const videosGrid = document.getElementById('videos-grid');
    const hobbyName = document.getElementById('hobby-name');
    const dynamicSuggestions = document.getElementById('dynamic-suggestions');
    const textSuggestionsContent = document.getElementById('text-suggestions-content');
    const hobbyCategories = document.getElementById('hobby-categories');
    const videoModal = document.getElementById('video-modal');
    const closeModal = document.getElementById('close-modal');
    const modalVideoPlayer = document.getElementById('modal-video-player');

    // API Keys
    const GEMINI_API_KEY = 'AIzaSyAEPi-NeHy6GvxSmOJmmZ0MZWyQiNJWDrI';
    const YOUTUBE_API_KEY = 'AIzaSyCWb_KfHK5G-eyB7NwOZQo2qTJgzgGaHHc';

    // Generic Gemini API fetch function
    async function fetchFromGemini(prompt) {
        try {
            const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${GEMINI_API_KEY}`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    contents: [{ parts: [{ text: prompt }] }]
                })
            });
            if (!response.ok) {
                throw new Error(`Gemini API error: ${response.status} - ${response.statusText}`);
            }
            const data = await response.json();
            if (!data.candidates || !data.candidates[0].content.parts[0].text) {
                throw new Error('Invalid response structure from Gemini API');
            }
            console.log(`CraftMind.AI - Successfully fetched from Gemini: ${prompt}`);
            return data.candidates[0].content.parts[0].text.trim();
        } catch (error) {
            console.error('CraftMind.AI - Gemini API fetch failed:', error.message);
            return null;
        }
    }

    // Fetch hobby suggestions
    async function fetchHobbySuggestions() {
        const text = await fetchFromGemini('List 5 popular DIY hobbies in a comma-separated format');
        return text ? text.split(',').map(h => h.trim()).slice(0, 5) : ['origami', 'woodworking', 'knitting', 'pottery', 'painting'];
    }

    // Fetch text suggestions (why start a hobby)
    async function fetchTextSuggestions() {
        const text = await fetchFromGemini('Provide 3 short reasons why starting a hobby is beneficial, max 20 words each');
        return text ? text.split('\n').filter(t => t.trim()).map(t => t.replace(/^\W+/, '').trim()) : [
            'Hobbies reduce stress and improve mental health.',
            'They boost creativity and problem-solving skills.',
            'Hobbies connect you with like-minded communities.'
        ];
    }

    // Fetch hobby categories
    async function fetchHobbyCategories() {
        const text = await fetchFromGemini('List 5 broad hobby categories in a comma-separated format');
        return text ? text.split(',').map(c => c.trim()).slice(0, 5) : ['Creative', 'Outdoor', 'Technical', 'Culinary', 'Collecting'];
    }

    // Fetch tips (dynamic based on hobby)
    async function fetchGeminiTips(query) {
        const prompt = `Provide 5 concise tips for ${query} as a hobby. Format as bullet points, max 15 words each.`;
        const text = await fetchFromGemini(prompt);
        if (!text) {
            console.error('CraftMind.AI - Failed to fetch tips from Gemini for:', query);
            return [
                'Start with simple projects to build skills.',
                'Gather basic tools before beginning.',
                'Watch tutorials for guidance.',
                'Practice regularly to improve.',
                'Join a community for inspiration.'
            ];
        }
        const tips = text.split('\n')
            .map(line => line.replace(/^\W+/, '').trim())
            .filter(tip => tip && tip.length > 5);
        return tips.length >= 1 ? tips.slice(0, 5) : ['No specific tips available from API.'];
    }

    // Fetch beginner guide
    async function fetchBeginnerGuide(query) {
        const text = await fetchFromGemini(`Provide 3 beginner steps for starting ${query}, max 20 words each`);
        if (!text) {
            console.error('CraftMind.AI - Failed to fetch beginner guide from Gemini for:', query);
            return [
                `Research ${query} basics online.`,
                `Buy essential ${query} tools.`,
                `Try a simple ${query} project.`
            ];
        }
        const steps = text.split('\n')
            .filter(t => t.trim())
            .map(t => t.replace(/^\W+/, '').trim());
        return steps.length >= 1 ? steps.slice(0, 3) : [`Research ${query} basics online.`];
    }

    // Fetch top 10 YouTube videos (excluding Shorts)
    async function fetchYoutubeVideos(query) {
        try {
            const response = await fetch(`https://www.googleapis.com/youtube/v3/search?part=snippet&q=${encodeURIComponent(query + " diy tutorial -shorts")}&maxResults=50&type=video&order=relevance&videoDuration=medium&key=${YOUTUBE_API_KEY}`);
            if (!response.ok) {
                throw new Error(`YouTube API error: ${response.status} - ${response.statusText}`);
            }
            const data = await response.json();

            const videoIds = data.items.map(item => item.id.videoId).join(',');
            const detailsResponse = await fetch(`https://www.googleapis.com/youtube/v3/videos?part=contentDetails,snippet&id=${videoIds}&key=${YOUTUBE_API_KEY}`);
            if (!detailsResponse.ok) {
                throw new Error('YouTube Details API error');
            }
            const detailsData = await detailsResponse.json();

            const filteredVideos = detailsData.items
                .filter(video => {
                    const duration = video.contentDetails.duration;
                    const minutes = parseInt(duration.match(/(\d+)M/)?.[1] || 0);
                    const seconds = parseInt(duration.match(/(\d+)S/)?.[1] || 0);
                    return minutes > 1 || (minutes === 1 && seconds > 0);
                })
                .slice(0, 10)
                .map(video => ({
                    id: video.id,
                    title: video.snippet.title,
                    channel: video.snippet.channelTitle
                }));

            console.log(`CraftMind.AI - Successfully fetched ${filteredVideos.length} YouTube videos for: ${query}`);
            return filteredVideos;
        } catch (error) {
            console.error('CraftMind.AI - YouTube API error:', error.message);
            return [
                { id: 'dQw4w9WgXcQ', title: 'Fallback Video - Rick Roll', channel: 'Rick Astley' }
            ];
        }
    }

    // Fetch random hobby
    async function fetchRandomHobby() {
        const text = await fetchFromGemini('Suggest one random DIY hobby');
        return text ? text.trim() : 'origami';
    }

    // Function to open video in modal
    function openVideoModal(videoId) {
        modalVideoPlayer.innerHTML = `
            <iframe src="https://www.youtube.com/embed/${videoId}?autoplay=1" frameborder="0" allowfullscreen></iframe>
        `;
        videoModal.classList.remove('hidden');
    }

    // Function to close video modal
    function closeVideoModal() {
        videoModal.classList.add('hidden');
        modalVideoPlayer.innerHTML = '';
    }

    // Load initial content
    async function loadInitialContent() {
        console.log('CraftMind.AI - Loading initial content...');
        const [hobbies, textSuggestions, categories] = await Promise.all([
            fetchHobbySuggestions(),
            fetchTextSuggestions(),
            fetchHobbyCategories()
        ]);

        dynamicSuggestions.innerHTML = hobbies.map(hobby => `
            <span class="suggestion-tag" data-query="${hobby}">${hobby}</span>
        `).join('');

        textSuggestionsContent.innerHTML = textSuggestions.map(s => `<p>${s}</p>`).join('');

        hobbyCategories.innerHTML = categories.map(category => `
            <span class="category-tag" data-query="${category}">${category}</span>
        `).join('');

        const [initialTips, initialGuide] = await Promise.all([
            fetchGeminiTips(hobbies[0]),
            fetchBeginnerGuide(hobbies[0])
        ]);
        tipsContent.innerHTML = initialTips.map(tip => `<div class="tip-item">${tip}</div>`).join('');
        beginnerContent.innerHTML = initialGuide.map(step => `<div class="tip-item">${step}</div>`).join('');
        hobbyName.textContent = hobbies[0];

        document.querySelectorAll('.suggestion-tag, .category-tag').forEach(tag => {
            tag.addEventListener('click', () => {
                searchInput.value = tag.getAttribute('data-query');
                performSearch(searchInput.value);
            });
        });

        console.log('CraftMind.AI - Initial content loaded.');
    }

    // Perform search
    async function performSearch(query) {
        if (!query.trim()) return;

        console.log(`CraftMind.AI - Searching for: ${query}`);
        initialState.classList.add('hidden');
        resultsElement.classList.add('hidden');
        errorMessage.classList.add('hidden');
        loadingElement.classList.remove('hidden');

        const [tips, beginnerGuide, videos] = await Promise.all([
            fetchGeminiTips(query),
            fetchBeginnerGuide(query),
            fetchYoutubeVideos(query)
        ]);

        loadingElement.classList.add('hidden');

        hobbyName.textContent = query;
        tipsContent.innerHTML = tips.map(tip => `<div class="tip-item">${tip}</div>`).join('');
        beginnerContent.innerHTML = beginnerGuide.map(step => `<div class="tip-item">${step}</div>`).join('');

        if (videos.length) {
            videosGrid.innerHTML = videos.map(video => `
                <div class="video-card" data-video-id="${video.id}">
                    <div class="video-player">
                        <iframe src="https://www.youtube.com/embed/${video.id}" frameborder="0" allowfullscreen></iframe>
                    </div>
                    <div class="video-info">
                        <h3 class="video-title">${video.title}</h3>
                        <p class="video-channel">${video.channel}</p>
                    </div>
                </div>
            `).join('');

            document.querySelectorAll('.video-card').forEach(card => {
                card.addEventListener('click', () => {
                    const videoId = card.getAttribute('data-video-id');
                    openVideoModal(videoId);
                });
            });

            resultsElement.classList.remove('hidden');
        } else if (tips.length > 1 || beginnerGuide.length > 1) {
            resultsElement.classList.remove('hidden');
        } else {
            errorMessage.classList.remove('hidden');
        }

        console.log(`CraftMind.AI - Search completed for: ${query}`);
    }

    // Random hobby generator
    async function generateRandomHobby() {
        loadingElement.classList.remove('hidden');
        const hobby = await fetchRandomHobby();
        loadingElement.classList.add('hidden');
        searchInput.value = hobby;
        performSearch(hobby);
    }

    // Clear search input
    function clearSearchInput() {
        searchInput.value = '';
        clearSearch.classList.add('hidden');
        searchInput.focus();
    }

    // Show/hide clear button based on input
    searchInput.addEventListener('input', () => {
        if (searchInput.value.length > 0) {
            clearSearch.classList.remove('hidden');
        } else {
            clearSearch.classList.add('hidden');
        }
    });

    // Event listeners
    searchBtn.addEventListener('click', () => performSearch(searchInput.value));
    randomHobbyBtn.addEventListener('click', generateRandomHobby);
    searchInput.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') performSearch(searchInput.value);
    });
    clearSearch.addEventListener('click', clearSearchInput);
    searchNewBtn.addEventListener('click', () => location.reload()); // Refresh page

    closeModal.addEventListener('click', closeVideoModal);
    videoModal.addEventListener('click', (e) => {
        if (e.target === videoModal) closeVideoModal();
    });

    // Initialize
    loadInitialContent();
    searchInput.focus();
});