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

To do...