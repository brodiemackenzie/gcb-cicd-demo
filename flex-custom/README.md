# gcb-cicd-demo

A short demo of continous integration and continuous deployment using Google Container Builder with a simple Node.js web app. 

## Getting Started

These instructions will get the demo up-and-running on Google Cloud Platform. The overall process is as follows:
* Setup project
* Setup build trigger
* Trigger CI/CD pipeline
	* Install required npm packages
	* Run integration tests
	* Build Docker image
	* Push Docker image to Container Registry
	* Deploy Docker container to App Engine Flex (custom runtime)  

### Prerequisites

Access to a Google Cloud Platform project (with Project "Owner" privileges) and an account on Github is required for this demo. 

### Setting up the project

Fork this repository to get a copy of the code on your github account.

Clone the repo to your local environment (I recommend using Cloud Shell on GCP as tools like gcloud, git and docker are already pre-installed).
```
git clone https://github.com/[GITHUB_USERNAME]/gcb-cicd-demo
cd gcb-cicd-demo
```
If you haven't already, set your account's default identity in git.  
```
git config --global user.email "you@example.com"
git config --global user.name "Your Name"
```
If not already enabled, enable the required GCP services (this can be done via gcloud on the command line or via the GCP Console Web UI [APIs & Services -> API Library], searching for the appropiate service and clicking the "Enable" button).

Enable the Google Container Registry service.
```
gcloud services enable containerregistry.googleapis.com
```
Enable the App Engine Flex service
```
gcloud services enable appengineflex.googleapis.com
```
Enable the App Engine Admin service
```
gcloud services enable appengineflex.googleapis.com
```
Initialise App Engine by creating an App Engine application in your preferred region (run 'gcloud app regions list' to see available App Engine regions)
```
gcloud app create --region=[PREFERRED_REGION]
```
Give the Google Container Builder service account the role of "App Engine Admin" (via gcloud on the command line or via the GCP Console Web UI [IAM & admin -> IAM]) to allow Container Builder to automatically deploy apps to App Engine.
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
Browse to the App Engine App to view the deployed Node.js web app.
```
gcloud app browse
# Click the hyperlink
```
You should see 'Hello World! (custom runtime)' displayed on the webpage.

### Creating a build trigger

In the GCP console, nagivate to Container Registry -> Build triggers, and click "Create trigger" (or "Add trigger" if you have previously created a trigger).

![alt tag](https://storage.googleapis.com/bm-github-images/gcb-cicd-demo/images/Screenshot%202018-04-06%20at%202.31.21%20PM.png)

Select "github" as the source and click "Continue".

![alt tag](https://storage.googleapis.com/bm-github-images/gcb-cicd-demo/images/Screenshot%202018-04-06%20at%202.32.15%20PM.png)

Authorise GCP to access your github account (you should only need to do this once).

![alt tag](https://storage.googleapis.com/bm-github-images/gcb-cicd-demo/images/Screenshot%202018-04-06%20at%202.32.41%20PM.png)

Select the "gcb-cicd-demo" repository (filtering if required) and check the box to consent to GCP collecting and storing the authentication token to connect to the repo. Click "Continue" to proceed.

![alt tag](https://storage.googleapis.com/bm-github-images/gcb-cicd-demo/images/Screenshot%202018-04-06%20at%203.15.45%20PM.png)

Name the trigger "github-trigger", select the trigger type as "branch", select the build configuration to be a "cloudbuild.yaml" file, specify the location of the file within the repository as "/flex-custom/cloudbuild.yaml" and click "Create trigger".

![alt tag](https://storage.googleapis.com/bm-github-images/gcb-cicd-demo/images/Screenshot%202018-04-06%20at%202.35.48%20PM.png)

The build trigger should now be setup. Whenever a change is pushed to any branch in this repository, it will trigger a Container Builder build as defined in the "flex-custom/cloudbuild.yaml" file. The build can be triggered manually by clicking the "Run trigger" button. Running builds, completed builds, and their logs can be viewed in the "Build history" section of Container Registry.

![alt tag](https://storage.googleapis.com/bm-github-images/gcb-cicd-demo/images/Screenshot%202018-04-06%20at%202.36.18%20PM.png)

### Triggering the cicd pipeline

Edit the index.js file in the flex-custom folder to display a different message.
```
# Change "Hello World!" to "Hello Github!"
sed -i 's/World/Github/' flex-custom/index.js
```
Add the modified files to the git index.
```
git add .
```
Commit the changes.
```
git commit -m "change message"
```
Push the changes to the master branch in the github repository. Enter your github credentials when prompted.
```
git push origin master
```
This will trigger a new Container Builder build and can be viewed in the "Build history" section of Container Registry.

After a few minutes, the new version of the App Engine app with the updated message should be accessible.
```
gcloud app browse
# Click the hyperlink
```
The page should now display "Hello Github! (custom runtime)".

### Clean up

#### Disable the App Engine app

In the GCP Console Web UI, navigate to App Engine -> Settings, in the application settings tab click "Disable application" (type the app's ID to confirm). With the App Engine app now disabled, the app will not be accessible and you will not be billed.

#### Delete the container images from Container Registry

In the GCP Console Web UI, navigate to Container Registry -> Images -> hello_npm, select the container images to be deleted and click "Delete". Note, this will only delete the Docker manifests for each image, the individual image layer files will need to be delete from the appropriate GCS bucket.

#### Delete the Google Cloud Storage buckets created by App Engine, Container Builder and Container Registry

In the GCP Console Web UI, navigate to Storage -> Browser, select the appropriate buckets (listed below, replacing [PROJECT_ID] with your own project ID) and click "Delete".

**CAUTION:** deleting the artifacts.[PROJECT_ID].appspot.com bucket will delete all container images (layers) from Google Container Registry.

* artifacts.[PROJECT_ID].appspot.com
* [PROJECT_ID]_cloudbuild
* [PROJECT_ID].appspot.com
* staging.[PROJECT_ID].appspot.com

#### Delete the build trigger

In the GCP Console Web UI, navigate to Container Registry -> Build Triggers, click the menu on the right hand side of the appropriate trigger and click "Delete".

#### Disconnect the source repository

In the GCP Console Web UI, navigate to Source Repositories -> Repositories, click the menu on the right hand side of the appropriate repo and click "Disconnect".

#### Delete cloned repository and forked repository from github account

Delete the repository that was cloned to your local environment. Delete the repository from your Github account.

## Authors

* **Brodie Mackenzie** - [brodiemackenzie](https://github.com/brodiemackenzie)
