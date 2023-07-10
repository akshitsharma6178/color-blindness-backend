module.exports = (req, res) => {
    res.setHeader('Access-Control-Allow-Origin', 'https://color.akshitsharma6178.com');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
    res.end();
  };