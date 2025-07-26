const express = require('express');
const router = express.Router();
const User = require('../models/User');
const auth = require('../middlewares/auth');
const role = require('../middlewares/role');
