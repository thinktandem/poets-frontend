import axios from 'axios';

if (process.env.NODE_ENV !== "production") {
  var dotenv = require('dotenv');
  dotenv.load();
}

export default function({params, store}) {
  const apiUrl = process.env.API_URL;

  return axios.get(apiUrl + `/node/poem/${params.id}`)
    .then((response) => {
      store.commit('addPoem', response.data);
    });
}
