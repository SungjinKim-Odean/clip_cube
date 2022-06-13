
import * as axios from 'axios'

class Api {    
    constructor() {
        this.axios = axios.create();
        this.axios.defaults.baseURL = '/';
        this.axios.defaults.headers.common['Content-Type'] = 'application/json;charset=utf-8';
        this.axios.defaults.headers.common['Access-Control-Allow-Origin'] = '*';
    }

    put(api, param) {             
        return this.axios.put(api, param)
            .then((response) => { 
                //console.log(JSON.parse(JSON.stringify(response)));
                if(response.data.success == true) {
                    return response.data.data;
                }
                else {
                    throw response.data.message;
                }
            })
            .catch((error) => {
                return Promise.reject(error);
            });
    }

    post(api, param) {             
        return this.axios.post(api, param)
            .then((response) => { 
                //console.log(JSON.parse(JSON.stringify(response)));
                if(response.data.success == true) {
                    return response.data.data;
                }
                else {
                    throw response.data.message;
                }
            })
            .catch((error) => {
                return Promise.reject(error);
            });
    }

    get(api) {
        return this.axios.get(api)
            .then((response) => { 
                //console.log(JSON.parse(JSON.stringify(response)));
                if(response.data.success == true) {
                    return response.data.data;
                }
                else {
                    throw response.data.message;
                }
            })
            .catch((error) => {
                return Promise.reject(error);
            });

    }    
}


export default new Api();