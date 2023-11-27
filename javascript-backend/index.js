import express from "express";

import { getAllQuotes, getQuote, getQuoteName, getQuoteIndex, deleteQuote } from "./src/requests/quote.js";
import { getCustomerName, getCustomerIndex, addCustomer } from "./src/requests/customer.js";
import { addPart, getAllParts } from "./src/requests/parts.js";
import { updateItem } from "./src/requests/items.js";

const app = express();
import cors from 'cors';

app.use(cors());
app.use(express.json());

app.post('/test', (req, res) => {
 console.log(req.body);
 res.json({
    "Success": true
 });
});

// app.get('/api/customer/name/:id', async (req, res) => {
//     const customerId = req.params.id;
//     const custList = await getCustomerName(customerId, 20, 20);
//     console.log(custList);
//     res.json(custList);
// });

app.post('/api/customer/name', async (req, res) => {
    const name = req.body.name;
    const limit = req.body.limit;
    const offset = req.body.offset;
    if(offset >= 0 && limit > 0) {
        const custList = await getCustomerName(name, limit, offset);
        res.json(custList);
    }
    else {
        res.json([]);
    }
});

app.post('/api/customer/index', async (req, res) => {
    const limit = req.body.limit;
    const offset = req.body.offset;
    const custList = await getCustomerIndex(offset, limit);
    res.json(custList);
});

app.post('/api/customer/add', async (req, res) => {
    const message = addCustomer(req.body);
    res.json({success: true});
});

app.get('/api/quote/:id', async (req, res) => {
    const quoteId = req.params.id;
    const quote = await getQuote(quoteId);
    res.json(quote);
});

app.post('/api/quotes/index', async (req, res) => {
    const offset = req.body.offset;
    const limit = req.body.limit;
    const quotes = await getQuoteIndex(offset, limit);
    res.json(quotes);
});

app.post('/api/quotes/name', async (req, res) => {
    const name = req.body.name;
    const limit = req.body.limit;
    const offset = req.body.offset;
    if(offset >= 0 && limit > 0) {
        const quoteList = await getQuoteName(name, offset, limit);
        res.json(quoteList);
    }
    else {
        res.json([]);
    }
});

app.post('/api/quotes/delete', async (req, res) => {
    const id = req.body.id;
    const quoteConfirm = await deleteQuote(id);
    res.json({success: quoteConfirm});
});

app.post('/api/item/edit', (req, res) => {
    console.log(req.body);
    updateItem(req.body);
    res.json([]);
});

app.get('/api/parts', async (req, res) => {
    const parts = await getAllParts();
    res.json(parts);
});

app.post('/api/part/add', async (req, res) => {
    const parts = await addPart(req.body.name, req.body.description);
    res.json({ success: parts });
});

app.listen(2000, () => {
    console.log('Server is running on port 2000');
});
