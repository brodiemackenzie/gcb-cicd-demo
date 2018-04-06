# gcb-cicd-demo

A short demo of continous integration and continuous deployment using Google Container Builder with a simple Node.js web app. 

## Getting Started

These instructions will get a copy of the demo up-and-running on Google Cloud Platform. 

### Prerequisites

Access to a Google Cloud Platform project (with Project "Owner" privileges) and an account on Github is required for this demo. 

### Installing

Fork this repository to get a copy of the code on your github account.

Clone the repo to your local environment (I recommend using Cloud Shell on GCP as tools like gcloud, git and docker are already pre-installed).
```
git clone https://github.com/[GITHUB_USERNAME]/gcb-cicd-demo
cd gcb-cicd-demo
```
If not already enabled, enable the required GCP services (this can be done via gcloud on the command line or via the GCP Console Web UI [APIs & Services -> API Library], searching for the appropiate service and clicking the "Enable" button).

Enable the Google Container Registry service.
```
gcloud services enable containerregistry.googleapis.com
```
Enable the AppEngine Flex service
```
gcloud services enable appengineflex.googleapis.com
```
Enable the AppEngine Admin service
```
gcloud services enable appengineflex.googleapis.com
```
Initialise AppEngine by creating an AppEngine application in your preferred region (run 'gcloud app regions list' to see available AppEngine regions)
```
gcloud app create --region=[PREFERRED_REGION]
```
Give the Google Container Builder service account the role of "App Engine Admin" (via gcloud on the command line or via the GCP Console Web UI [IAM & admin -> IAM]) to allow Container Builder to automatically deploy apps to AppEngine.
```
# Save Project ID into environment variable
export PROJECT_ID=$(gcloud config list --format 'value(core.project)')
# Save Google Container Builer service account ID into environment variable
export GCB_SA=$(gcloud projects get-iam-policy $PROJECT_ID | grep @cloudbuild | sed 's/.*[:]//')
# Add role to service account
gcloud projects add-iam-policy-binding $PROJECT_ID --member serviceAccount:$GCB_SA --role roles/appengine.appAdmin
```  
Test the build and deployment pipeline manually by submitting a build job to Container Builder.
```
gcloud container builds submit . --config=flex-custom/cloudbuild.yaml
```
Browse to the AppEngine App to view the deployed Node.js web app.
```
gcloud app browse
# Click the hyperlink
```
You should see 'Hello World! (custom runtime)' displayed on the webpage.

## Creating a build trigger

In the GCP console, nagivate to Container Registry -> Build triggers, and click "Create trigger" (or "Add trigger" if you have previously created a trigger).

