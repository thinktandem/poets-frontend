import axios from 'axios';

if (process.env.NODE_ENV !== "production") {
  var dotenv = require('dotenv');
  dotenv.load();
}

export default function({params, store}) {
  const apiUrl = process.env.API_URL;

  return axios.get(apiUrl + `/node/poem/${params.id}`)
    //`http://poetscontentapi.lndo.site/api/tutorials/${params.id}`) //938c0e11-a6d8-48f5-8c34-06c7574cf81f')
    .then((response) => {
      store.commit('addPoem', response.data);
    });
}
