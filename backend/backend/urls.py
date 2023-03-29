from django.views.decorators.csrf import csrf_exempt
from graphene_django.views import GraphQLView as BaseGraphQLView, HttpError
from django.urls import path, include
from api.schema import api_schema
from django.contrib.staticfiles.urls import staticfiles_urlpatterns
from django.contrib.sitemaps.views import sitemap
from django.http import HttpResponseNotFound
from api.models import *
from .views import *
from api.googlesheets_schema import googlesheets_schema
from api.file_schema import file_schema
from django.conf import settings
from django.views.generic.base import RedirectView
from django.conf.urls.static import static


debug = False
class customSchema(BaseGraphQLView):

    def dispatch(self, info, *args, **kwargs):
        if kwargs['uuid'] == 'favicon.ico':
            return HttpResponseNotFound("")

        project = Projects.objects.get(project_id=kwargs['uuid'])
        self.graphiql = project.introspection

        # check authorization header if enabled
        if project.authentication:
            if "Authorization" not in info.headers:
                e =  HttpError(HttpResponse(status=401, content_type='application/json'), 'Authorization credentials not provided.')
                response = e.response
                response.content = self.json_encode(info, [{'errors': [self.format_error(e)]}])
                return response
            else:
                bearer = info.headers["Authorization"]
                bearer = bearer.replace('Bearer', '').strip()

                if bearer != project.bearer:
                    e =  HttpError(HttpResponse(status=401, content_type='application/json'), 'Authorization credentials invalid.')
                    response = e.response
                    response.content = self.json_encode(info, [{'errors': [self.format_error(e)]}])
                    return response
        
        # check project quota an usage
        user = project.user
        subscription = user.subscriptions

        # check if graphiql page request
        if len(info.body) != 0:
    
            if subscription.total_requests >= subscription.quota:
                e =  HttpError(HttpResponse(status=402, content_type='application/json'), 'Monthly quota exceeded')
                response = e.response
                response.content = self.json_encode(info, [{'errors': [self.format_error(e)]}])
                return response
            else:
                subscription.total_requests = subscription.total_requests + 1
                subscription.save()

        if project.source == 'googleSheet':
            self.schema = googlesheets_schema(project)
        else:
            self.schema = file_schema(project)

        return super().dispatch(info, *args, **kwargs)

urlpatterns = [
    path("", csrf_exempt(BaseGraphQLView.as_view(graphiql=settings.DEBUG, schema=api_schema))),
    path("project/<str:uuid>", csrf_exempt(customSchema.as_view(schema=api_schema))),
    path("file", handle_file),
    path('upload', csrf_exempt(file_upload.as_view())),
    path('static/graphene_django/graphiql.js', RedirectView.as_view(url='https://sheet2graphql.co/graphiql.js', permanent=True)),
    path('project/static/graphene_django/graphiql.js', RedirectView.as_view(url='https://sheet2graphql.co/graphiql.js', permanent=True)),
    path('webhook/subscriptions', csrf_exempt(webhook_handler)),
]

urlpatterns += staticfiles_urlpatterns()