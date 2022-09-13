// Copyright 2022 Fluidity Money. All rights reserved. Use of this
// source code is governed by a GPL-style license that can be found in the
// LICENSE.md file.

package aws

import (
	"crypto/ecdsa"
	"fmt"
	"io"
	"strings"

	"github.com/fluidity-money/fluidity-app/lib/log"

	"github.com/aws/aws-sdk-go/aws/arn"
	"github.com/aws/aws-sdk-go/aws/awserr"
	"github.com/aws/aws-sdk-go/aws/session"
	"github.com/aws/aws-sdk-go/service/ecs"
	"github.com/aws/aws-sdk-go/service/s3"
	"github.com/aws/aws-sdk-go/service/s3/s3manager"
	"github.com/aws/aws-sdk-go/service/ssm"
	"github.com/ethereum/go-ethereum/crypto"
)

// UploadToBucket to put a file in a bucket
func UploadToBucket(session *session.Session, fileContent io.ReadSeeker, fileName, bucketName string) (*s3manager.UploadOutput, error) {
	uploader := s3manager.NewUploader(session)

	output, err := uploader.Upload(&s3manager.UploadInput{
		Bucket: &bucketName,
		Key:    &fileName,
		Body:   fileContent,
	})

	if err != nil {
		return nil, fmt.Errorf(
			"Unable to upload %v to %v, %v",
			fileName,
			bucketName,
			err,
		)
	}

	log.Debug(func(k *log.Log) {
		k.Format(
			"Successfully uploaded %v to %v",
			fileName,
			bucketName,
		)
	})

	return output, nil
}

// WaitUntilBucketExists to return nil if a bucket exists, or hang for the timeout
// interval then error
func WaitUntilBucketExists(session *session.Session, bucketName string) error {
	svc := s3.New(session)
	err := svc.WaitUntilBucketExists(&s3.HeadBucketInput{
		Bucket: &bucketName,
	})

	return err
}

// CreateBucket to create a new bucket
func CreateBucket(session *session.Session, bucketName, acl string) (*s3.CreateBucketOutput, error) {

	log.Debug(func(k *log.Log) {
		k.Format(
			"Creating bucket %v with ACL %v",
			bucketName,
			acl,
		)
	})

	svc := s3.New(session)
	// Create the S3 Bucket
	output, err := svc.CreateBucket(&s3.CreateBucketInput{
		Bucket: &bucketName,
		ACL:    &acl,
	})

	if err != nil {
		return nil, fmt.Errorf(
			"Unable to create bucket with name %v, %v",
			bucketName,
			err,
		)
	}

	// Wait until bucket is created before finishing
	err = svc.WaitUntilBucketExists(&s3.HeadBucketInput{
		Bucket: &bucketName,
	})

	if err != nil {
		return nil, fmt.Errorf(
			"Error occurred while waiting for bucket %v to be created: %v",
			bucketName,
			err,
		)
	}

	return output, nil
}

// createBucketIfNotExists to either create a bucket, or return nil, nil if the bucket already exists
func CreateBucketIfNotExists(session *session.Session, bucketName, acl string) (*s3.CreateBucketOutput, error) {
	output, err := CreateBucket(session, bucketName, acl)

	if err != nil {
		if aerr, ok := err.(awserr.Error); ok {
			switch aerr.Code() {
			case s3.ErrCodeBucketAlreadyExists:
				fallthrough
			case s3.ErrCodeBucketAlreadyOwnedByYou:
				log.App(func(k *log.Log) {
					k.Format(
						"Bucket %v already exists - using it!",
						bucketName,
					)
				})
			default:
				log.Fatal(func(k *log.Log) {
					k.Message = "Failed to create a bucket!"
					k.Payload = aerr.Error()
				})
			}

		} else {
			log.Fatal(func(k *log.Log) {
				k.Message = "Failed to create a bucket!"
				k.Payload = err
			})
		}
	}

	return output, nil
}

