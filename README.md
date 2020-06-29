#### Set up ingress-nginx controller

Check `ingress-nginx` documentation: https://kubernetes.github.io/ingress-nginx/

Docker for Mac:
`kubectl apply -f https://raw.githubusercontent.com/kubernetes/ingress-nginx/controller-0.32.0/deploy/static/provider/cloud/deploy.yaml`

---

#### Set up mock host name:

> **To redirect requests coming to: ticketing.dev => localhost**
>
> - only for local development purposes

- MacOS/Linux:
  modify `/etc/hosts` file to include `127.0.0.1 ticketing.dev`

* Windows:
  modify `C:\Windows\System32\Drivers\etc\hosts` file to include `127.0.0.1 ticketing.dev`

> To skip the unskippable HTTPS warning in Chrome:
>
> - try type **thisisunsafe**

---

#### Skaffold

Install Skaffold Dev Tool: `brew install skaffold`

From root project directory: run `skaffold dev`

---

#### Authentication Strategies

- Want no backend session storage when using Microservices architecture - so stick with `JWT`.

- Want to use Server-Side Rendering and access user's auth information when HTML first gets rendered - so `store and transmit JWT within Cookies`, i.e. use cookies as a transport mechanism.

- Want to be able to revoke a user - so use `short-lived JWT` (e.g. expired in 15 minutes) with `refresh` mechanism.

---

## Client

### NextJS

> Minimalistic ReactJS framework for rendering React app on the server. https://nextjs.org/

---

#### Common NPM Module

All the commonly used classes & middlewares are extracted into a published NPM Module.

- @wwticketing/common: https://www.npmjs.com/package/@wwticketing/common

> Contains commonly used Middlewares and Error Classes for ticketing microservices

> Source codes: https://github.com/weilyuwang/ticketing-common-lib

---

## API

### auth service

---

### tickets service

> GET /api/tickets
> Retrieve all tickets
>
> GET /api/tickets/:id
> Retrieve ticket with specific ID
>
> POST /api/tickets
> with request body { title: string, price: string }
> Create a ticket
>
> PUT /api/tickets/:id
> with request body { title: string, price: string }
> Update a ticket

---

### orders service

> GET /api/orders
> Retrieve all active orders for the given user making the request
>
> GET /api/orders/:id
> Get details about a specific order
>
> POST /api/orders
> with request body { ticketId: string }
> Create an order to purchase the specified ticket
>
> DELETE /api/orders/:id
> Cancel the order

---

### Event-Driven Architecture

#### NATS Streaming Server

---

### Optimistic Concurrency Control

- Leverage `mongoose-update-if-current` npm module to update mongodb documents' version.


---

### expiration service

- BullJS + Redis