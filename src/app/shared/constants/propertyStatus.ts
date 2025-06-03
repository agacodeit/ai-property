export enum PropertyStatusEnum {
    PUBLISHED = 'PUBLISHED',
    PAUSED = 'PAUSED',
    CREATED = 'CREATED'
}

export const PropertyStatus = {
    'PUBLISHED': {
        description: 'Publicado',
        icon: 'fa-play'
    },
    'CREATED': {
        description: 'Rascunho',
        icon: 'fa-upload'
    },
    'PAUSED': {
        description: 'Pausado',
        icon: 'fa-pause'
    }
}