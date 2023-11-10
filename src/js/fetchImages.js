import axios from "axios";

const BASE_URL = 'https://pixabay.com/api/';

async function fetchImages(valueImages, page = 1){
    const options = new URLSearchParams ({
        key: "40410725-d86b32508aaf4f5420a176099",
        q : valueImages,
        image_type : "photo",
        orientation: "horizontal",
        safesearch : true,
        per_page: 40,
        page: `${page}`
    });
    const {data} = await axios.get(`${BASE_URL}?${options}`);
    return data;
}

export { fetchImages};