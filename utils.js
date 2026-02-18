const sanitize = (str) => {
  if (typeof str !== 'string') return '' ;
  return str.replace(/</g, "&lt;").replace(/>/g, "&gt;");
};


const getTemplate = (title, description) => {
  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">

  <title>${title}</title>
</head>
<body>
  <h1>${title}</h1>
  <p>${description}</p>
</body>
</html>`;
};


module.exports = {
  sanitize,
  getTemplate
};