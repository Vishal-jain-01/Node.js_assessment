import {User} from '../models/User.js'
import jwt from 'jsonwebtoken';

const authenticate = async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;
    
    if (!authHeader) {
      return res.status(401).json({
        status_code: 401,
        message: 'Authorization header missing'
      });
    }

    const token = authHeader.startsWith('Bearer ') 
      ? authHeader.substring(7) 
      : authHeader;

    let decoded;
    try {
      decoded = jwt.verify(token, process.env.JWT_SECRET);
    } catch (err) {
      return res.status(401).json({
        status_code: 401,
        message: 'Invalid or expired token'
      });
    }

    const user = await User.findOne({ 
      $or: [
        { token: token },
        { email: decoded.email }
      ]
    });

    if (!user) {
      return res.status(401).json({
        status_code: 401,
        message: 'User not found'
      });
    }

    req.user = user;
    req.decoded = decoded;
    next();
  } catch (error) {
    return res.status(500).json({
      status_code: 500,
      message: 'Authentication error',
      error: error.message
    });
  }
};

export default authenticate;
