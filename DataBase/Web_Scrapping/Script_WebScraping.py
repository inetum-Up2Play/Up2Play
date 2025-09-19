from apify_client import ApifyClient
import json
import os
from dotenv import load_dotenv

load_dotenv(dotenv_path="C:/Users/daniel.villalba.ext/.env")
# Cargar el token desde una variable de entorno
APIFY_TOKEN = os.getenv("APIFY_TOKEN")

# Verificar que el token existe
if not APIFY_TOKEN:
    raise ValueError("La variable de entorno 'APIFY_TOKEN' no está definida.")

client = ApifyClient()

ciudades = ["Madrid", "Barcelona", "Valencia", "Sevilla", "Bilbao"]
search_keyword = "deportes"
todos_los_eventos = []

for ciudad in ciudades:
    run_input = {
        "searchKeyword": search_keyword,
        "city": ciudad,
        "country": "es",
        "maxResults": 10
    }

    run = client.actor("filip_cicvarek/meetup-scraper").call(run_input=run_input)

    for item in client.dataset(run["defaultDatasetId"]).iterate_items():
        evento_filtrado = {
            "id": item.get("eventId"),
            "nombre": item.get("eventName"),
            "descripcion": item.get("eventDescription"),
            "fecha": item.get("date"),
            "hora": item.get(""),  # Este campo está vacío
            "ubicacion": item.get("address"),
            "nivel": item.get(""),  # Este campo está vacío
            "num_pers_inscritas": item.get("actualAttendees"),
            "num_pers_totales": item.get("maxAttendees"),
            "estado": item.get(""),  # Este campo está vacío
            "precio": item.get(""),  # Este campo está vacío
            "id_usuario_creador": item.get("")  # Este campo está vacío
        }
        todos_los_eventos.append(evento_filtrado)

with open("Up2Play/DataBase/Web_Scrapping/eventos_meetup_varias_ciudades.json", "w", encoding="utf-8") as f:
    json.dump(todos_los_eventos, f, ensure_ascii=False, indent=4)

print("Eventos combinados guardados en 'Up2Play/DataBase/Web_Scrapping/eventos_meetup_varias_ciudades.json'.")
