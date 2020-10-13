# Ticketing App - Microservices & Event Driven Architecture

## Local Dev

#### Set up ingress-nginx controller  

- This is required for both local dev K8s cluster and DigitalOcean K8s cluster

Check `ingress-nginx` documentation: https://kubernetes.github.io/ingress-nginx/

---

#### Create secret tokens in k8s cluster

- This is required for both local dev k8s and DigitalOcean k8s   

```
e.g. To create a secret token in k8s cluster that is used for stripe payment service:

kubectl create secret generic stripe-secret --from-literal STRIPE_KEY=[YOU_STRIPE_SECRET_KEY]

And inside payment service k8s deployment config file (payments-depl.yaml):

- name: STRIPE_KEY
  valueFrom:
    secretKeyRef:
      name: stripe-secret
      key: STRIPE_KEY
      
```

---

#### Set up mock host name (local dev)

  - To redirect requests coming to: ticketing.dev => localhost      
  - only for local development purposes

  - MacOS/Linux:  
  modify `/etc/hosts` file to include `127.0.0.1 ticketing.dev`

  - Windows:  
  modify `C:\Windows\System32\Drivers\etc\hosts` file to include `127.0.0.1 ticketing.dev`

  - To skip the unskippable HTTPS warning in Chrome:    
  try type **thisisunsafe**

---

#### Skaffold (local dev)

Install Skaffold Dev Tool: `brew install skaffold`

From root project directory: run `skaffold dev`

---

#### Authentication Strategies

- Want no backend session storage when using Microservices architecture - so stick with `JWT`.

- Want to use Server-Side Rendering and access user's auth information when HTML first gets rendered - so `store and transmit JWT within Cookies`, i.e. use cookies as a transport mechanism.

- Want to be able to revoke a user - so use `short-lived JWT` (e.g. expired in 15 minutes) with `refresh` mechanism.


## CI/CD: Github Actions


## Deployment

**Digital Ocean Kubernetes Cluster**

app live at www.weilyuticketing.shop    
***Update: the kubernetes cluster in digital ocean has been stopped***


## Frontend Client

#### Built with NextJS    

  `Minimalistic ReactJS framework for rendering React app on the server. https://nextjs.org/`
#### Routes  

- /   
  `Show list of all tickets`

- /auth/signin    
  `Show sign in form`

- /auth/signup    
  `Show sign up form`

- /auth/signout   
  `Sign out`    

- /tickets/new    
  `Form to create a new ticket`

- /tickets/:ticketId    
  `Details about a specific ticket`

- /tickets/:orderId   
  `Show info about an order and payment button`




## Common NPM Module

All the commonly used classes, interfaces and middlewares, etc. are extracted into a published NPM Module.    

- `@wwticketing/common`: https://www.npmjs.com/package/@wwticketing/common    

  Contains commonly used Middlewares and Error Classes for ticketing microservices   

  Source codes: https://github.com/weilyuwang/ticketing-common-lib



## Backend API

#### Microservices + Event-Driven Architecture 

- NATS Streaming Server

#### Optimistic Concurrency Control

- Leverage `mongoose-update-if-current` npm module to update mongodb documents' version.


## auth service

- GET /api/users/currentUser  
  `Get current user's information`
>
- POST /api/users/signup  
{ "email": "test@gmail.com", "password": "123456" }   
`User Sign up`
>
- POST /api/users/signin    
{ "email": "test@gmail.com", "password": "123456" }   
`User sign in`
>
- POST /api/users/signout   
{}    
`User sign out`


### tickets service

- GET /api/tickets  
 `Retrieve all tickets`
>
- GET /api/tickets/:id    
 `Retrieve ticket with specific ID`
>
- POST /api/tickets   
 { title: string, price: string }   
 `Create a ticket`
>
- PUT /api/tickets/:id    
  { title: string, price: string }    
  `Update a ticket`


### orders service

- GET /api/orders   
 `Retrieve all active orders for the given user making the request`
>
- GET /api/orders/:id   
 `Get details about a specific order`
>
- POST /api/orders    
  { ticketId: string }    
  `Create an order to purchase the specified ticket`
>
- DELETE /api/orders/:id    
  `Cancel the order`


### expiration service

- BullJS    
  Use `Bull.js` to manage job queues, with job delay option

- Redis   
  Use `Redis` to store list of jobs
 

### payments service

- StripeJS     
  For handling payments

- POST /api/payments   
  { token: string, orderId: string}   
  `Create new charge/payment`
