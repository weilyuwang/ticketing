#### Set up ingress-nginx controller

Check `ingress-nginx` documentation: [ingress-nginx](/https://kubernetes.github.io/ingress-nginx/)

Docker for Mac:
`kubectl apply -f https://raw.githubusercontent.com/kubernetes/ingress-nginx/controller-0.32.0/deploy/static/provider/cloud/deploy.yaml`

---

#### Set up mock host name:

> **To redirect requests coming to: ticketing.dev => localhost**
> only for local development purposes

- MacOS/Linux:
  modify `/etc/hosts` file to include `127.0.0.1 ticketing.dev`

* Windows:
  modify `C:\Windows\System32\Drivers\etc\hosts` file to include `127.0.0.1 ticketing.dev`

---
