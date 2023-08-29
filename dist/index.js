"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const node_fetch_1 = __importDefault(require("node-fetch"));
const port = parseInt(process.env.PORT || '') || 8000;
const app = (0, express_1.default)();
const key = 'GLA2dqB3Lss8506fPsjZWfq76rLXAg0h';
const baseUrl = 'https://api.nytimes.com/svc/books/v3/lists/';
const listUrl = `${baseUrl}names.json?api-key=${key}`;
app.get('/', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { list_name } = req.query;
    if (!list_name)
        res.status(400).send('Bad Request');
    const bestSellUrl = `${baseUrl}current/${list_name}.json?api-key=${key}`;
    try {
        const response = yield (0, node_fetch_1.default)(bestSellUrl);
        if (!response.ok) {
            res.status(500).send('Internal Sever Error');
            return;
        }
        const { results: { books }, num_results, } = yield response.json();
        res
            .setHeader('x-total-count', num_results)
            .setHeader('Access-Control-Allow-Origin', '*')
            .status(200)
            .json(books);
    }
    catch (error) {
        res.status(500).send('Internal Server Error');
    }
    // const response = await fetch(bestSellUrl);
}));
app.get('/books/list-name', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const response = yield (0, node_fetch_1.default)(listUrl);
    if (!response.ok) {
        res.status(500).send('Internal Sever Error');
        return;
    }
    const { results: rows, num_results, } = yield response.json();
    res
        .setHeader('x-total-count', num_results)
        .setHeader('Access-Control-Allow-Origin', '*')
        .status(200)
        .json(rows);
}));
app.listen(port, () => {
    console.log(`now listening on port ${port}`);
});
