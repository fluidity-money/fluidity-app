#!/bin/sh -e

. ../../tests-profile.sh

microservice-solana-user-restrictions &

sleep 10

export FLU_AMQP_TOPIC_PUBLISH=user_actions.buffered.solana

microservice-common-amqp-producer <<EOF
{
	something
}
EOF

microservice-common-amqp-producer <<EOF

EOF
