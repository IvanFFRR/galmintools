const express = require('express')
const path = require('path')
const PORT = process.env.PORT || 5000
const app = express()
const opals = require('./scripts/opals')

app
  .use(express.static(path.join(__dirname)))
  .use(express.json())
  .use(express.urlencoded())
  .set('index', path.join(__dirname))
  .set('view engine', 'ejs')
  .listen(PORT, () => console.log(`Listening on ${ PORT }`))

app.get('/', async (req, res) => {
  var response = await opals.GetAlltimeYieldFormatted();
  var total = await opals.GetTotalProfit();
  res.render('index', {
    rows: response,
    total: total
  });
});

app.get('/test', async (req, res) => {
  res.send(pg)
})


app.post('/', async (req, res) => {
  console.debug(req.body);
  var body = req.body;
  var object = opals.MineOpals(
    body['opals'],
    body['jeweller'] == 'on',
    body['miners']
  );
  await opals.AddNewYield(object)
  res.redirect('/')
});
