from django.core.paginator import EmptyPage, Paginator
from django.conf import settings
import pika, json


def get_paginator(querySet, queryType, page=1, limit=10):
    paginator = Paginator(querySet, limit)
    try:
        page_object = paginator.page(page)
        result = page_object.object_list

    except EmptyPage:
        page_object = paginator.page(paginator.num_pages)
        result = []

    return queryType(
        page=page_object.number,
        pages=paginator.num_pages,
        count=paginator.count,
        has_next=page_object.has_next(),
        has_prev=page_object.has_previous(),
        result=result
    )

class APIException(Exception):

    def __init__(self, message, status=None):
        self.context = {}
        super().__init__(message)

def send_email(body, subject, recipient, sender):
    connection = pika.BlockingConnection(
        pika.ConnectionParameters(settings.RABBITMQ_HOST, settings.RABBITMQ_PORT, '/', pika.PlainCredentials(settings.RABBITMQ_USER, settings.RABBITMQ_PASSWORD))
    )
    channel = connection.channel()
    channel.queue_declare(queue='email_queue', durable=True)

    message = {
        "recipient": recipient,
        'subject': subject,
        'sender': sender,
        "body": body
    }

    channel.basic_publish(
        exchange='',
        routing_key='email_queue',
        body=json.dumps(message),
        properties=pika.BasicProperties(
            delivery_mode=2,  # make message persistent
        )
    )

    return True

