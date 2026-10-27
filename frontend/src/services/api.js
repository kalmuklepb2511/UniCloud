/*import axios from "axios";

const api = axios.create({
  baseURL: "http://localhost:8080",
  headers: {
    "Content-Type": "application/json"
  }

});

api.interceptors.request.use(
    (config) => {

        const stored =
            localStorage.getItem("user");

        if (stored) {

            try {

                const user =
                    JSON.parse(stored);

                if (user?.token) {

                    config.headers.Authorization =
                        `Bearer ${user.token}`;
                }

            } catch (error) {

                console.error(
                    "Invalid user in localStorage"
                );
            }
        }

        return config;
    },

    (error) => Promise.reject(error)
);

api.interceptors.response.use(

    (response) => response,

    (error) => {

        if (error.response?.status === 401) {

            console.log(
                "JWT expired or missing"
            );

            // Don't immediately redirect if
            // you want to inspect the error.
        }

        return Promise.reject(error);
    }
);

export default api;
*/

import axios from "axios";

const api = axios.create({
baseURL: "http://localhost:8080"
});

api.interceptors.request.use(
(config) => {
const stored = localStorage.getItem("user");


if (stored) {
  try {
    const user = JSON.parse(stored);
    const token =
      user?.token || user?.accessToken || user?.jwt;

    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
  } catch (error) {
    console.error("Invalid user in localStorage.");
  }
}

/*
 * Let Axios/browser set the multipart boundary for FormData.
 * JSON requests receive the JSON content type.
 */
if (config.data instanceof FormData) {
  delete config.headers["Content-Type"];
} else if (config.data !== undefined) {
  config.headers["Content-Type"] = "application/json";
}

return config;


},
(error) => Promise.reject(error)
);

api.interceptors.response.use(
(response) => response,
(error) => {
if (error.response?.status === 401) {
console.warn("JWT expired or missing.");
}


return Promise.reject(error);


}
);

export default api;
