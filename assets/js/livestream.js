const apiUrl = 'https://lvejpigkhl.execute-api.us-east-1.amazonaws.com/default/retrieve-dtu-youtube-urls';
let nextScheduledVideo = null;

async function fetchStreams() {
    const response = await fetch(apiUrl);
    const data = await response.json();
    console.log('Data fetched from API:', data);  // Log data to console
    return data;
}

function createThumbnailElement(video, isMain = false, isUpcoming = false) {
    const container = document.createElement('div');
    container.classList.add('video-container');
    if (isMain) container.classList.add('main-video');

    const thumbnail = document.createElement('img');
    thumbnail.src = `https://img.youtube.com/vi/${video.video_id}/0.jpg`;
    thumbnail.alt = video.title;

    const title = document.createElement('div');

    title.textContent = `${video.title}`;
    title.classList.add('video-title');

    const description = document.createElement('div');
    description.textContent = video.description;
    description.classList.add('video-description');

    container.appendChild(thumbnail);
    container.appendChild(title);
    container.appendChild(description);

    if (isUpcoming) {
        const label = document.createElement('div');
        label.classList.add('upcoming-label');
        label.textContent = 'Upcoming';
        container.appendChild(label);
    }

    container.addEventListener('click', () => {
        updateMainVideo(video);
    });

    return container;
}

function createMainVideoElement(video) {
    const container = document.createElement('div');
    container.classList.add('video-container');
    container.classList.add('main-video');

    const iframe = document.createElement('iframe');
    iframe.src = `https://www.youtube.com/embed/${video.video_id}`;
    iframe.allow = 'accelerometer; autoplay; encrypted-media; gyroscope; picture-in-picture';
    iframe.allowFullscreen = true;

    const title = document.createElement('div');
    const date = new Date(video.publishedAt).toLocaleDateString(); // Format the date
    title.textContent = `${date} - ${video.title}`;
    title.classList.add('video-title');

    const description = document.createElement('div');
    description.textContent = video.description;
    description.classList.add('video-description');

    container.appendChild(iframe);
    container.appendChild(title);
    container.appendChild(description);

    return container;
}

function updateMainVideo(video) {
    const mainVideoPlayer = document.getElementById('main-video-player');
    mainVideoPlayer.innerHTML = '';
    const videoElement = createMainVideoElement(video);
    mainVideoPlayer.appendChild(videoElement);
}

function updateScheduledToLive() {
    const currentTime = new Date();
    if (nextScheduledVideo && new Date(nextScheduledVideo.scheduledStartTime) <= currentTime) {
        transitionToLive();
    }
}

function transitionToLive() {
    const upcomingContainer = document.getElementById('upcoming-stream-container');
    updateMainVideo(nextScheduledVideo);
    if (upcomingContainer) upcomingContainer.style.display = 'none';
    nextScheduledVideo = null;
}

async function renderStreams() {
    const streams = await fetchStreams();

    const archivedContainer = document.getElementById('archived-streams-container');
    const testButton = document.getElementById('test-live-button');

    const liveStreams = streams.filter(video => video.type === 'live');
    const archivedStreams = streams.filter(video => video.type === 'archived');
    const scheduledStreams = streams.filter(video => video.type === 'scheduled');

    if (scheduledStreams.length > 0) {
        nextScheduledVideo = scheduledStreams[0];
        updateMainVideo(nextScheduledVideo);
    } else if (liveStreams.length > 0) {
        updateMainVideo(liveStreams[0]);
    } else if (archivedStreams.length > 0) {
        updateMainVideo(archivedStreams[0]);
    }

    if (archivedContainer) archivedContainer.innerHTML = ''; // Clear loading text

    if (nextScheduledVideo) {
        const videoElement = createThumbnailElement(nextScheduledVideo, false, true);
        archivedContainer.appendChild(videoElement);
    }

    archivedStreams.forEach(video => {
        const videoElement = createThumbnailElement(video);
        videoElement.onclick = () => updateMainVideo(video);
        archivedContainer.appendChild(videoElement);
    });
}

document.addEventListener('DOMContentLoaded', async () => {
    await renderStreams();
    setInterval(updateScheduledToLive, 60000); // Check every minute

    const testButton = document.getElementById('test-live-button');
    testButton.addEventListener('click', transitionToLive); // Add event listener for the test button
});
