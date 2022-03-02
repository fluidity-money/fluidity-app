# Deploying Fluidity Money

There are 2 github actions for this repository.
 - **Build**
    - The build action will by default only create images on the `main` and `devops` branches. If you want to build and push images from another branch, add your branch in the `.github\workflows\build.yml` file. 

    - The images that are built images are not deployed to the EKS cluster, only pushed to ECS.
 - **Deploy**
    - The deploy action will fire on the `main` and `devops` branches when there is a v*.*.* tag set. 
    - It will push and tag the image to ECS
    - Trigger an update of the EKS cluster with the tagged version.

### Managing the Cluster

##### Prerequisites

_Install the following_
- [eksctl](https://github.com/weaveworks/eksctl) 
- [kubectl](https://kubernetes.io/docs/tasks/tools/install-kubectl-linux/) 
- AWS CLI 
- Configure AWS CLI with your an aws access_key_id and secret_access_key  


#### Create the stack (if it's not already running)
` eksctl create cluster -f ./.k8s/cluster.yml ` 
###### Deleting the stack
`eksctl delete cluster -f ./.k8s/cluster.yml`


##### Update your local kubectl config to use the cluster
`aws eks update-kubeconfig --name fluidity-staging`

##### Update the kubectl config secret in github for this cluster (if you created a new cluster)
` cat ~/.kube/config | base64 `

Copy the output and update the github secret 

##### Check the cluster is running
` kubectl get pods`
You should see something like this
```
NAME                        READY   STATUS    RESTARTS   AGE
fluidity-6d65b69c54-zr5rf   1/1     Running   0          5m22s
```

###### Check for nodes deployed nodes
`kubectl get nodes`

You should see at least 1 node
```
NAME                                                STATUS   ROLES    AGE   VERSION
ip-192-168-23-232.ap-southeast-2.compute.internal   Ready    <none>   94m   v1.20.4
```

##### Optionally test it using the test pod

 `kubectl apply -f ./.k8s/test-pod.yaml`

###### Check that the pod is up and running:

` kubectl get pods`

You should see something like:

```
NAME      READY     STATUS    RESTARTS   AGE
demo      1/1       Running   0          4s
```

###### Check that you get the logs you’d expect for a ping process:

`kubectl logs fluidity-test-pod`

You should see the output of a healthy ping process:

```
PING 8.8.8.8 (8.8.8.8): 56 data bytes
64 bytes from 8.8.8.8: seq=0 ttl=37 time=21.393 ms
64 bytes from 8.8.8.8: seq=1 ttl=37 time=15.320 ms
64 bytes from 8.8.8.8: seq=2 ttl=37 time=11.111 ms
```
###### Once you're done, delete the test pod 

` kubectl delete -f ./k8s/test-pod.yaml`

##### Manually deploying application to cluster  
Run 
`kubectl apply -f ./.k7s/deployment.yaml`

You should see
```
deployment.apps/fluidity created
service/fluidity-web created
```

##### Discover external address for load balancer 

Run:
`kubectl get service`

You should see something like this
```
NAME           TYPE           CLUSTER-IP       EXTERNAL-IP                                                                    PORT(S)        AGE
fluidity-web   LoadBalancer   10.100.102.130   XXX-XXX.ap-southeast-2.elb.amazonaws.com   80:30467/TCP   13m
kubernetes     ClusterIP      10.100.0.1       <none>                                                                         443/TCP        37m
```

`XXX-XXX.ap-southeast-2.elb.amazonaws.com` is the url you're after, wait a few minutes for the dns to propagate and open it in your browser to view the app

##### Running the application locally

###### First login by running
`$(aws ecr get-login --no-include-email --region ap-southeast-3);`

###### Pull latest container from AWS ECS
`docker pull 366391327654.dkr.ecr.ap-southeast-2.amazonaws.com/fluidity:latest`

###### Run the latest container
` docker run -i -p 80:80 366391327655.dkr.ecr.ap-southeast-2.amazonaws.com/fluidity:latest`
###### or a specific version
` docker run -i -p 80:80 366391327655.dkr.ecr.ap-southeast-2.amazonaws.com/fluidity:v0.0.8`
###### or a specific branch
` docker run -i -p 80:80 366391327655.dkr.ecr.ap-southeast-2.amazonaws.com/fluidity:devops`


#### Testing / whatever
_Finish this_

### House keeping

#### TODO 
- [ ] Update .github/workflows/deploy.yml to update the cluster with the latest image  

#### Handy Resources
 - [Creating a cluster](https://eksctl.io/usage/creating-and-managing-clusters/)
 - [Writing K8s yml files](https://learnk8s.io/deploying-nodejs-kubernetes)
