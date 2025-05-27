from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import PreguntaViewSet
from . import views

router = DefaultRouter()
router.register(r'preguntas', PreguntaViewSet, basename='pregunta')

urlpatterns = [
    path('', include(router.urls)),
    path('inscritos/registrar/', views.registrar_inscrito, name='registrar_inscrito'),
]