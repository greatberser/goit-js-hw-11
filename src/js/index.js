import { fetchImages } from '../js/fetchImages';
import Notiflix from 'notiflix';
import SimpleLightbox from 'simplelightbox';
import 'simplelightbox/dist/simple-lightbox.min.css';

const input = document.querySelector('.input');
const formSearch = document.querySelector('.search-form');
const gallery = document.querySelector('.gallery');
const btnLoadMore = document.querySelector('.load-more');
let gallerySimpleLightbox = new SimpleLightbox('.gallery a');


btnLoadMore.style.display = 'none';

let pageNumber = 1;

formSearch.addEventListener('submit', async e => {
  e.preventDefault();
  cleanGallery();
  const trimmedValue = input.value.trim();
    if (!trimmedValue) {
        return;
     }
  try {
         const {hits, totalHits}= await fetchImages(trimmedValue, pageNumber);
      if (hits.length === 0) {
        Notiflix.Notify.failure(
          'Sorry, there are no images matching your search query. Please try again.'
        );
        return
      }
   else {
        renderImageList(hits);
        Notiflix.Notify.success(
          `Hooray! We found ${totalHits} images.`
        );
        btnLoadMore.style.display = 'block';
        gallerySimpleLightbox.refresh();
      }
  } catch (e) {
    console.error(e);
     }
    
});

btnLoadMore.addEventListener('click', async () => {
  pageNumber++;
  const trimmedValue = input.value.trim();
  btnLoadMore.style.display = 'none';
  
  const { hits, totalHits } = await fetchImages(trimmedValue, pageNumber);
  if (hits.length === 0) {
    Notiflix.Notify.failure(
      'Sorry, there are no images matching your search query. Please try again.'
    );
    return
  }
  renderImageList(hits);
  btnLoadMore.style.display = 'block';
  
  if (Math.ceil(totalHits / 40) === pageNumber) {
    btnLoadMore.style.display = 'none';
    return Notiflix.Notify.info(
      "We're sorry, but you've reached the end of search results."
    );
  
  }
});


function renderImageList(images) {
  const markup = images
    .map(image => {
      const {largeImageURL, webformatURL, tags, likes, views, comments, downloads } = image;
      return `<div class="photo-card">

       <a href="${largeImageURL}"><img class="photo" src="${webformatURL}" alt="${tags}" title="${tags}" loading="lazy"/></a>

        <div class="info">
           <p class="info-item">
    <b>Likes</b> <span class="info-item-api"> ${likes} </span>
</p>
            <p class="info-item">
                <b>Views</b> <span class="info-item-api">${views}</span>  
            </p>
            <p class="info-item">
                <b>Comments</b> <span class="info-item-api">${comments}</span>  
            </p>
            <p class="info-item">
                <b>Downloads</b> <span class="info-item-api">${downloads}</span> 
            </p>
        </div>
    </div>`;
    })
    .join('');
gallery.insertAdjacentHTML('beforeend', markup); 
}




function cleanGallery() {
  gallery.innerHTML = '';
  pageNumber = 1;
  btnLoadMore.style.display = 'none';
}