package aws

import (
	"crypto/ecdsa"
	"fmt"
	"io"

	"github.com/aws/aws-sdk-go/aws"
	"github.com/aws/aws-sdk-go/aws/awserr"
	"github.com/aws/aws-sdk-go/aws/session"
	"github.com/aws/aws-sdk-go/service/s3"
	"github.com/aws/aws-sdk-go/service/s3/s3manager"
	"github.com/aws/aws-sdk-go/service/ssm"
	"github.com/ethereum/go-ethereum/crypto"
	"github.com/fluidity-money/fluidity-app/lib/log"
)

// UploadToBucket to put a file in a bucket
func UploadToBucket(session *session.Session, fileContent io.ReadSeeker, fileName, bucketName string) (*s3manager.UploadOutput, error) {
	uploader := s3manager.NewUploader(session)

	output, err := uploader.Upload(&s3manager.UploadInput{
		Bucket: &bucketName,
		Key:    &fileName,
		Body:   fileContent,
		ACL:    aws.String(s3.BucketCannedACLAuthenticatedRead),
	})

	if err != nil {
		return nil, fmt.Errorf(
			"Unable to upload %v to %v, %v",
			fileName,
			bucketName,
			err,
		)
	}

	fmt.Printf("Successfully uploaded %v to %v\n", fileName, bucketName)

	return output, nil
}

// CreateBucket to create a new bucket
func CreateBucket(session *session.Session, bucketName, acl string) (*s3.CreateBucketOutput, error) {

	fmt.Printf("creating bucket %v with acl %v\n", bucketName, acl)

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
	fmt.Printf("Waiting for bucket %v to be created...\n", bucketName)

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
