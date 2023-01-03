const {Device, DeviceInfo} = require("../models/models");
const uuid = require("uuid");
const path = require("path");
const { Op } = require("sequelize");
const ApiError = require("../error/ApiError");
class DeviceController {
    async create(req, res,next) {
        try {
            let {name,description, price, typeId,info} = req.body
            const {img} = req.files
            const fileName = uuid.v4() + ".jpg"
            img.mv(path.resolve(__dirname, '..', 'static', fileName))
            const device = await Device.create({name,description, price, typeId, img: fileName})

            if(info){
                info = JSON.parse(info)
                info.forEach(i =>
                    DeviceInfo.create({
                        title: i.title,
                        description: i.description,
                        deviceId: device.id
                    })
                )
            }

            return res.json(device)
        }
        catch (e) {
            console.log(e);
            next(ApiError.badRequest(e.message))
        }
    }

    async getAll(req, res) {
        // let {brandId, typeId, limit, page} = req.query
        // page = page || 1
        // limit = limit || 9
        // let offset = page * limit - limit
        // let devices;
        // if (!brandId && !typeId) {
        //     devices = await Device.find
        // }
        let {brandId,query,limit,page} = req.query
        console.log('query',query);

        let typeId;
        if(query && query.type) typeId = parseInt(query.type)


        let resQuery = {};
        if(query && query.type) resQuery = {...resQuery,typeId: typeId}
        if(query && query.min) resQuery = {...resQuery,price: {[Op.gte]: parseInt(query.min)}}
        if(query && query.max) resQuery = {...resQuery,price: {[Op.lte]: parseInt(query.max)}}
        if(query && query.min && query.max){
            resQuery = {...resQuery,price: {[Op.gte]: parseInt(query.min),[Op.lte]: parseInt(query.max)}}
        }
        if(query && query.name){
            resQuery = {...resQuery,name: {[Op.iLike]: `%${query.name}%`}}
        }

        // let {typeId,brandId} = query;
        page = page || 1
        limit = limit || 2
        let offset = page * limit - limit
        let devices =await Device.findAndCountAll({where: {...resQuery},limit,offset})

        return res.json(devices)

    }

    async getOne(req, res) {
        const {id} = req.params
        const device = await Device.findOne(
            {
                where: {id},
                include: [{model: DeviceInfo, as: 'info'}]
            });
        return res.json(device)
    }
}

module.exports = new DeviceController();