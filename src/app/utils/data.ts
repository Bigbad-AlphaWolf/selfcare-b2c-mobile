import { RequestOem } from '../models/request-oem.model';

export const DATA_REQUESTS : RequestOem [] = [
    {
        "status": "INPROGRESS",
        "title": "En Cours",
        "description": "Votre demande est en cours de traitement, vous serez contacter par nos équipes.",
        "type": "REQUEST",
        "order": 1,
        "historic": true,
        "requestId": '9009903453'
    },
    {
        "status": "INPROGRESS",
        "title": "En Cours",
        "description": "Votre demande est en cours de traitement, vous serez contacter par nos équipes. Votre demande est en cours de traitement, vous serez contacter par nos équipes. ",
        "type": "REQUEST",
        "order": 1,
        "historic": true,
        "requestId": '9009903453'
    },
    {
        "status": "CLOSED",
        "title": "Cloture",
        "description": "Vous serez contacter par nos équipes.",
        "type": "REQUEST",
        "order": 1,
        "historic": true,
        "requestId": '9009903453'
    }
]