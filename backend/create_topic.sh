#!/bin/bash

/opt/bitnami/kafka/bin/kafka-topics.sh --create --topic $TOPIC_NAME_1 --bootstrap-server broker:29092
echo "topic $TOPIC_NAME_1 was created"

/opt/bitnami/kafka/bin/kafka-topics.sh --create --topic $TOPIC_NAME_2 --bootstrap-server broker:29092
echo "topic $OPIC_NAME_2 was created"