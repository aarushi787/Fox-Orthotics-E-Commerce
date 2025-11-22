const express = require("express");
const { getAIRecommendations, getAIRecommendationsByCategory, setSynonyms } = require("../controllers/aiController");

const router = express.Router();

router.post("/recommend", getAIRecommendations);
router.get("/recommend/category/:category", getAIRecommendationsByCategory);
// Admin route to update synonyms at runtime (writes to server/config/synonyms.json)
router.post('/synonyms', setSynonyms);

module.exports = router;
