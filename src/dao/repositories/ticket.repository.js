import Ticket from '../models/ticket.model.js'
import TicketDTO from '../DTOs/ticket.dto.js'
class TicketRepository {

    getAll = async () => {
        const result = await Ticket.find();
        return result;
      };
    
      getById = async (id) => {
        const result = await Ticket.findById(id);
        return result;
      };
    
      createOne = async (ticket) => {
        const dtoTicket =  new TicketDTO(ticket)
        const result = await Ticket.create(dtoTicket);
        return result;
      };
    
      updateOne = async (id, ticketData) => {
        const result = await Ticket.updateOne(
          { _id: id },
          { $set: ticketData }
        );
        return result;
      };
    
      deleteOne = async (id) => {
        const result = await Ticket.deleteOne({ _id: id });
        return result;
      };


}

export default new TicketRepository;