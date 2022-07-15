const config = require('../../common/config/env.config.js');
const { Kafka } = require('kafkajs')

const logger = require('../services/logger.service');

const { kafka_username: username, kafka_password: password } = config
const sasl = username && password ? { username, password, mechanism: 'plain' } : null
const ssl = !!sasl

/**
 * @function create new Kafka instance
 */
const kafka = new Kafka({
    clientId: 'main node',
    brokers: [config.kafka_bootstrap_server],
    ssl,
    sasl
})

/**
 * @function create a new producer and connect to the Kafka broker
 */
const producer = kafka.producer();
async function connectKafka() {
    try {
        await producer.connect();
    } catch (e) {
        logger.error('Kafka connection error ' + e);
    }
}
connectKafka();


/**
 * @function (01) try to send a message to kafka broker
 *           (02) catch and log errors when sending messages failed
 */
exports.msg = async (topic, val, key) => {
    //01
    try {
        const responses = await producer.send({
            topic: topic,
            messages: [{
                headers: {
                    //'correlation_id': '2bfb68bb-893a-423b-a7fa-7b568cad5b67', - for request response (important when someone exports the entire address book)
                    'system_id': 'my-system'
                },
                key: key,
                value: val
            }]
        })
        logger.info('Published message', { responses })
    } catch (e) {
        //02
        logger.error('Error', { e })
    }
}
