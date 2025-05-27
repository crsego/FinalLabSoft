from django.db import models
from mongoengine import Document, StringField, DictField

class Pregunta(Document):
    pregunta = StringField(required=True)
    respuestas = DictField()  # Para respuestas como respuesta1, respuesta2, etc.

    meta = {
        'collection': 'Question'  # 👈 Aquí le indicas a MongoEngine el nombre real
    }
    
class Inscrito(models.Model):
    nombre = models.CharField(max_length=100)
    email = models.EmailField(unique=True)
    carrera_seleccionada = models.CharField(max_length=100)
    
    def __str__(self):
        return self.nombre
