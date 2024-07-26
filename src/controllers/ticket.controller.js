import ticketService from "../dao/services/ticket.service.js"


class TicketController {

    constructor() {
        console.log("Controlador de Tickets")
    }
    //Crea un nuevo carrito.
    async createTicket(req, res) {

        try {
            const newCart = await ticketService.createOne()
            res.status(200).json({ message: 'Ticket creado: ', cart: newCart })
        } catch (error) {
            res.status(400).json({ message: error })
        }
    }


    //Busca un único carrito según su id.
    async getCartTicketId (req, res) {
        try {
            const { tid } = req.params
            const ticketId = await ticketService.findById(tid)
            res.status(200).json({ message: 'Ticket encontrado: ', ticket: ticketId })
        } catch (error) {
            res.status(400).json({ message: error })
        }
    }

    //Busca todos los tickets.
    async getTicketAll (req, res) {
        try {
            const tickets = await ticketService.findAll()
            res.status(200).json({ message: "Tickets encontrados: ", ticket: tickets })
        } catch (error) {
            console.log(error)
            res.status(400).json({ message: error })
        }
    }


    async updateTicket (req, res) {
        const { tid } = req.params
        try {
            const response = await ticketService.updateOne(+tid, req.body);
            res.status(response ? 200 : 400).json({ message: response ? 'Ticket modificado satisfactoriamente...' : 'Ticket no encontrado con el id ingresado' });
        } catch (error) {
            res.status(500).json({ message: error.message })
        }
    }

    async deleteTicket (req, res) {
        const { tid } = req.params
        try {
            await ticketService.deleteOne(tid)
            res.status(200).json({ message: 'Ticket eliminado correctamente...' })
        } catch (error) {
            res.status(500).json({ message: error.message })
        }
    }

};

export default new CartController;