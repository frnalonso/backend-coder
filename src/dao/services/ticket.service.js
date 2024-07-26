import ticketRepository from "../repositories/ticket.repository.js"

class TicketService {

    constructor() {
        console.log("Servicio de Tickets")
    };
    //Crea un nuevo carrito.
    async createOne() {
            const newTicket = await ticketRepository.createOne()
            return newTicket;
    };

    //Busca un único carrito según su id.
    async findById (tid) {
            const ticketId = await ticketRepository.findById(tid)
            return ticketId;
    };

    //Busca todos los tickets.
    async findAll () {
            const tickets = await ticketRepository.findAll()
            return tickets;

    };

    async updateOne (tid,body) {
        const response = await ticketRepository.updateOne(+tid, body);
        return response;
    };

    async deleteOne (tid) {

            await ticketRepository.deleteOne(tid)
            res.status(200).json({ message: 'Ticket eliminado correctamente...' })

    };

}

export default new TicketService;