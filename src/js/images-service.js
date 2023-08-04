import axios from 'axios';

export default class ImagesApiService {
  #BASE_URL = 'https://pixabay.com/api/';
  #key = '38624952-48a5054b7491e44a9faaec994';
  constructor() {
    this.searchQuery = '';
    this.page = 1;
  }
  async fetchImages() {
    const params = new URLSearchParams({
      key: this.#key,
      per_page: 40,
      image_type: 'photo',
      orientation: 'horizontal',
      safesearch: 'true',
      q: this.searchQuery, 
      page: this.page ++,
    });

    try {
      const URL = `${this.#BASE_URL}?${params}`;
      const response = await axios.get(URL);
      return response.data;
    } catch (error) {
      console.log(error);
    }
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