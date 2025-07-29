import app from './server';


const port = 3000;

app.listen(port, () => {
  console.log(`Gateway listening at http://localhost:${port}`);
});
