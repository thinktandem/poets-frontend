import axios from 'axios';

export default function({params, store}) {
  
  return axios.get(`http://poetscontentapi.lndo.site/api/tutorials/${params.id}`) //938c0e11-a6d8-48f5-8c34-06c7574cf81f')
    .then((response) => {
      store.commit('addPoem', response.data);
    });
}
