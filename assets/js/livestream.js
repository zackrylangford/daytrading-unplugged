const apiUrl = 'https://lvejpigkhl.execute-api.us-east-1.amazonaws.com/default/retrieve-dtu-youtube-urls';
let nextScheduledVideo = null;

async function fetchStreams() {
    const response = await fetch(apiUrl);
    const data = await response.json();
    console.log('Data fetched from API:', data);  // Log data to console
    return data;
}

function createVideoElement(video) {
    const container = document.createElement('div');

    const iframe = document.createElement('iframe');
    iframe.src = `https://www.youtube.com/embed/${video.video_id}`;
    iframe.allow = 'accelerometer; autoplay; encrypted-media; gyroscope; picture-in-picture';
    iframe.allowFullscreen = true;

    const title = document.createElement('div');
    title.textContent = video.title;

    const description = document.createElement('div');
    description.textContent = video.description;

    container.appendChild(iframe);
    container.appendChild(title);
    container.appendChild(description);

    return container;
}

function updateScheduledToLive() {
    const currentTime = new Date();
    if (nextScheduledVideo && new Date(nextScheduledVideo.scheduledStartTime) <= currentTime) {
        transitionToLive();
    }
}

function transitionToLive() {
    const liveContainer = document.getElementById('live-stream-container');
    const upcomingContainer = document.getElementById('upcoming-stream-container');
    const nextScheduledContainer = document.getElementById('next-scheduled-stream');
    
    // Clear upcoming stream container
    if (nextScheduledContainer) nextScheduledContainer.innerHTML = '';
    
    // Update the next scheduled video to live
    const videoElement = createVideoElement(nextScheduledVideo);
    liveContainer.appendChild(videoElement);
    
    // Update heading to indicate the stream is now live
    const liveHeading = document.createElement('h2');
    liveHeading.textContent = 'Now Live';
    liveContainer.prepend(liveHeading);
    
    // Hide the upcoming stream container
    if (upcomingContainer) upcomingContainer.style.display = 'none';
    
    nextScheduledVideo = null; // Reset the next scheduled video
}

async function renderStreams() {
    const streams = await fetchStreams();

    const liveContainer = document.getElementById('live-stream-container');
    const archivedContainer = document.getElementById('archived-streams-container');
    const upcomingContainer = document.getElementById('next-scheduled-stream');
    const testButton = document.getElementById('test-live-button');

    if (liveContainer) liveContainer.innerHTML = ''; // Clear loading text
    if (archivedContainer) archivedContainer.innerHTML = ''; // Clear loading text
    if (upcomingContainer) upcomingContainer.innerHTML = ''; // Clear loading text

    let nextScheduled = null;

    streams.forEach(video => {
        const videoElement = createVideoElement(video);
        if (video.type === 'live') {
            if (liveContainer) liveContainer.appendChild(videoElement);
        } else if (video.type === 'archived') {
            if (archivedContainer) archivedContainer.appendChild(videoElement);
        } else if (video.type === 'scheduled') {
            if (!nextScheduled || new Date(video.scheduledStartTime) < new Date(nextScheduled.scheduledStartTime)) {
                nextScheduled = video;
            }
        }
    });

    if (nextScheduled && upcomingContainer) {
        nextScheduledVideo = nextScheduled; // Store the next scheduled video for later update
        const videoElement = createVideoElement(nextScheduled);
        const scheduledTime = document.createElement('div');
        scheduledTime.textContent = `Scheduled Start Time: ${new Date(nextScheduled.scheduledStartTime).toLocaleString()}`;
        upcomingContainer.appendChild(videoElement);
        upcomingContainer.appendChild(scheduledTime);
        // testButton.style.display = 'block';
    }
}

document.addEventListener('DOMContentLoaded', async () => {
    await renderStreams();
    setInterval(updateScheduledToLive, 60000); // Check every minute

    const testButton = document.getElementById('test-live-button');
    testButton.addEventListener('click', transitionToLive); // Add event listener for the test button
});