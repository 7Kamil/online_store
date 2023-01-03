const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const {User, Basket} = require('../models/models');

const generateJwt = (id, email, role) => {
    return jwt.sign(
        {id, email
        , role},
        process.env.SECRET_KEY,
        {expiresIn: '24h'}
    );

}
class UserController {
  async index(req, res) {
    const users = await User.find();
    res.json(users);
  }

  async registration(req, res) {
    const {email, password, role} = req.body;
    if (!email || !password) {
        return res.status(400).json({message: "Некорректный email или пароль"});
    }
    const candidate = await User.findOne({where: {email}});
    if (candidate) {
        return res.status(400).json({message: "Пользователь с таким email уже существует"});
    }
    const hashPassword = bcrypt.hashSync(password, 5);
    const user = await User.create({email, role, password: hashPassword});
    const basket = await Basket.create({userId: user.id});
    const token = generateJwt(user.id, user.email, user.role);
    return res.json({token});
  }

  async login(req, res,next) {
    const {email, password} = req.body;
    if (!email || !password) {
        return res.status(400).json({message: "Некорректный email или пароль"});
    }
    const user = await User.findOne({where: {email}});
    if (!user) {
        return res.status(400).json({message: "Пользователь с таким email не найден"});
    }
    let comparePassword = bcrypt.compareSync(password, user.password);
    if (!comparePassword) {
        return res.status(400).json({message: "Неверный пароль"});
    }
    const token = generateJwt(user.id, user.email, user.role);
    return res.json({token});
  }

  async check(req, res) {
    const token = generateJwt(req.user.id, req.user.email, req.user.role);
    return res.json({token});
  }
}

module.exports = new UserController();