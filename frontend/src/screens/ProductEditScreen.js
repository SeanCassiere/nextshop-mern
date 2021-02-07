import axios from "axios"
import React, { useState, useEffect } from "react"
import { Link } from "react-router-dom"
import { Form, Button, Row, Col } from "react-bootstrap"
import { useDispatch, useSelector } from "react-redux"

import Message from "../components/Message"
import Loader from "../components/Loader"
import FormContainer from "../components/FormContainer"
import MetaDecorator from "../components/MetaDecorator"

import {
  listProductDetails,
  updateProduct,
} from "../redux/actions/productActions"
import { PRODUCT_UPDATE_RESET } from "../redux/constants/productConstants"

const ProductEditScreen = ({ match, history }) => {
  const productId = match.params.id

  const [name, setName] = useState("")
  const [price, setPrice] = useState(0)
  const [image, setImage] = useState("")
  const [brand, setBrand] = useState("")
  const [category, setCategory] = useState("")
  const [description, setDescription] = useState("")
  const [countInStock, setCountInStock] = useState(0)
  const [isActive, setIsActive] = useState(false)
  const [uploading, setUploading] = useState(false)

  const dispatch = useDispatch()

  const productDetails = useSelector((state) => state.productDetails)
  const { loading, error, product } = productDetails

  const productUpdate = useSelector((state) => state.productUpdate)
  const {
    loading: updateLoading,
    error: updateError,
    success: updateSuccess,
  } = productUpdate

  const userLogin = useSelector((state) => state.userLogin)
  const { userInfo } = userLogin

  const uploadFileHandler = async (e) => {
    const file = e.target.files[0]
    const formData = new FormData()
    formData.append("image", file)
    setUploading(true)

    try {
      const config = {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      }
      const { data } = await axios.post("/api/upload", formData, config)
      setImage(data)
      setUploading(false)
    } catch (error) {
      console.error(error)
      setUploading(false)
    }
  }

  const submitHandler = (e) => {
    e.preventDefault()
    dispatch(
      updateProduct({
        _id: productId,
        name,
        price,
        image,
        brand,
        category,
        description,
        countInStock,
        isActive,
      })
    )
  }

  useEffect(() => {
    if (userInfo && userInfo.isAdmin) {
      if (updateSuccess) {
        dispatch(listProductDetails(productId))
        dispatch({ type: PRODUCT_UPDATE_RESET })
        history.push("/admin/productlist")
      } else {
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
      }
    } else {
      history.push("/login")
    }
  }, [dispatch, history, userInfo, productId, product, updateSuccess])

  return (
    <>
      <Link to={`/admin/productlist`} className='btn btn-light my-3'>
        Go Back
      </Link>
      <FormContainer>
        <h1>Edit Product</h1>

        {updateLoading && <Loader />}
        {updateError && <Message variant='danger'>{updateError}</Message>}

        {loading ? (
          <Loader />
        ) : error ? (
          <Message variant='danger'>{error}</Message>
        ) : (
          <>
            <MetaDecorator title={`Edit Product - ${name}`} />
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
                <Form.File
                  id='img-file'
                  label='Choose File'
                  custom
                  onChange={uploadFileHandler}
                ></Form.File>
                {uploading && <Loader />}
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
                  rows={3}
                  value={description}
                  onChange={(e) => {
                    setDescription(e.target.value)
                  }}
                />
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
                    <Form.Label>Stock</Form.Label>
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
          </>
        )}
      </FormContainer>
    </>
  )
}

export default ProductEditScreen
