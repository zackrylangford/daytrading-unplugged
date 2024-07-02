
console.log('Loading livestream.js');

const apiUrl = 'https://lvejpigkhl.execute-api.us-east-1.amazonaws.com/default/retrieve-dtu-youtube-urls';

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

async function renderStreams() {
    const streams = await fetchStreams();

    const liveContainer = document.getElementById('live-stream-container');
    const archivedContainer = document.getElementById('archived-streams-container');
    const upcomingContainer = document.getElementById('next-scheduled-stream');

    liveContainer.innerHTML = ''; // Clear loading text
    archivedContainer.innerHTML = ''; // Clear loading text
    upcomingContainer.innerHTML = ''; // Clear loading text

    let nextScheduled = null;

    streams.forEach(video => {
        const videoElement = createVideoElement(video);
        if (video.type === 'live') {
            liveContainer.appendChild(videoElement);
        } else if (video.type === 'archived') {
            archivedContainer.appendChild(videoElement);
        } else if (video.type === 'scheduled') {
            if (!nextScheduled || new Date(video.scheduledStartTime) < new Date(nextScheduled.scheduledStartTime)) {
                nextScheduled = video;
            }
        }
    });

    if (nextScheduled) {
        const videoElement = createVideoElement(nextScheduled);
        const scheduledTime = document.createElement('div');
        scheduledTime.textContent = `Scheduled Start Time: ${new Date(nextScheduled.scheduledStartTime).toLocaleString()}`;
        upcomingContainer.appendChild(videoElement);
        upcomingContainer.appendChild(scheduledTime);
    }
}

document.addEventListener('DOMContentLoaded', renderStreams);