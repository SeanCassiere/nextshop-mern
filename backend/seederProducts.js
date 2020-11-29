import mongoose from 'mongoose'
import dotenv from 'dotenv'
import colors from 'colors'

import products from './data/products.js'

import User from './models/userModel.js'
import Product from './models/productModel.js'
import Order from './models/orderModel.js'

import connectDB from './config/db.js'

dotenv.config()

connectDB()

const importData = async () => {
  try {
    await Order.deleteMany()
    await Product.deleteMany()

    const adminUserFromDB = await User.findOne({ email: 'admin@example.com' })
    const adminUserId = adminUserFromDB._id

    const sampleProducts = products.map((p) => {
      return { ...p, user: adminUserId }
    })

    await Product.insertMany(sampleProducts)

    console.log('Product Data Imported'.green.inverse)
    process.exit()
  } catch (error) {
    console.error(`${error}`.red.inverse)
    process.exit(1)
  }
}

const destroyData = async () => {
  try {
    await Order.deleteMany()
    await Product.deleteMany()

    console.log('Product Data Destroyed'.green.inverse)
    process.exit()
  } catch (error) {
    console.error(`${error}`.red.inverse)
    process.exit(1)
  }
}

if (process.argv[2] === '-d') {
  destroyData()
} else {
  importData()
}
