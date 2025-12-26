const JWT_SECRET = process.env.JWT_SECRET
const RAPID_API_KEY = process.env.RAPID_API_KEY
const GEMINI_API_KEY = process.env.GEMINI_API_KEY
const WEIGHT_AND_BIAS_API = process.env.WEIGHT_AND_BIAS_API
const MONGO_URL = process.env.MONGO_URL
const PORT = process.env.PORT
const EMAIL_USER = process.env.EMAIL_USER
const EMAIL_PASS = process.env.EMAIL_PASS

module.exports = ({
    JWT_SECRET,
    RAPID_API_KEY,
    GEMINI_API_KEY,
    WEIGHT_AND_BIAS_API,
    MONGO_URL,
    PORT,
    EMAIL_USER,
    EMAIL_PASS
})