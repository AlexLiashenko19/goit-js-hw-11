import axios from 'axios';

const API_KEY = '38624952-48a5054b7491e44a9faaec994';
const BASE_URL = 'https://pixabay.com/api';

export default class ImagesApiService {
  constructor() {
    this.searchQuery = '';
    this.page = 1;
    this.per_page = 40;
    this.image_type = 'photo';
    this.orientation = 'horizontal';
    this.safesearch = 'true';
  }

  fetchImages() {
    const url = `${BASE_URL}/?key=${API_KEY}&q=${this.searchQuery}&${this.image_type}&${this.orientation}&${this.safesearch}&page=${this.page}&${this.per_page}`;
    return axios
      .get(url)
      .then(function (response) {
        console.log(response.data);
        return response.data;
      })
      .then(({ totalHits, hits }) => {
        this.incrementPage();
        return { totalHits, hits };
      })
      .catch(error => console.log(error));
  }

  incrementPage() {
    this.page += 1;
  }

  resetPage() {
    this.page = 1;
  }

  get query() {
    return this.searchQuery;
  }

  set query(newQuery) {
    this.searchQuery = newQuery;
  }
}