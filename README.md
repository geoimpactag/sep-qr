# Generate QR Codes for the SEP platform

## Instalaation
``npm i``

### Starting in standalone mode
The project expects an ``input/input.csv`` file like :
````text
URL,FILENAME
https://energieportal.energyapps.ch/ep/bernex?lng=de-CH
https://energieportal.energyapps.ch/ep/bernex?lng=fr-CH
https://energieportal.energyapps.ch/ep/bernex?lng=it-CH

https://energieportal.energyapps.ch/ep/oberhofen?lng=de-CH
https://energieportal.energyapps.ch/ep/oberhofen?lng=fr-CH
https://energieportal.energyapps.ch/ep/oberhofen?lng=it-CH
````
The output will be generate in the ``output`` folder
1. ``npm run start``

### API usage

1. ``npm run start-server``

Then make a POST request like:

````curl
curl --location --request POST 'http://localhost:3001' \
--header 'Content-Type: application/json' \
--data-raw '{
    "rows": [
        {
            "URL": "https://energieportal.energyapps.ch/ep/belp?lng=de-CH"
        }
    ]
}'
````
The output will be available at the ``output`` folder and will be sent back as a HTTP-Response