![alt tag](https://00e9e64bac6125c7d350a6221ffd204bda7453394947c50766-apidata.googleusercontent.com/download/storage/v1/b/bm-github-images/o/gcb-cicd-demo%2Fimages%2FScreenshot%202018-04-06%20at%202.31.21%20PM.png?qk=AD5uMEuXjHqh0YmlvcEhAoMUKxeoJPKF76XbdmIZ5UxcM4515F2T7JmZ45X5eZfPdshnwvrzfTKg6OYjf284AepdbuSUMnswOIQpq7WYDydW7vLAWq2HXD70tapIoJM6fYoLwrE-B_KKPlOSVN6NpY4jBzTKk_sj7jmWj1vt8wWhJKeMN4G5-JWb78yuWeNiVMhlbWeWkK1HfRm-AuO6yaqA60Sn1AkUoh7Kj8V_IuYQyutvMl1Jg9c8Kxa8c4nd_tzdIPXfE4EI4jI24OXxDTPXRplRXRpLc23Y0HjZDZ9WlABNsCcCpJa0Zoav2wNnAzlthIsDJA_TOpEbxrZaeIe2OGOrybo0mJnH3sZHz4Q_eMyjbnF6cRIuvgUrmuwd1fEiiBSENfDBXmLAEs-3Wq0QVscQKZvB8m6psRGND-EeHEcoCn_7aE9No8x1hkmMAiUZj4ZqUpJxtmEiN3qXmyEZjWMaqh_z_eW8-oBOHRuHc-Mt7FZwzRKXtPCFsqjvh1cpK-h86rspRmKbcYdoKcyOBlWxoAUET2O9---j-fCdzNM7dioSI58Wi-NbZmc4fgRHuqbUd46rhxbZn68hFyeNMxilFDjmQpODO6KfF_VcZH_jzheiH6c2ye7ou_fZzmEbIhoYbTjX_OpLY2YpSK3zeiSYdxexC51Fmkbg1BQXGFSUqx8k_Ibj29RugUsomjqrxUlTuC5rP3o5Tc1_5FyMQx-a2W0-qP7u0mWOK7KuLX08fbt2YtE2kxMzpkGGsvrrxgeIBqV6jUQupu1IMWQMRpWJ3WiXrbaChyJ5AqQkBYzLD8aGGDdjAFmQ_Z7ZQldlzhy8iWq5)

Select "github" as the source and click "Continue".

![alt tag](https://00e9e64bace66718770580fc02eeed92febd7b9dc7529025d4-apidata.googleusercontent.com/download/storage/v1/b/bm-github-images/o/gcb-cicd-demo%2Fimages%2FScreenshot%202018-04-06%20at%202.32.15%20PM.png?qk=AD5uMEveguqKjYTSIDPdtX-Fnu9D_iW7gV6XGSRVGLNMxXKt4DdXmTlSudtmMoMovgT_prLoH2YxuCMf0wZ66DIQec8g5_BDefuoKzt3o8GJnc2S6rDwyFlsTXwPQzEl1C9xeD5nNyr9k5Und9JG8nJUEzwJAJaGjf9e2u9sy9wHQCQKF-IXAFq-qeDodiezLSUCDe8BJRMPOG3dDn2I0jKxSSEGpxSI1fpNgn7PNP6rhYR7Jhkh37m7_X_n-ABc153LZOF8yN7Ysb_GgRpWO0ticdtLuz9JL_M4AW6Nx5kks20GFZDL2LNQghQpCdoY1tXd4ROW5-ei23x7_phWXdWJ97BCNtw9dQzaF7ejHffo9qmGpKP9WAhF0vhMpxDBUh7Mr0eq6xvRrABeMzNNLKKXwZSMfYMSxnh48wCaay30SdAb4DeuXDCaTNPSb7qdsw2rofYa7-m8zP23qH1PSUnZall3JdMlGKYEp79Tw81tNl4tivpk7O1t4p8A54DSWCQ4wC-VSMQtv1vszQ41a8r_1rBKbv6plfZWUY8QOalhcTequGYeKLJP-apZ3X7Z3ry5PFpd9kcC0lUpb5cNLeXX1cJ0naKXWFvQle1z-_b4X4E1sDJR6Oj-7vXk6JB-VGfTa67mKUAeSqYBC9N5YqNMlUB-tQCHmo-dcgl_omrGuC2uOuLNCGQeMY3lbbQ6a0NqMqxw8eqUWx-QxgYD8rGNLJBtYbtc7yvzPFW-IBznbL5sK51guZsSOkhY6bhUU4x_TVzg9rharL8BhUlFD5yYduiLZGhEAAeQaB-yQ6vT8Ywij7aef9LfHww9KCMwuooPMs7m4e8D)

Authorise GCP to access your github account (you should only need to do this once).

![alt tag](https://00e9e64bac13de107dab0673fd462722c1ca54065c25ea2257-apidata.googleusercontent.com/download/storage/v1/b/bm-github-images/o/gcb-cicd-demo%2Fimages%2FScreenshot%202018-04-06%20at%202.32.41%20PM.png?qk=AD5uMEsLEz6hha0mHIctWs1R3x1rXmAva_sTQQzyqTTvft8B5kYy8dsVzgaN7izvYOJBwDbwGZ5ckWmM25AmXpCYB0WFOQf7jqmH56MWDy3RD4zMi8-_as9rMTDoVi94aUXlJp7xMd5R6XG_ACt6Pi8a-w_cXxd48Ash1jFaRsCmBzoxJ-TvwJY_O-fAZF2tl70m0nE-RHjV8SUDGzDY43kCd9N91klOgMyaoUgMjou1uxp98SI7iKpF7KHyED-qMf0JaVNhvPt9-gzabtCXYC1vJnEoFtKWrfoolEssk4RPbnEmNjHHS4Akza6v1qJBqCsoubYqwlYq_BSt71VyGhBcLAA69Vq9ykgXWItUDMIwYRYoBlp5ZH4jU9GRzuyK_D_Mbpwz8gx59dfdGFS32dzXyabjhSlIdIJaD-4WOOqb9jLkgzSJ5oqNBzR60yG4fnnLxWS3Mv3nT4aP851zaxUILHQ4H61ROpVjfl7IEH1ovo8aRU_Ut05cIKhl3gKt0Xb53Vl10ditaOLDIKUS1l87fjUWOf_Pnq08CIFciPbj6uWsoYx3oUqocfaW6M40R_RYLP0t4wsk_AD80trZ4UmEi3YFJnZgZBn5BAaoSHcIzFumaCEuWIxwnK6LDemgY1zT0QfiKwmKUHHOej08Ku33KaukBll8II93ZCjE-IApyMgHOgG-rTUkArkeERSYV05CTjPXOLa1Gh3eaW4OVppuKdvUzKDSsa2KRMWcOgvbb6qKmmi1nGGixBxI1Ba6A0kxD-B-f6Q3oTRTmUyOu_duW0EVJdJ3oaYu2p6Aq6QzrOW2qj8fMhv-jyPiyneIMt-m7PeSyWVz)



![alt tag](http://domain.com/path/to/img.png "Description goes here")
![alt tag](http://domain.com/path/to/img.png "Description goes here")
![alt tag](http://domain.com/path/to/img.png "Description goes here")
![alt tag](http://domain.com/path/to/img.png "Description goes here")
![alt tag](http://domain.com/path/to/img.png "Description goes here")

