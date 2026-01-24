module.exports = async plan => `
<!DOCTYPE html>
<html>
<head>
<title>${plan.title}</title>
<style>
body{font-family:Arial;background:#020617;color:#fff;text-align:center;padding:100px}
h1{font-size:60px}
</style>
</head>
<body>
<h1>${plan.title}</h1>
<p>Built by Shadi AI Builder</p>
</body>
</html>
`;
