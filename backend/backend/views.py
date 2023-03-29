from django.http import HttpResponse
from api.file_spreadsheet import *
from chunked_upload.views import ChunkedUploadView, ChunkedUploadCompleteView
from chunked_upload.models import ChunkedUpload
from django.utils import timezone
from datetime import datetime, timedelta
from dateutil import parser
import json

def handle_file(request):
    project = Projects.objects.get(id=2)

    spreadsheet = File(project)
    worksheet = spreadsheet.worksheets()[0]
    worksheet.update_values(id=1)
   
    # spreadsheet.import_sheets('agents.xlsx')
    return HttpResponse("")

class file_upload(ChunkedUploadView):

    model = ChunkedUpload
    field_name = 'file'

    def check_permissions(self, request):
        # Allow non authenticated users to make uploads
        pass


class MyChunkedUploadCompleteView(ChunkedUploadCompleteView):

    model = ChunkedUpload

    def check_permissions(self, request):
        # Allow non authenticated users to make uploads
        pass

    def on_completion(self, uploaded_file, request):
        # Do something with the uploaded file. E.g.:
        # * Store the uploaded file on another model:
        # SomeModel.objects.create(user=request.user, file=uploaded_file)
        # * Pass it as an argument to a function:
        # function_that_process_file(uploaded_file)
        pass

    def get_response_data(self, chunked_upload, request):
        return {'message': ("You successfully uploaded '%s' (%s bytes)!" %
                            (chunked_upload.filename, chunked_upload.offset))}


def webhook_handler(request):
    data = json.loads(request.body)
    meta = data['meta']
    data = data['data']
    user = User.objects.get(user_id=meta['custom_data']['user_id'])

    if data["type"] == "subscriptions":
        name = data["attributes"]["product_name"]
        name = name.lower().replace("sheet2graphql", "").strip()
        subscription = user.subscriptions

        if meta["event_name"] in ["subscription_created", "subscription_payment_success"]:
            renews = parser.parse(data["attributes"]["renews_at"])

            if name == "starter":
                subscription.name = name
                subscription.quota = 70000
                subscription.total_requests = 0
                subscription.updated = timezone.now()
                subscription.renews = renews

            if name == "pro":
                subscription.name = name
                subscription.quota = 100000
                subscription.total_requests = 0
                subscription.updated = timezone.now()
                subscription.renews = renews

            subscription.save()

        if meta["event_name"] == "subscription_expired":
            date_now = timezone.now()
            renews = date_now + timedelta(days=30)

            subscription.name = "free"
            subscription.quota = 600
            subscription.total_requests = 0
            subscription.updated = timezone.now()
            subscription.renews = renews

            subscription.save()

        if meta["event_name"] == "subscription_updated":
            if data["attributes"]["update_payment_method"]:
                subscription.update_card_url = data["attributes"]["update_payment_method"]

            if data["attributes"]["card_last_four"]:
                subscription.update_card_url = data["attributes"]["card_last_four"]

            subscription.save()
   
    # spreadsheet.import_sheets('agents.xlsx')
    return HttpResponse("")