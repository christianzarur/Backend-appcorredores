export class Mensaje {
    constructor(
        public _id: string,
        public contenido: string,
        public visto: string,
        public fecha: string,
        public emisor: string,
        public receptor: string
    ) { }


}