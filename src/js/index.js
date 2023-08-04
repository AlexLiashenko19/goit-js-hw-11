import ImagesApiService from './images-service';
import LoadMoreBtn from './load-more-btn';
import Notiflix from 'notiflix';
import SimpleLightbox from 'simplelightbox';
import 'simplelightbox/dist/simple-lightbox.min.css';

const refs = {
  form: document.querySelector('.search-form'),
  galleryContainer: document.querySelector('.gallery'),
};

let hitsLength = "";
let isFirstSearch = true;

const loadMoreBtn = new LoadMoreBtn({
  selector: '.load-more',
  hidden: true,
});

const imagesApiService = new ImagesApiService();

refs.form.addEventListener('submit', onSearch);
loadMoreBtn.refs.button.addEventListener('click', fetchImages);

async function onSearch(e) {
  e.preventDefault();
  refs.galleryContainer.innerHTML = "";
  imagesApiService.page = 1;
  
  imagesApiService.query = e.currentTarget.elements.searchQuery.value;
  

  if (!imagesApiService.query.trim()) {
    return Notiflix.Notify.info('Sorry, there are no images matching your search query. Please try again.')

}

  loadMoreBtn.show();
  imagesApiService.resetPage();
  clearGalleryContainer();
  fetchImages();

  refs.form.reset();
}

async function fetchImages() {
  loadMoreBtn.disable();
  try {
    const { totalHits, hits } = await imagesApiService.fetchImages();
    hitsLength = hits.length;
    if (isFirstSearch) { 
      Notiflix.Notify.success(`Hooray! We found ${totalHits} images.`);
      
    }
    if (imagesApiService.page - 1 >= Math.ceil(totalHits / 40)) {
      loadMoreBtn.hide();
      Notiflix.Notify.info(
        "We're sorry, but you've reached the end of search results."
      );

    } else if (hits.length === 0) {
      Notiflix.Notify.failure(
        'Sorry, there are no images matching your search query. Please try again.'
      );
      return;
    } 
      

      renderImagesCards(hits);
      scrollImagesCards();

      const lightbox = new SimpleLightbox('.gallery a', {
        captionsData: 'alt',
        captionDelay: 250,
      });

      lightbox.refresh();

      loadMoreBtn.enable();
      
    }
  catch (error) {
    console.error('Error fetching images:', error);
  }
}

function renderImagesCards(images) {
  const markup = images
    .map(
      image =>
        `<div class="photo-card">
  <a href="${image.largeImageURL}" class="gallery__item">
    <img src="${image.webformatURL}" alt="${image.tags}" loading="lazy" />
  </a>
  <div class="info">
    <p class="info-item"><b>Likes</b>${image.likes}</p>
    <p class="info-item"><b>Views</b>${image.views}</p>
    <p class="info-item"><b>Comments</b>${image.comments}</p>
    <p class="info-item"><b>Downloads</b>${image.downloads}</p>
  </div>
</div>`
    )
    .join('');

  refs.galleryContainer.insertAdjacentHTML('beforeend', markup);
}

function clearGalleryContainer() {
  refs.galleryContainer.innerHTML = '';
}

function scrollImagesCards() {
  const { height: cardHeight } =
    refs.galleryContainer.firstElementChild.getBoundingClientRect();

  window.scrollBy({
    top: cardHeight * 2,
    behavior: 'smooth',
  });
}