# Express Backend

## Datei-Upload

Der Endpoint `POST /uploads` erwartet eine Datei im Multipart-Feld `file`.
Der Endpoint ist geschützt und benötigt deshalb den gleichen Bearer-Token wie
die anderen geschützten Routen.

Erlaubt sind JPEG-, PNG-, WebP-Bilder und PDF-Dateien. Eine Datei darf maximal
5 MB groß sein. Die Datei wird mit einer zufälligen ID im Ordner `uploads/`
gespeichert. Der ursprüngliche Dateiname wird nicht zum Speichern verwendet.

Beispiel:

```bash
curl -X POST http://localhost:3000/uploads \
  -H "Authorization: Bearer DEIN_TOKEN" \
  -F "file=@./bild.png"
```

Bei Erfolg liefert die API den gespeicherten Dateinamen, Dateityp, die Größe
und die URL zum Abrufen der Datei zurück.