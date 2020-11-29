import React, { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { Form, Button, Row, Col } from 'react-bootstrap'
import { useDispatch, useSelector } from 'react-redux'

import Message from '../components/Message'
import Loader from '../components/Loader'
import FormContainer from '../components/FormContainer'

import {
  listProductDetails,
  updateProductDetails,
} from '../actions/productActions'
import { USER_UPDATE_RESET } from '../constants/userConstants'

const ProductEditScreen = ({ match, history }) => {
  const productId = match.params.id

  const [name, setName] = useState('')
  const [price, setPrice] = useState(0)
  const [image, setImage] = useState('')
  const [brand, setBrand] = useState('')
  const [category, setCategory] = useState('')
  const [description, setDescription] = useState('')
  const [countInStock, setCountInStock] = useState(0)
  const [isActive, setIsActive] = useState(false)

  const dispatch = useDispatch()

  const productDetails = useSelector((state) => state.productDetails)
  const { loading, error, product } = productDetails

  const userLogin = useSelector((state) => state.userLogin)
  const { userInfo } = userLogin

  useEffect(() => {
    if (userInfo && userInfo.isAdmin) {
      if (!product.name || product._id !== productId) {
        dispatch(listProductDetails(productId))
      } else {
        setName(product.name)
        setPrice(product.price)
        setImage(product.image)
        setBrand(product.brand)
        setCategory(product.category)
        setDescription(product.description)
        setCountInStock(product.countInStock)
        setIsActive(product.isActive)
      }
    } else {
      history.push('/login')
    }
  }, [dispatch, history, userInfo, productId, product])

  const submitHandler = (e) => {
    e.preventDefault()
    //
  }

  return (
    <>
      <Link to={`/admin/productlist`} className='btn btn-light my-3'>
        Go Back
      </Link>
      <FormContainer>
        <h1>Edit Product</h1>

        {/* {loadingUpdate && <Loader />}
        {errorUpdate && <Message variant='danger'>{errorUpdate}</Message>} */}

        {loading ? (
          <Loader />
        ) : error ? (
          <Message variant='danger'>{error}</Message>
        ) : (
          <Form onSubmit={submitHandler}>
            <Form.Group controlId='name'>
              <Form.Label>Name</Form.Label>
              <Form.Control
                type='text'
                value={name}
                onChange={(e) => {
                  setName(e.target.value)
                }}
              ></Form.Control>
            </Form.Group>

            <Form.Group controlId='image'>
              <Form.Label>Image</Form.Label>
              <Form.Control
                type='text'
                value={image}
                onChange={(e) => {
                  setImage(e.target.value)
                }}
              ></Form.Control>
            </Form.Group>

            <Form.Group controlId='brand'>
              <Form.Label>Brand</Form.Label>
              <Form.Control
                type='text'
                value={brand}
                onChange={(e) => {
                  setBrand(e.target.value)
                }}
              ></Form.Control>
            </Form.Group>

            <Form.Group controlId='category'>
              <Form.Label>Category</Form.Label>
              <Form.Control
                type='text'
                value={category}
                onChange={(e) => {
                  setCategory(e.target.value)
                }}
              ></Form.Control>
            </Form.Group>

            <Form.Group controlId='description'>
              <Form.Label>Description</Form.Label>
              <Form.Control
                as='textarea'
                value={description}
                onChange={(e) => {
                  setDescription(e.target.value)
                }}
              ></Form.Control>
            </Form.Group>

            <Row>
              <Col>
                <Form.Group controlId='price'>
                  <Form.Label>Price</Form.Label>
                  <Form.Control
                    type='number'
                    value={price}
                    onChange={(e) => {
                      setPrice(e.target.value)
                    }}
                  ></Form.Control>
                </Form.Group>
              </Col>
              <Col>
                <Form.Group controlId='instock'>
                  <Form.Label>In Stock</Form.Label>
                  <Form.Control
                    type='text'
                    value={countInStock}
                    onChange={(e) => {
                      setCountInStock(e.target.value)
                    }}
                  ></Form.Control>
                </Form.Group>
              </Col>
            </Row>

            <Form.Group controlId='isactive'>
              <Form.Check
                type='checkbox'
                checked={isActive}
                label='Is Active on Store?'
                onChange={(e) => {
                  setIsActive(e.target.checked)
                }}
              ></Form.Check>
            </Form.Group>

            <Button type='submit' variant='primary'>
              Update
            </Button>
          </Form>
        )}
      </FormContainer>
    </>
  )
}

export default ProductEditScreen
