from asyncio import mixins
from rest_framework.viewsets import GenericViewSet
from rest_framework.mixins import ListModelMixin, CreateModelMixin
from .models import Pregunta,Inscrito
from .serializers import PreguntaSerializer,InscritoSerializer
from rest_framework import mixins
from rest_framework.response import Response
from rest_framework.decorators import api_view
from rest_framework import status


class PreguntaViewSet(ListModelMixin, 
                      CreateModelMixin, 
                      mixins.RetrieveModelMixin,   # 👈 permite GET /<id>/
                      mixins.UpdateModelMixin,     # 👈 permite PUT y PATCH
                      mixins.DestroyModelMixin,    # 👈 permite DELETE
                      GenericViewSet):
    serializer_class = PreguntaSerializer

    def get_queryset(self):
        return list(Pregunta.objects.all())  # 👈 ¡Esto soluciona el problema!
    
    
@api_view(['POST'])
def registrar_inscrito(request):
    if request.method == 'POST':
        serializer = InscritoSerializer(data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)