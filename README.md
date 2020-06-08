#### Set up ingress-nginx controller

[ingress-nginx](/https://kubernetes.github.io/ingress-nginx/)

Docker for Mac:
`kubectl apply -f https://raw.githubusercontent.com/kubernetes/ingress-nginx/controller-0.32.0/deploy/static/provider/cloud/deploy.yaml`

---

#### Set up mock host name:

modify `/etc/hosts` file to include `127.0.0.1 ticketing.dev`

> For redirecting ticketing.dev to localhost - only for local development purposes
