#!/bin/sh -e

. ../../tests-profile.sh

microservice-solana-user-restrictions &

sleep 10

export FLU_AMQP_TOPIC_PUBLISH=user_actions.buffered.solana

microservice-common-amqp-producer <<EOF

EOF

microservice-common-amqp-producer <<EOF

EOF

sleep 10

psql -e "$FLU_POSTGRES_URI" <<EOF

SELECT *
FROM solana_users
WHERE address = ''
AND amount_minted = 0
