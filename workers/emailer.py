import pika, os, json
from dotenv import load_dotenv
from email.mime.multipart import MIMEMultipart
from email.mime.text import MIMEText
from email.utils import formatdate
import smtplib

load_dotenv()

class EmailConsumer:
    def __init__(self):
        self.connection = pika.BlockingConnection(
            pika.ConnectionParameters(os.getenv('RABBITMQ_HOST'), os.getenv('RABBITMQ_PORT'), '/', pika.PlainCredentials(os.getenv('RABBITMQ_USER'), os.getenv('RABBITMQ_PASSWORD')))
        )
        self.channel = self.connection.channel()
        self.channel.basic_qos(prefetch_count=5)
        self.channel.queue_declare(queue='email_queue', durable=True)

    def parse(self, ch, method, properties, body):
        try:
            email = json.loads(body)

            msg = MIMEMultipart()
            msg['From'] = email['sender']
            msg['Date'] = formatdate(localtime=True)
            msg['Subject'] = email['subject']

            msg.attach(MIMEText(email['body'], 'plain'))

            server = smtplib.SMTP(os.getenv('SMTP_HOST'), os.getenv('SMTP_PORT'))
            server.ehlo()
            server.starttls()
            server.login(os.getenv('SMTP_USER'), os.getenv('SMTP_PASSWORD'))

            server.sendmail(email['sender'], email['recipient'], msg.as_string())
            server.close()
            ch.basic_ack(delivery_tag = method.delivery_tag)
        except Exception as e:
            print(e)

    def run(self):
        print("Email worker started")
        self.channel.basic_consume(queue='email_queue', on_message_callback=self.parse)

        self.channel.basic_qos(prefetch_count=1)
        self.channel.start_consuming()
        self.connection.close()


d = EmailConsumer()
d.run()

