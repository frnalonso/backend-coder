import messageModel from '../models/message.model.js'

export default class MessageManagerDB {

    async findAll() {
        const response = await messageModel.find();
        return response;
    }

    async findById(id) {
        const response = await messageModel.findById(id);
        return response;
    }
    async createOne(obj) {
        const response = await messageModel.create(obj);
        return response;
    }

    async updateOne(id,obj) {
        const response = await messageModel.findByIdAndUpdate({_id: id},{$set: obj});
        return response;
    }

    async deleteOne(id) {
        console.log(id)
        const response = await messageModel.findByIdAndDelete({_id: id});
        return response;
    }
   
}