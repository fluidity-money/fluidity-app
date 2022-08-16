#!/bin/sh -e

. ../../tests-profile.sh

microservice-solana-user-restrictions &

FLU_AMQP_TOPIC_PUBLISH=user_actions.buffered.solana sleep_do 2s microservice-common-amqp-producer <<EOF
{
	something
}
EOF

fg
