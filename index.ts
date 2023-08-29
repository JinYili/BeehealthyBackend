import express, { Express, Request, Response } from 'express';
import { Book as BookType, ListName as ListNameType } from './types';
import fetch from 'node-fetch';
const port: number = parseInt(process.env.PORT || '') || 8000;
const app: Express = express();
const key = 'GLA2dqB3Lss8506fPsjZWfq76rLXAg0h';
const baseUrl = 'https://api.nytimes.com/svc/books/v3/lists/';
const listUrl = `${baseUrl}names.json?api-key=${key}`;

app.get('/', async (req: Request, res: Response) => {
  const { list_name } = req.query;
  if (!list_name) res.status(400).send('Bad Request');

  const bestSellUrl = `${baseUrl}current/${list_name}.json?api-key=${key}`;
  try {
    const response = await fetch(bestSellUrl);
    if (!response.ok) {
      res.status(500).send('Internal Sever Error');
      return;
    }

    const {
      results: { books },
      num_results,
    }: { results: { books: BookType }; num_results: number } =
      await response.json();

    res
      .setHeader('x-total-count', num_results)
      .setHeader('Access-Control-Allow-Origin', '*')
      .status(200)
      .json(books);
  } catch (error) {
    res.status(500).send('Internal Server Error');
  }

  // const response = await fetch(bestSellUrl);
});

app.get('/books/list-name', async (req: Request, res: Response) => {
  const response = await fetch(listUrl);

  if (!response.ok) {
    res.status(500).send('Internal Sever Error');
    return;
  }
  const {
    results: rows,
    num_results,
  }: { results: ListNameType[]; num_results: number } = await response.json();

  res
    .setHeader('x-total-count', num_results)
    .setHeader('Access-Control-Allow-Origin', '*')
    .status(200)
    .json(rows);
});

app.listen(port, () => {
  console.log(`now listening on port ${port}`);
});
