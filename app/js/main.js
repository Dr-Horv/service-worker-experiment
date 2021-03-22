// Your scripts goes here...

const apiKey = ''

const tags = ['kitten','cute','cat','cats']

const catsUrl =
  `https://api.flickr.com/services/rest/?method=flickr.photos.search&api_key=${apiKey}&per_page=30&format=json&nojsoncallback=1&tags='${tags[0]},+${tags[1]},+${tags[2]},+${tags[3]}'&tag_mode=all&sort=interestingness-desc&extras=url_w`;

const recentUrl =
  `https://api.flickr.com/services/rest/?method=flickr.photos.getRecent&api_key=${apiKey}&per_page=1&format=json&nojsoncallback=1&extras=url_w`;

const fetchImages = (url) => {
  return fetch(url).then(r => r.json())
}

const renderImages = (images) => {
  const gallery = document.getElementById('gallery')
  for (const image of images) {
    const photo = document.createElement('div')
    photo.innerHTML = `<div class='photobox'><img class='pics' src=${image.url_w}   /></div>`;
    gallery.appendChild(photo);
  }
}

const renderDivider = () => {
  const gallery = document.getElementById('gallery')
  const divider = document.createElement('div')
  divider.className = 'divider'
  gallery.appendChild(divider);
}

const renderError = () => {
  const gallery = document.getElementById('gallery')
  const error = document.createElement('div')
  error.innerHTML = `<p>Failed to fetch recent image</p>`
  gallery.appendChild(error);
}

document.addEventListener('DOMContentLoaded', async () =>  {
  console.log('Taking off... 🚀');
  try {
    const recent = await fetchImages(recentUrl).catch(e => (Promise.resolve({recent: {photos: {photo: []}}})))
    renderImages(recent.photos.photo)
  } catch (e) {
    renderError()
  }
  const cats = await fetchImages(catsUrl)
  renderDivider();
  renderImages(cats.photos.photo)
});
