# Awesome Cloud Scanner

This project was specificly crafted for the [Cloudflare Developer
Summer Challenge](https://challenge.developers.cloudflare.com/).

It is a proof of concept which uses the following techniques:
- Cloudflare Pages
- Cloudflare Workers
- Cloudflare Workers Durable Objects

It is a simple QR code scanner that will only allow **one** scan per unique code. If you scan it for the 2nd time – from anywhere in the world at any point in time – it will result in a red screen.