// GetParameter to fetch a value from AWS parameter store
func GetParameter(session *session.Session, name string, withDecryption bool) (string, error) {

	ssmClient := ssm.New(session)

	input := &ssm.GetParameterInput{
		Name:           &name,
		WithDecryption: &withDecryption,
	}

	output, err := ssmClient.GetParameter(input)

	if err != nil {
		return "", fmt.Errorf(
			"Failed to get parameter %v from AWS! %v",
			name,
			err,
		)
	}

	value := output.Parameter.Value

	if value == nil {
		return "", fmt.Errorf("Parameter value was nil!")
	}

	return *value, nil
}

// GetPrivateKeyFromParameter to fetch and decode a private key from AWS parameter store
func GetPrivateKeyFromParameter(session *session.Session, name string) (*ecdsa.PrivateKey, error) {
	privateKeyHex, err := GetParameter(session, name, true)

	if err != nil {
		return nil, fmt.Errorf(
			"Failed to fetch private key! %v",
			err,
		)
	}

	privateKey, err := crypto.HexToECDSA(privateKeyHex)

	if err != nil {
		return nil, fmt.Errorf(
			"Failed to decode into a private key! %v",
			err,
		)
	}

	return privateKey, err
}

// service is the simplified definition used for restarting tasks
type service struct {
	Cluster,
	ServiceName *string
}

// arnStringToService to extract cluster and service name from an ARN string
func arnStringToService(arnString string) (*service, error) {
	parsed, err := arn.Parse(arnString)

	if err != nil {
		return nil, err
	}

	split := strings.Split(parsed.Resource, "/")

	if len(split) < 3 {
		return nil, fmt.Errorf(
			"ARN resource string %v was too short - expected at least 3 splits on '/', got %v!",
			parsed.Resource,
			len(split),
		)
	}

	var (
		cluster     = split[1]
		serviceName = split[2]
	)

	s := &service{
		Cluster:     &cluster,
		ServiceName: &serviceName,
	}

	return s, nil
}

// RestartTasksMatchingServiceName to restart tasks created by services containing `matchName` in their names using `StopTask`
func RestartTasksMatchingServiceName(session *session.Session, cluster, matchName string) error {
	ecsClient := ecs.New(session)

	var (
		serviceArns []*string
		maxResults  = int64(100)
	)

	// list all services in the cluster
	services, err := ecsClient.ListServices(&ecs.ListServicesInput{
		Cluster:    &cluster,
		MaxResults: &maxResults,
	})

	if err != nil {
		return fmt.Errorf(
			"Failed to list services! %v",
			err,
		)
	}

	serviceArns = append(serviceArns, services.ServiceArns...)

	// if NextToken isn't nil, there are still services to look through
	for services.NextToken != nil {
		services, err = ecsClient.ListServices(&ecs.ListServicesInput{
			Cluster:   &cluster,
			NextToken: services.NextToken,
		})

		if err != nil {
			return fmt.Errorf(
				"Failed to list services! %v",
				err,
			)
		}

		serviceArns = append(serviceArns, services.ServiceArns...)
	}

	// get the cluster and service name for each matching service
	var matchingServices []*service
	for _, arn_ := range serviceArns {
		arn, err := arnStringToService(*arn_)

		if err != nil {
			return fmt.Errorf(
				"Failed to convert ARN string! %v",
				err,
			)
		}

		if strings.Contains(*arn.ServiceName, matchName) {
			matchingServices = append(matchingServices, arn)
		}
	}

	// fetch the tasks and restart them
	for _, arn := range matchingServices {
		var (
			cluster     = arn.Cluster
			serviceName = arn.ServiceName
		)

		tasks, err := ecsClient.ListTasks(&ecs.ListTasksInput{
			Cluster:     cluster,
			ServiceName: serviceName,
		})

		if err != nil {
			return fmt.Errorf(
				"Failed to list tasks! %v",
				err,
			)
		}

		for _, taskArn := range tasks.TaskArns {
			var (
				task           = taskArn
				stopTaskReason = "Key Rotation"
			)

			_, err := ecsClient.StopTask(&ecs.StopTaskInput{
				Task:    task,
				Cluster: cluster,
				Reason:  &stopTaskReason,
			})

			if err != nil {
				return fmt.Errorf(
					"Failed to stop task! %v",
					err,
				)
			}
		}
	}

	return nil
}
