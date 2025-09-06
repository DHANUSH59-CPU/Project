const axios = require("axios");

const getLanguageById = (lang) => {
  const language = {
    cpp: 54,
    "c++": 54,
    java: 62,
    javascript: 63,
    python: 71,
  };
  return language[lang.toLowerCase()];
};

const waiting = async (timer) => {
  return new Promise(resolve => setTimeout(resolve, timer));
};

const submitBatch = async (submissions) => {
  const options = {
    method: "POST",
    url: "https://judge0-ce.p.rapidapi.com/submissions/batch",
    params: {
      base64_encoded: "false",
    },
    headers: {
      "x-rapidapi-key": "fbd984a75dmsh1ba48204c034597p119ac2jsndac2de7a02bb",
      "x-rapidapi-host": "judge0-ce.p.rapidapi.com",
      "Content-Type": "application/json",
    },
    data: {
      submissions,
    },
  };

  async function fetchData() {
    try {
      const response = await axios.request(options);
      // console.log(response.data);
      return response.data;
    } catch (error) {
      console.error(error);
    }
  }
  return await fetchData();
};

const submitToken = async (resultToken) => {
  const options = {
    method: "GET",
    url: "https://judge0-ce.p.rapidapi.com/submissions/batch",
    params: {
      tokens: resultToken.join(","),
      base64_encoded: "false",
      fields: "*",
    },
    headers: {
      "x-rapidapi-key": "fbd984a75dmsh1ba48204c034597p119ac2jsndac2de7a02bb",
      "x-rapidapi-host": "judge0-ce.p.rapidapi.com",
    },
  };

  async function fetchData() {
    try {
      const response = await axios.request(options);
      return response.data;
    } catch (error) {
      console.error(error);
    }
  }

  while (true) {
    const result = await fetchData();
    const IsResultObtained = result.submissions.every((r) => r.status_id > 2);

    if (IsResultObtained) return result.submissions;
    await waiting(1000);
  }
};
module.exports = { getLanguageById, submitBatch, submitToken };

// fbd984a75dmsh1ba48204c034597p119ac2jsndac2de7a02bb
