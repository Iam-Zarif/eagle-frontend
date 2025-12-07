
## Tech Stacks

- **Framework:** Next.js 16  
- **Library:** React 19  
- **State Management:** Redux Toolkit  
- **Styling:** TailwindCSS 4, tw-animate-css  
- **UI Components & Icons:** Shadcn, lucide
- **Forms:** react-hook-form  
- **Charts & Visualization:** Shadcn Chart  
- **Theming & Utilities:** next-themes, tailwind-merge, clsx, class-variance-authority  
- **TypeScript Support:** TypeScript 5  
- **Linting & Code Quality:** ESLint, eslint-config-next  



## One click run
It will run into http://localhost:5173

```bash
  git clone https://github.com/Iam-Zarif/eagle-frontend.git
  cd eagle-frontend
  npm i
  npm run dev
```

You may get APi import error, To find solution read given document


## Environment Variables

To run this project, you will need to add the following environment variables to your .env file

`NEXT_PUBLIC_FIREBASE_API_KEY`  
`NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN`  
`NEXT_PUBLIC_FIREBASE_PROJECT_ID`  
`NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET`  
`NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID`  
`NEXT_PUBLIC_FIREBASE_APP_ID`  
`NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID`

`api` - folder



---

## API Reference
#### Login

```http
POST /api/login
```

| Parameter  | Type   | Description                 |
| :--------- | :----- | :-------------------------- |
| `username` | string | **Required**. User username |
| `password` | string | **Required**. User password |

* **Required Cookie:** No (returns cookie on success)


#### View Profile

```http
GET /api/profile
```

* **Required Cookie:** Yes

---
#### Get All Products

```http
GET /api/product
```

* **Required Cookie:** Yes

---

#### Get Product by ID

```http
GET /api/product?id={productId}
```

| Parameter | Type   | Description              |
| :-------- | :----- | :----------------------- |
| `id`      | string | **Required**. Product ID |

* **Required Cookie:** Yes

---

#### Add Product

```http
POST /api/product
```

| Parameter | Type   | Description                        |
| :-------- | :----- | :--------------------------------- |
| `body`    | object | Product details (name, description, price, quantity, status) |

* **Required Cookie:** Yes

---

#### Update Product

```http
PUT /api/product?id={productId}
```

| Parameter | Type   | Description              |
| :-------- | :----- | :----------------------- |
| `id`      | string | **Required**. Product ID |
| `body`    | object | Updated product details  |

* **Required Cookie:** Yes

---

#### Delete Product

```http
DELETE /api/product?id={productId}
```

| Parameter | Type   | Description              |
| :-------- | :----- | :----------------------- |
| `id`      | string | **Required**. Product ID |

* **Required Cookie:** Yes

---







# Check Live

A real-time product management dashboard built with Next.js, React, Redux, and Firebase.  

🌐 **Live Demo:** [Frontend Web](https://eagle-3d-streaming.web.app)


## Server / API URL

The backend API is hosted here: [API Server](https://eagle-server-green.vercel.app)