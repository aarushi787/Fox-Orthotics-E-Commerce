# Postman / cURL snippets for Fox Orthotics API

- Base URL: `http://localhost:5000/api`

Products

- List products (GET)

```
curl -X GET "http://localhost:5000/api/products" -H "Accept: application/json"
```

- Get product by id (replace :id)

```
curl -X GET "http://localhost:5000/api/products/:id" -H "Accept: application/json"
```

Auth

- Register (POST)

```
curl -X POST "http://localhost:5000/api/auth/register" -H "Content-Type: application/json" -d '{"email":"user+test@example.com","password":"secret123","firstName":"Test","lastName":"User"}'
```

- Login (POST)

```
curl -X POST "http://localhost:5000/api/auth/login" -H "Content-Type: application/json" -d '{"email":"user+test@example.com","password":"secret123"}'
```

- Use returned token for protected endpoints:

```
curl -X GET "http://localhost:5000/api/orders" -H "Authorization: Bearer <JWT_TOKEN>" -H "Accept: application/json"
```

Orders (example creating an order may require authenticated user token)

```
curl -X POST "http://localhost:5000/api/orders" \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer <JWT_TOKEN>" \
  -d '{"items":[{"productId":"123","quantity":1}],"shippingAddress":{"line1":"123 Main St","city":"Town"}}'
```

Reviews

```
curl -X POST "http://localhost:5000/api/reviews" -H "Content-Type: application/json" -d '{"productId":"123","rating":5,"text":"Great product!"}'
```

Notes

- Replace `:id` and `<JWT_TOKEN>` with actual values from responses.
- If your server uses a different port, adjust the URL.
- For Postman import, create a collection and add requests using the above endpoints and example bodies.
