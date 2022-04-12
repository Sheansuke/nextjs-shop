import axios from "axios"

const tesloapi = axios.create({
    baseURL: "/api",

})

export default tesloapi