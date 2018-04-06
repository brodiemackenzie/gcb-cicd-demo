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

### Creating a build trigger

In the GCP console, nagivate to Container Registry -> Build triggers, and click "Create trigger" (or "Add trigger" if you have previously created a trigger).

![alt tag](https://00e9e64baccb8fef77f1faa7a5231429d0aa752bcfe653f1bf-apidata.googleusercontent.com/download/storage/v1/b/bm-github-images/o/gcb-cicd-demo%2Fimages%2FScreenshot%202018-04-06%20at%202.31.21%20PM.png?qk=AD5uMEvGQeaCx77uI_tOr8HHxP2anZpFJrV6rkoadkyC9-E6yMzfC0WxtX2VP0FJldyQR5SokPJL86V8O9WiAXI3VA3FSO7d2586awgjgy7-8KEWMjFpmM4I-Y8M-zapQfwRobq5CcJS3mv8Gufv-bt6jGJERrPiKonLSEP-qh83XgYRXUD9YejBPyn8O7tz2i-bjNhP_WScIcAFMQ1e_v15faaBk3DKJfDwHB0hoKV5fN_IePTScyr83_pW2KZ2uguPgPcQW1fO3Js1od-9QRU2e_S5NDjJU5O4rteCsECn0uIZGvph_7suCHS4mw2pxiKTsQmEibdWzNUnXX5yJcvEiQ0UxwWWxlzK4UI6k_k6MH3WyCak34Y6M-pE65q2ITbaxdCs2p_SkZRsl8qdpBrwR-kj_NGtM_DAgzY8fkonIJeZe6pStCsm6CUBLhKPjETOE95cF28QjAbdmhXsuV5KCWQfoLwXieD6ih6sThTLh2MkbemrnehBuQaqn5XQayuUO6sDzs3Jf8glA1pr06luL7609PWSxNHzNp9ASrNkhCG_A6XoLUa0d840A6iPwkUjIlt5RCCpxT6FZIk89gpUzZOHVe9fMI8KeOmDN_C0LRI5qiDs6tCgr0KMeWkQHtaF1LD49beQf5kdVATeNlg_dYpNBQeGVy7woG8mwedlfbSpgzNwGuDX5SRxrQNjIv50-iSeJmv1kHHxXvQCUJQBZwoKNCRLAS9t7AXHvwQ4d3XvXhy05EIQkJLsXgXdmwVH9ew8tJ98ATkAeRTJMLbH1lcTybKFYJtA03AiBeIPPO59ioGTt1lgzlekqFH0_uTdLd3JMblR)

Select "github" as the source and click "Continue".

![alt tag](https://00e9e64bacc7ad6fb47e36c115a3ec10b15493baa652817bb7-apidata.googleusercontent.com/download/storage/v1/b/bm-github-images/o/gcb-cicd-demo%2Fimages%2FScreenshot%202018-04-06%20at%202.32.15%20PM.png?qk=AD5uMEuiGn08n88YBxMIL2CNw1Mo_jEX4x6EGbe-9zEy87NLsiCT6eaY-3RIsZ-1cWrZuNYQoi1TNNvK1_UbF4SG351WIZjVeRo_hvCM3yVG-Y6K7Ngilh2XovFqrbPI4o7oWcPppRGws0VuPEqwZuECbuC-ziBMB5PQRF6wV-CcFQI8qjNpw4uu752J0QMCBSDXCEMM_Gsw7lrbKg7MyAgX_KUyLEk6mPrlnPJtdqDkMscAkicRr6Ii7NmDLP2kQcBgnm_x4fLM49xbZrHglojIajxG4F9VPhnO2zZ8f6Q64IlcrvtlrsR_TczbBtFouyvvtU-VRXzB1tMwm5qlarwhPwQoUDFaERJB-8bNgIwpcHfw_Xcrku9NiUItypTwyW4WlRdL5bQovmzA3Ybq31zLnU4zt9FHPNf02Vz0MsPeFS1uZ-9AYWvceLiKrAAPqzAQsQXaF6quIqgfIe1O5QxNqeQPVI_ETrgU-Pw7ciBnAnla9n5T6c5Qzn4BGjpILe0ogVnN_zbPIhvMp9HrdsaMPHccakaWeMXlc4kN3R7eHNzQQIJ_NFncGmiAM2IDAjvVh65eG-2H9YRnPY_eoCb4lOJzoHChEggV0LwQsZSTrwhH0jLAUV2LuE0Jz15gu0y6-4WU1Pqk09e0rPV_kUI3gDuG60itMB3p2gk80OBQg41JIGQHQQySFMbzq8cOB8mBykS7eYXldnY-tI_yy2Gpxxp_Y5PL7o_59kP1Ev5cwqhCSSmY8DxPXUcalPV1amnclzBMOVcP07Uq46pNfMHl4sB3xGqpx0Bhgixft6Qze6cksFwFXvUW9xse7XURIuDekjwk76ke)

Authorise GCP to access your github account (you should only need to do this once).

![alt tag](https://00e9e64bacbdc459137b8f6551c1ccc75b61270130211a01e2-apidata.googleusercontent.com/download/storage/v1/b/bm-github-images/o/gcb-cicd-demo%2Fimages%2FScreenshot%202018-04-06%20at%202.32.41%20PM.png?qk=AD5uMEvSj3TzaBI3R7O63Ne2ktyq-lwmJfkzc4gYRmbfEdoubzgUT1vJrLasjWVn0mbs5q07kVAfkcSsXdOYRZQe8d90iUNIeSHvP5VhMmwlyN2AKOY8qPCUPBH457THBbC6LV9pSmsNaXqESRyS9K-T3x7RkUpRY_gnX3xZyHTX_rpk2HtBHJjLMbjagQsDk3ZJ06IEjtG1UMN-pYp0FcVPjqUoZLRf0jtiurPMf-Sv4cjeEpfWtqp_MH29AVujTRpU7sY8eYlVXGptvJB_f-RvPAavise0xVfvM6FN26kawH9rzqa2sp-Xtjkej-QuKekA4ykNymC0E3lDKB22oPDrs5JLoxu_auTc1r_wU4-BAGjGLJCQONIDW2QfBnDiQHuTODYMWPCeXlRi8Tqh1snY0uYJqgFvLTvbcBR3uz_ZUSQYALEoY2DtoAPsI5abB-EvgD1QOjkkfbmtJsTxmeFUDzix9lvjb7Xw8iP4Ez2ZPOx899V4Ppke5zYWLkz1KWNpqFDPo_uos938uqq7seZ9iuB6ye22CFtAp0fqT1-aH9QO5v-haonBlySm7Wpk3IGyq6CzwFDXsuOFd3KLlRDDVKYyraHdXyXy-CQZGlZx6tZfTBdUVe2QdE-T4RlodOGRPQFaFjcdwUs17QdSFEIaRF04Xe4J6vWVGQQD0WZiKfp3rbvrM6SfzMXT2ZSKYw83evpQ16VWB_-SOBQvyHzRlf_bNrs5GWR2wSwmAXoKd8HvLC7TVuD2I8H6lmj_JbFy4dagg5Q_De0C7DmLtfwV0K_GfH5BC-Zf_bRhhxPrJGTiwpIg110BeNiFSbxe-2YjOL5ha38U)

Select the "gcb-cicd-demo" repository (filtering if required) and check the box to consent to GCP collecting and storing the authentication token to connect to the repo. Click "Continue" to proceed.

![alt tag](https://00e9e64bac9be839600eb7611816fcb4e8d472da9c698ad1de-apidata.googleusercontent.com/download/storage/v1/b/bm-github-images/o/gcb-cicd-demo%2Fimages%2FScreenshot%202018-04-06%20at%203.15.45%20PM.png?qk=AD5uMEshIh6-u54JSc9Jwv_aPi-ceHWwqMqx8KDcJT7H8qXdZaOpkJeJJV9S2hP4ckm87z4RX134MOZMrSiDP8SFKN5IvqtjOJvi9DUF85o9-GQzfjhJdC6IQUFpU4d9Bxgw0tC02R1TWSeP8ty0pnggVvGFKkbL1LxN1fl9WbxOqmP7IAHq1Y5fXJDFeM7MBXeje0zcJiHNR0x6-P_bdWUm1DzD22P-y3fmIx9-7t2Jdyr2k8yHYWNxaOx7L3_bG3bT1TPI7uTHPobFRiHsJvBqOtsbEHnIHQ1AHb_NUUw2iH3QNHDFSn-Ayy4FDi3uGNllYeAQPWUr0NfUx2YnH0ZcpR4EttAZGeFyoCABqTYc4pgLHw3pjaxd3HsHplb2LxSSe_NGyOGUf0HMazC7R_v9EWG2iy8HmAXc8A8EfsTIVL1SfB55nIstiMG6vltpoqImsz8KP0Az0oq5BGi86m5IlS8WNmFD1BsQywbk6_D1CQiWqLM0Rj3u1QzQjlcS_y3R4VRX8LnHTAiQ1KwiUBc7Xo1jQZG--QWrqwCix-JBOMIAs_rakoS8_FY9Q5gmClNye1gS73rXaMZtBpaTkm2HmxaLpGbWAT3nVPoDn49HhtYYLruJaDgJ1jIHJZwnSIElGqXvyS4z_BIIvyacQwV3zpQaKoAAAw-l6Gz1TpZZRiO2Elh_DxgYi9NxnOqkldlXb8XnflTSuHjDaTslXE38tmCjkY04dOk4au-Yv7oIl1okFETYLlhY98o1PYi5AtX6qCQgTjw5NlG2IqZISexTyPruAjP7DI_m8T9FMLbExlSZqE4PxLIu2itPgsnhViPWw-qRyuyx)

Name the trigger "github-trigger", select the trigger type as "branch", select the build configuration to be a "cloudbuild.yaml" file, specify the location of the file within the repository as "/flex-custom/cloudbuild.yaml" and click "Create trigger".

![alt tag](https://00e9e64bac682dfef1aca521b919df3a24dbd042f3ef683835-apidata.googleusercontent.com/download/storage/v1/b/bm-github-images/o/gcb-cicd-demo%2Fimages%2FScreenshot%202018-04-06%20at%202.35.48%20PM.png?qk=AD5uMEuNc2qW9ZBW2xeAqb2asLiHXWLqbRKX5GT48WXlleNyV9t1MzfQhkZpLkjjC7pf9JXVrwaOcXAvKeWnWmsKlxBmLrrjCzG0C5xhTF3ZTzGosQFPO0Svs7WoNnJrw6LB1LQYAJtGu9_PNJO8IE5xMjCu31vTzQSbIgf8LbljnO7H68zWoD9zfVQc-N82kz0eA3eAVR-gaIYiqGCOjVSTDjkbd7p7rvV1omkf-OBah1_MK6PcB3lHIkXuuJ3vxoOPXUnahHUr0YS9qh7btV4h2FK2G1z3u4g_9cHJ9QwOPNAhnPQseE3s8J445XcSMWHmBVKUDbyI8vqLRxpdCju7m8VsxZdTAyGQ-m88-04ayF17lcA6kbnaiK7zndo-t-DvpWMZdyNPwpy7IlLiR_aF25NpKkbCOLMzQro5a2hbrsWgRQxHEyDrRX550GAQ0ZQrUTu2kD08-ToDj_FnTdOFt0vlhD4ivYQYxMqbQPHrtFY-BdXW9RWLKEPxmozK6JBm93YGOnwLnDlnR64H_itYaWX8x26prJWipMKyWuWoNDmsJ02KeJPqHyyfnPfEhMT9BsCWjaLw7ecyAS9MX0xJ1zL2L1xlDaLP206bcr57G_kMNLXg21Lhp9SD70Y3uQ04ky7G-Stp7qsmKkSrO-4iqw6YQAB4JPhbPj9UszuK21luQMlsAh79Cy3857981I_3OIydRYlecZyWC5T9JBTM7t9BNMrF6YVmsUPZ-HPm7F_fNGkcZNrLTeppYNci5ce6XTBWSQpvv28u1SwL1U5cpXJbv6is3LMX33IVDhvquQPqIUlFAWGKDoaf_tTrtLzrs3_Otsdu)

The build trigger should now be setup. Whenever a change is pushed to any branch in this repository, it will trigger a Container Builder build as defined in the "flex-custom/cloudbuild.yaml" file. The build can be triggered manually by clicking the "Run trigger" button. Running builds, completed builds, and their logs can be viewed in the "Build history" section of Container Registry.

![alt tag](https://00e9e64bacae5731144e84edfb6cca0cce1413287886d229cd-apidata.googleusercontent.com/download/storage/v1/b/bm-github-images/o/gcb-cicd-demo%2Fimages%2FScreenshot%202018-04-06%20at%202.36.18%20PM.png?qk=AD5uMEusCtKGW2KICMUauua4AECLVXbpAfdAS0q86beHlDiB6EEFhUA3A5bWO7waNdaG3csgtqJHXpoXKctdp5VnXoX1-kBQTIQ8LyJ_btaYZQmxZAcigjSef1xY0i13MHsjX4ZtrVIT1ZlYnk4t51gilg-_b_-KQj8ybJu89f3ZB18e-_TsE0O7z26nbbnC2zagWFyj-53VRbuTzFIRKNa64ASAOLiXTtHPtpOlgKvzmdQW3J271MLiBGIqwvWWzC4SytLX_iEb7-QlgmS0z8puNLjAjKoH4a0NSK5mgzJxS_zdCAWRHf3cOQSUGC5uOpAlcBcBoolekrO_VbzOTHatxjviNRPOAZpcZbU9GuqfDG5D0iUBPpoppD0YjSTW-4irLmgX1FarvHGHCpdsgQhRb2oQDH3QoK2UU9OqfEWJo6f2e19jh_b3OdNcV9NhGC4QbcjJBjZxdmxx-rCUBTUKOEJ7_i2U0FDbZ0Ypx35WpGwJXnpspshmi5Md6vNMd3CI9kZQtiHjq6sbo14jilJ5IAFjS_Xoz05mqqngkTt6gG_Wh8ik1lsZQyDDe7YvfSdarAxAKac0G3o3gvG7hTyOx8xwhqU0cp61OPlRZfMvKt0sWcsQ-_M-zje2-hKvRAyqJOUbqEYjNpgM-E20QDo_fSIOJJ_uk86gSFGK0BJzPrfrsZ44Y911SIDv3NsOCLapvOAx1SiDsO72y32ZZnumOU92rT2P7fwxB2YMNW1Zz9xN75B8DdseRLUXYCtVW-g0VyFlIlHhc69RLZHyqngA2dZY15G0V27RzTgfcq0XDNzXhItXF4tpgeg6kPUmvJFws5euNzAm)

### Triggering the cicd pipeline

In the flex-custom folder, edit the index.js file to display a different message.
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

After a few minutes, the new version of the AppEngine app with the updated message should be accessible.
```
gcloud app browse
# Click the hyperlink
```
The page should now display "Hello Github! (custom runtime)".

### Clean up

To do...

## Authors

* **Brodie Mackenzie** - [brodiemackenzie](https://github.com/brodiemackenzie)
